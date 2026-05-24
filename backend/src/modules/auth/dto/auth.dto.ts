import {
  IsEmail,
  IsString,
  MinLength,
  MaxLength,
  IsEnum,
  IsOptional,
  IsPhoneNumber,
  Matches,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';

export class RegisterDto {
  @ApiProperty({ example: 'Behzod' })
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  firstName: string;

  @ApiProperty({ example: 'Rasulov' })
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  lastName: string;

  @ApiProperty({ example: 'behzod@example.com' })
  @IsEmail()
  email: string;

  @ApiPropertyOptional({ example: '+998901234567' })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({ example: 'StrongPass123!' })
  @IsString()
  @MinLength(8)
  @MaxLength(100)
  @Matches(/^(?=.*[A-Z])(?=.*[0-9])/, {
    message: 'Password must contain at least one uppercase letter and one number',
  })
  password: string;

  @ApiProperty({ enum: UserRole, example: UserRole.CLIENT })
  @IsEnum(UserRole)
  role: UserRole;
}

export class LoginDto {
  @ApiProperty({ example: 'behzod@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'StrongPass123!' })
  @IsString()
  password: string;
}

export class RefreshTokenDto {
  @ApiProperty()
  @IsString()
  refreshToken: string;
}

export class ForgotPasswordDto {
  @ApiProperty({ example: 'behzod@example.com' })
  @IsEmail()
  email: string;
}

export class ResetPasswordDto {
  @ApiProperty()
  @IsString()
  token: string;

  @ApiProperty({ example: 'NewPass123!' })
  @IsString()
  @MinLength(8)
  @Matches(/^(?=.*[A-Z])(?=.*[0-9])/, {
    message: 'Password must contain at least one uppercase letter and one number',
  })
  password: string;
}

export class VerifyEmailDto {
  @ApiProperty()
  @IsString()
  token: string;
}

export class VerifyPhoneDto {
  @ApiProperty({ example: '123456' })
  @IsString()
  @MinLength(6)
  @MaxLength(6)
  code: string;
}

export class ChangePasswordDto {
  @ApiProperty()
  @IsString()
  currentPassword: string;

  @ApiProperty({ example: 'NewPass123!' })
  @IsString()
  @MinLength(8)
  @Matches(/^(?=.*[A-Z])(?=.*[0-9])/, {
    message: 'Password must contain at least one uppercase letter and one number',
  })
  newPassword: string;
}
