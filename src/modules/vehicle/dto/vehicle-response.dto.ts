import { PartialType } from '@nestjs/swagger';

import { CreateVehicleDto } from './vehicle-request.dto';

export class VehicleOutput extends PartialType(CreateVehicleDto) {}
