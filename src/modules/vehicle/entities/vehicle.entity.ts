import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

import { VehicleTypeEnum } from '../dto/vehicle-request.dto';

export type VehicleDocument = Vehicle & Document;

@Schema()
export class Vehicle {
  @Prop()
  @Prop({ required: true })
  vehicleType: VehicleTypeEnum;

  @Prop()
  @Prop({ required: true })
  vehicleBrand: string;

  @Prop()
  @Prop({ index: true, unique: true, required: true })
  vehicleSerialNumber: string;
}

export const VehicleSchema = SchemaFactory.createForClass(Vehicle);
