import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class LoginInput {
  @IsNotEmpty()
  @ApiProperty({ example: 'admin@default.com' })
  @IsEmail()
  @MaxLength(50)
  email: string;

  @IsNotEmpty()
  @ApiProperty({ example: 'admin' })
  @IsString()
  password: string;
}
