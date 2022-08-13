import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsMobilePhone,
  IsNotEmpty,
  IsString,
  Length,
  MaxLength,
} from 'class-validator';

import { ROLE } from '../constants/role.constant';

export class RegisterInput {
  @ApiProperty()
  @IsNotEmpty()
  @MaxLength(100)
  @IsString()
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  @MaxLength(100)
  email: string;

  @ApiProperty()
  @IsMobilePhone('id-ID')
  phone: string;

  @ApiProperty()
  @IsNotEmpty()
  @Length(6, 100)
  @IsString()
  password: string;

  // These keys can only be set by ADMIN user.
  roles: ROLE[] = [ROLE.USER];
  isAccountDisabled: boolean;
}
