import { IsEmail, IsInt, IsNotEmpty, IsOptional, IsString, Min, MinLength } from 'class-validator';

export class LoginDto {
  @IsNotEmpty()
  @IsEmail({}, { message: 'Please enter correct email' })
  readonly email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  readonly password: string;
  @IsNotEmpty()
  @IsString()
  readonly newPassword: string;
  @IsNotEmpty()
  @IsString()
  readonly answer: string;

  @IsOptional() // This decorator makes the role field optional
  @IsInt()
  @Min(0) // Ensures the role is greater than or equal to 0
  role?: number;
}
