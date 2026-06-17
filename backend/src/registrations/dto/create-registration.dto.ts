import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateRegistrationDto {
  @IsString()
  @IsNotEmpty()
  full_name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  phone_whatsapp: string;

  @IsOptional()
  @IsString()
  sex?: string;

  @IsString()
  @IsNotEmpty()
  country: string;

  @IsOptional()
  @IsString()
  state?: string;

  @IsString()
  @IsNotEmpty()
  course_applying_for: string;

  @IsOptional()
  @IsString()
  employment_status?: string;

  @IsOptional()
  @IsString()
  has_laptop?: string;

  @IsOptional()
  @IsString()
  learning_reason?: string;
}