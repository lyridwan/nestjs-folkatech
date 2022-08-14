import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString, MaxLength } from 'class-validator';

export enum VehicleTypeEnum {
  CAR = 'CAR',
  BIKE = 'BIKE',
  OTHER = 'OTHER',
}

export class CreateVehicleDto {
  @ApiProperty({ example: VehicleTypeEnum.CAR })
  @IsNotEmpty()
  @IsEnum(VehicleTypeEnum)
  vehicleType: VehicleTypeEnum;

  @ApiProperty({ example: 'Toyota' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(20)
  vehicleBrand: string;

  @ApiProperty({ example: 'D 4040 FND' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(10)
  vehicleSerialNumber: string;
}

export class UpdateVehicleDto extends PartialType(CreateVehicleDto) {}
