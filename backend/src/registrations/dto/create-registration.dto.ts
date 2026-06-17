import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateRegistrationDto {
  @IsString()
  @IsNotEmpty()
  fullName: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  phoneWhatsapp: string;

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
  courseApplyingFor: string;

  @IsOptional()
  @IsString()
  employmentStatus?: string;

  @IsOptional()
  @IsString()
  hasLaptop?: string;

  @IsOptional()
  @IsString()
  learningReason?: string;
}

