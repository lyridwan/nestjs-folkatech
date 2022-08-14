import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SharedModule } from 'src/shared/shared.module';

import { VehicleController } from './controllers/vehicle.controller';
import { Vehicle, VehicleSchema } from './entities/vehicle.entity';
import { VehicleService } from './services/vehicle.service';

@Module({
  imports: [SharedModule, MongooseModule.forFeature([{ name: Vehicle.name, schema: VehicleSchema }])],
  controllers: [VehicleController],
  providers: [VehicleService],
})
export class VehicleModule {}
