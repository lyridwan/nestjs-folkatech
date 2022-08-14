import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ example: 'John Doe' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(20)
  userName: string;

  @ApiProperty({ example: '081395209331' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(13)
  accountNumber: string;

  @ApiProperty({ example: '3204062210970001' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(16)
  identityNumber: string;
}

export class UpdateUserDto extends PartialType(CreateUserDto) {}
