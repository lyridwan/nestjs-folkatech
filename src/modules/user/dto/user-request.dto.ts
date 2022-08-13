import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateUserDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @MaxLength(20)
  userName: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  accountNumber: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  identityNumber: string;
}

export class UpdateUserDto extends PartialType(CreateUserDto) {}
