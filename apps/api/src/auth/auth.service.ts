import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  Logger,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { createHash, randomBytes, timingSafeEqual } from 'node:crypto';
import { PrismaService } from '../prisma/prisma.service';
import { RedisService } from '../redis/redis.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { UserRole } from '../enums';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  private readonly SALT_ROUNDS = 12;

  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private redis: RedisService,
  ) {}

  async register(dto: RegisterDto) {
    // Check if user already exists
    const existing = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (existing) {
      throw new ConflictException('User with this email already exists');
    }

    // Hash password
    const passwordHash = await bcrypt.hash(dto.password, this.SALT_ROUNDS);

    // Create organization if name provided, otherwise use default
    let organizationId: string;

    if (dto.organizationName) {
      const org = await this.prisma.organization.create({
        data: {
          name: dto.organizationName,
          slug: this.generateSlug(dto.organizationName),
        },
      });
      organizationId = org.id;
    } else {
      // Find or create default organization
      let defaultOrg = await this.prisma.organization.findFirst({
        where: { slug: 'default' },
      });
      if (!defaultOrg) {
        defaultOrg = await this.prisma.organization.create({
          data: { name: 'Default Organization', slug: 'default' },
        });
      }
      organizationId = defaultOrg.id;
    }

    // Create user
    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        passwordHash,
        firstName: dto.firstName,
        lastName: dto.lastName,
        phone: dto.phone,
        role: (dto.role as UserRole) || UserRole.OPERATIONS_MANAGER,
        organizationId,
      },
      include: { organization: true },
    });

    // Generate tokens
    const tokens = await this.generateTokens(user);

    // Store refresh token
    await this.storeRefreshToken(user.id, tokens.refreshToken);

    this.logger.log(`User registered: ${user.email}`);

    return {
      user: this.sanitizeUser(user),
      ...tokens,
    };
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
      include: { organization: true },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    if (!user.isActive) {
      throw new UnauthorizedException('Account is disabled');
    }

    const isPasswordValid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    // Update last login
    await this.prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    // Generate tokens
    const tokens = await this.generateTokens(user);

    // Store refresh token
    await this.storeRefreshToken(user.id, tokens.refreshToken);

    this.logger.log(`User logged in: ${user.email}`);

    return {
      user: this.sanitizeUser(user),
      ...tokens,
    };
  }

  async loginWithGoogle(profile: {
    googleId: string;
    email: string;
    firstName?: string;
    lastName?: string;
  }) {
    const email = profile.email.trim().toLowerCase();
    const fallbackName = email.split('@')[0] || 'ShipFlow User';
    const firstName = profile.firstName?.trim() || fallbackName;
    const lastName = profile.lastName?.trim() || 'User';

    const user = await this.prisma.$transaction(async (tx) => {
      let account = await tx.user.findUnique({
        where: { googleId: profile.googleId },
        include: { organization: true },
      });

      if (!account) {
        account = await tx.user.findUnique({
          where: { email },
          include: { organization: true },
        });

        if (account) {
          if (account.googleId && account.googleId !== profile.googleId) {
            throw new UnauthorizedException('This email is linked to another Google account');
          }

          account = await tx.user.update({
            where: { id: account.id },
            data: { googleId: profile.googleId, lastLoginAt: new Date() },
            include: { organization: true },
          });
        } else {
          const organizationName = `${firstName}'s Workspace`;
          const organization = await tx.organization.create({
            data: {
              name: organizationName,
              slug: this.generateSlug(organizationName),
            },
          });

          account = await tx.user.create({
            data: {
              email,
              googleId: profile.googleId,
              passwordHash: await bcrypt.hash(randomBytes(32).toString('hex'), this.SALT_ROUNDS),
              firstName,
              lastName,
              role: UserRole.OPERATIONS_MANAGER,
              organizationId: organization.id,
            },
            include: { organization: true },
          });
        }
      }

      if (!account.isActive) {
        throw new UnauthorizedException('Account is disabled');
      }

      return tx.user.update({
        where: { id: account.id },
        data: { lastLoginAt: new Date() },
        include: { organization: true },
      });
    });

    const tokens = await this.generateTokens(user);
    await this.storeRefreshToken(user.id, tokens.refreshToken);

    this.logger.log(`Google sign-in completed: ${user.email}`);

    return {
      user: this.sanitizeUser(user),
      ...tokens,
    };
  }

  async refreshTokens(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET || 'shipflow-jwt-refresh-secret-dev',
      });

      const user = await this.prisma.user.findUnique({
        where: { id: payload.sub },
        include: { organization: true },
      });

      if (!user || !user.isActive) {
        throw new UnauthorizedException('User not found or disabled');
      }

      // Verify against the stored (hashed) refresh token — persisted in the
      // database so sessions survive API restarts.
      if (!user.refreshToken || !this.tokenMatches(refreshToken, user.refreshToken)) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      // Rotate tokens (storing the new one invalidates the old one)
      const tokens = await this.generateTokens(user);
      await this.storeRefreshToken(user.id, tokens.refreshToken);

      return {
        user: this.sanitizeUser(user),
        ...tokens,
      };
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }

  async logout(userId: string) {
    await this.clearRefreshToken(userId);
    this.logger.log(`User logged out: ${userId}`);
  }

  /**
   * Best-effort logout that works even when the session is stale: revokes the
   * stored refresh token if either token still identifies a user.
   */
  async logoutWithTokens(accessToken?: string, refreshToken?: string) {
    const candidates: Array<[string | undefined, string]> = [
      [accessToken, process.env.JWT_SECRET || 'shipflow-jwt-secret-dev'],
      [refreshToken, process.env.JWT_REFRESH_SECRET || 'shipflow-jwt-refresh-secret-dev'],
    ];

    for (const [token, secret] of candidates) {
      if (!token) continue;
      try {
        const payload = this.jwtService.verify(token, { secret });
        if (payload?.sub) {
          await this.logout(payload.sub);
          return;
        }
      } catch {
        // Invalid or expired token: nothing to revoke with it.
      }
    }
  }

  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { organization: true },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return this.sanitizeUser(user);
  }

  async changePassword(userId: string, oldPassword: string, newPassword: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const isOldPasswordValid = await bcrypt.compare(oldPassword, user.passwordHash);
    if (!isOldPasswordValid) {
      throw new BadRequestException('Current password is incorrect');
    }

    const passwordHash = await bcrypt.hash(newPassword, this.SALT_ROUNDS);
    await this.prisma.user.update({
      where: { id: userId },
      data: { passwordHash },
    });

    // Invalidate refresh tokens
    await this.clearRefreshToken(userId);

    this.logger.log(`Password changed for user: ${userId}`);
  }

  // ---- Private Helpers ----

  private async generateTokens(user: any) {
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      organizationId: user.organizationId,
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload),
      this.jwtService.signAsync(payload, {
        secret: process.env.JWT_REFRESH_SECRET || 'shipflow-jwt-refresh-secret-dev',
        expiresIn: process.env.JWT_REFRESH_EXPIRATION || '7d',
      }),
    ]);

    return { accessToken, refreshToken };
  }

  // Refresh tokens are stored as a SHA-256 hash on the user row (never in
  // plain text). One active session per user: storing a new token replaces it.
  private hashToken(token: string): string {
    return createHash('sha256').update(token).digest('hex');
  }

  private tokenMatches(token: string, storedHash: string): boolean {
    const a = Buffer.from(this.hashToken(token), 'hex');
    const b = Buffer.from(storedHash, 'hex');
    return a.length === b.length && timingSafeEqual(a, b);
  }

  private async storeRefreshToken(userId: string, token: string) {
    await this.prisma.user.update({
      where: { id: userId },
      data: { refreshToken: this.hashToken(token) },
    });
  }

  private async clearRefreshToken(userId: string) {
    await this.prisma.user.update({
      where: { id: userId },
      data: { refreshToken: null },
    });
  }

  private sanitizeUser(user: any) {
    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone,
      role: user.role,
      isActive: user.isActive,
      organizationId: user.organizationId,
      organizationName: user.organization?.name,
      lastLoginAt: user.lastLoginAt,
      createdAt: user.createdAt,
    };
  }

  private generateSlug(name: string): string {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
      + '-' + Date.now().toString(36);
  }
}
