import { IsEmail, IsString, MinLength, MaxLength, IsOptional, IsEnum } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({ example: 'admin@shipflow.dev' })
  @IsEmail()
  email!: string;

  @ApiProperty({ example: 'SecurePass123!' })
  @IsString()
  @MinLength(8)
  @MaxLength(128)
  password!: string;

  @ApiProperty({ example: 'Rajesh' })
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  firstName!: string;

  @ApiProperty({ example: 'Kumar' })
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  lastName!: string;

  @ApiPropertyOptional({ example: '+91-9876543210' })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({ example: 'SwiftLogistics' })
  @IsOptional()
  @IsString()
  organizationName?: string;

  @ApiPropertyOptional({ enum: ['ADMIN', 'OPERATIONS_MANAGER', 'DISPATCHER', 'DRIVER', 'ANALYST'] })
  @IsOptional()
  @IsEnum(['ADMIN', 'OPERATIONS_MANAGER', 'DISPATCHER', 'DRIVER', 'ANALYST'])
  role?: string;
}
