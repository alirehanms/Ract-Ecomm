import { IsInt, IsOptional, Min } from "class-validator";

export class CreateUserDto {
  name: string;
  email: string;
  password: string;
  answer: string;
  phone: string;
  address: string;
  @IsOptional() // This decorator makes the role field optional
  @IsInt()
  @Min(0) // Ensures the role is greater than or equal to 0
  role?: number;
}
