import {
  Controller,
  Post,
  Get,
  Body,
  Req,
  Res,
  UseGuards,
  HttpCode,
  HttpStatus,
  Logger,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { Response, Request } from 'express';
import { createHash, randomBytes } from 'node:crypto';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { CurrentUser } from './decorators/current-user.decorator';
import { RedisService } from '../redis/redis.service';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(
    private readonly authService: AuthService,
    private readonly redis: RedisService,
  ) {}

  @Get('google')
  @ApiOperation({ summary: 'Start Google OAuth sign-in or registration' })
  async startGoogleOAuth(@Res() res: Response) {
    const clientId = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
    if (!clientId?.endsWith('.apps.googleusercontent.com') || !clientSecret) {
      return res.redirect(this.webRedirect('/login', 'google_not_configured'));
    }

    const state = randomBytes(32).toString('hex');
    const codeVerifier = randomBytes(48).toString('base64url');
    const codeChallenge = createHash('sha256').update(codeVerifier).digest('base64url');
    await this.redis.set(`oauth:google:${state}`, JSON.stringify({ codeVerifier }), 300);

    res.cookie('googleOAuthState', state, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 5 * 60 * 1000,
      path: '/api/v1/auth/google/callback',
    });

    const authorizationUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
    authorizationUrl.search = new URLSearchParams({
      client_id: clientId,
      redirect_uri: this.googleCallbackUrl(),
      response_type: 'code',
      scope: 'openid email profile',
      state,
      code_challenge: codeChallenge,
      code_challenge_method: 'S256',
      prompt: 'select_account',
    }).toString();

    return res.redirect(authorizationUrl.toString());
  }

  @Get('google/callback')
  @ApiOperation({ summary: 'Complete Google OAuth sign-in or registration' })
  async completeGoogleOAuth(
    @Query('code') code: string | undefined,
    @Query('state') state: string | undefined,
    @Query('error') providerError: string | undefined,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    res.clearCookie('googleOAuthState', { path: '/api/v1/auth/google/callback' });

    if (providerError) {
      return res.redirect(this.webRedirect('/login', 'google_cancelled'));
    }

    const stateCookie = req.cookies?.googleOAuthState as string | undefined;
    const stateKey = state ? `oauth:google:${state}` : '';
    const stateData = state && stateCookie === state ? await this.redis.get(stateKey) : null;
    if (!code || !state || stateCookie !== state || !stateData) {
      return res.redirect(this.webRedirect('/login', 'google_invalid_state'));
    }

    await this.redis.del(stateKey);

    try {
      const { codeVerifier } = JSON.parse(stateData) as { codeVerifier: string };
      const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          code,
          client_id: process.env.GOOGLE_CLIENT_ID || '',
          client_secret: process.env.GOOGLE_CLIENT_SECRET || '',
          redirect_uri: this.googleCallbackUrl(),
          grant_type: 'authorization_code',
          code_verifier: codeVerifier,
        }),
        signal: AbortSignal.timeout(10_000),
      });

      if (!tokenResponse.ok) {
        throw new Error(`Google token exchange returned HTTP ${tokenResponse.status}`);
      }

      const tokens = await tokenResponse.json() as { access_token?: string };
      if (!tokens.access_token) throw new Error('Google did not return an access token');

      const profileResponse = await fetch('https://openidconnect.googleapis.com/v1/userinfo', {
        headers: { Authorization: `Bearer ${tokens.access_token}` },
        signal: AbortSignal.timeout(10_000),
      });
      if (!profileResponse.ok) {
        throw new Error(`Google profile request returned HTTP ${profileResponse.status}`);
      }

      const profile = await profileResponse.json() as {
        sub?: string;
        email?: string;
        email_verified?: boolean;
        given_name?: string;
        family_name?: string;
      };
      if (!profile.sub || !profile.email || profile.email_verified !== true) {
        throw new Error('Google account has no verified email address');
      }

      const result = await this.authService.loginWithGoogle({
        googleId: profile.sub,
        email: profile.email,
        firstName: profile.given_name,
        lastName: profile.family_name,
      });

      this.setAuthCookies(res, result.accessToken, result.refreshToken);

      return res.redirect(this.webRedirect('/dashboard'));
    } catch (error) {
      this.logger.error('Google OAuth sign-in failed', error instanceof Error ? error.stack : undefined);
      return res.redirect(this.webRedirect('/login', 'google_failed'));
    }
  }

  @Post('register')
  @ApiOperation({ summary: 'Register a new user and organization' })
  async register(@Body() dto: RegisterDto, @Res({ passthrough: true }) res: Response) {
    const result = await this.authService.register(dto);
    this.setAuthCookies(res, result.accessToken, result.refreshToken);

    return {
      success: true,
      data: {
        user: result.user,
        accessToken: result.accessToken,
      },
    };
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login with email and password' })
  async login(@Body() dto: LoginDto, @Res({ passthrough: true }) res: Response) {
    const result = await this.authService.login(dto);
    this.setAuthCookies(res, result.accessToken, result.refreshToken);

    return {
      success: true,
      data: {
        user: result.user,
        accessToken: result.accessToken,
      },
    };
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Refresh access token' })
  async refresh(
    @Body() dto: RefreshTokenDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    // Try body first, then cookie
    const refreshToken = dto.refreshToken || (req.cookies?.refreshToken as string);

    if (!refreshToken) {
      return { success: false, error: 'Refresh token required' };
    }

    const result = await this.authService.refreshTokens(refreshToken);

    this.setAuthCookies(res, result.accessToken, result.refreshToken);

    return {
      success: true,
      data: {
        user: result.user,
        accessToken: result.accessToken,
      },
    };
  }

  // Not guarded on purpose: a client holding an expired/invalid session must
  // still be able to clear its httpOnly auth cookies, otherwise it gets stuck.
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Logout, invalidate tokens and clear auth cookies' })
  async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const bearer = req.headers.authorization?.replace(/^Bearer\s+/i, '');
    await this.authService.logoutWithTokens(
      (req.cookies?.accessToken as string | undefined) || bearer,
      req.cookies?.refreshToken as string | undefined,
    );

    res.clearCookie('refreshToken', { path: '/api/v1/auth' });
    res.clearCookie('accessToken', { path: '/' });

    return { success: true, message: 'Logged out successfully' };
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user profile' })
  async getProfile(@CurrentUser() user: any) {
    const profile = await this.authService.getProfile(user.id);
    return { success: true, data: profile };
  }

  @Post('change-password')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Change password' })
  async changePassword(@CurrentUser() user: any, @Body() dto: ChangePasswordDto) {
    await this.authService.changePassword(user.id, dto.oldPassword, dto.newPassword);
    return { success: true, message: 'Password changed successfully' };
  }

  private googleCallbackUrl(): string {
    return process.env.GOOGLE_CALLBACK_URL ||
      `${process.env.API_URL || `http://localhost:${process.env.API_PORT || 3002}`}/api/v1/auth/google/callback`;
  }

  private webRedirect(path: string, error?: string): string {
    const url = new URL(path, process.env.WEB_APP_URL || 'http://localhost:3001');
    if (error) url.searchParams.set('oauthError', error);
    return url.toString();
  }

  private setAuthCookies(res: Response, accessToken: string, refreshToken: string): void {
    const secure = process.env.NODE_ENV === 'production';
    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure,
      sameSite: 'lax',
      maxAge: 15 * 60 * 1000,
      path: '/',
    });
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure,
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: '/api/v1/auth',
    });
  }
}
