import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Cache } from 'cache-manager';
import { Model } from 'mongoose';
import { AuthService } from 'src/modules/auth/services/auth.service';
import { PaginationParamsDto } from 'src/shared/dtos/pagination-params.dto';
import { AppLogger } from 'src/shared/logger/logger.service';
import { RequestContext } from 'src/shared/request-context/request-context.dto';

import { CreateVehicleDto, UpdateVehicleDto } from '../dto/vehicle-request.dto';
import { Vehicle, VehicleDocument } from '../entities/vehicle.entity';

@Injectable()
export class VehicleService {
  constructor(
    @InjectModel(Vehicle.name) private vehicleModel: Model<VehicleDocument>,
    @Inject('RedisStore') private redisCache: Cache,
    private readonly logger: AppLogger,
  ) {
    this.logger.setContext(AuthService.name);
  }

  async create(ctx: RequestContext, createVehicleDto: CreateVehicleDto): Promise<VehicleDocument> {
    this.logger.log(ctx, `${this.create.name} was called`);

    const createdVehicle = new this.vehicleModel(createVehicleDto);

    // sync created data to redis
    await this.redisCache.set(`vehicle-${createdVehicle._id}`, JSON.stringify(createdVehicle));

    return createdVehicle.save();
  }

  async findAll(
    ctx: RequestContext,
    paginationQuery: PaginationParamsDto,
  ): Promise<{ items: VehicleDocument[]; count: number }> {
    this.logger.log(ctx, `${this.findAll.name} was called`);

    const { limit, offset } = paginationQuery;

    const items = await this.vehicleModel
      .find()
      .limit(limit)
      .skip(offset * limit)
      .exec();
    const count = await this.vehicleModel.count();

    return { items, count };
  }

  async findOne(ctx: RequestContext, id: string): Promise<{ data: VehicleDocument; source: string }> {
    this.logger.log(ctx, `${this.findOne.name} was called`);

    const v: string = await this.redisCache.get(`vehicle-${id}`);
    if (v) {
      const vehicle = new this.vehicleModel(JSON.parse(v));
      return { data: vehicle, source: 'redis' };
    }

    const vehicle = await this.vehicleModel.findById(id).exec();
    if (!vehicle) throw new NotFoundException('Vehicle not found');

    // sync retrieved data to redis
    await this.redisCache.set(`vehicle-${id}`, JSON.stringify(vehicle));

    return { data: vehicle, source: 'mongo' };
  }

  async update(ctx: RequestContext, id: string, updateVehicleDto: UpdateVehicleDto): Promise<VehicleDocument> {
    this.logger.log(ctx, `${this.update.name} was called`);

    const vehicle = await this.vehicleModel.findByIdAndUpdate({ _id: id }, updateVehicleDto, {
      returnDocument: 'after',
    });
    if (!vehicle) throw new NotFoundException('Vehicle not found');

    // sync updated data to redis
    await this.redisCache.set(`vehicle-${id}`, JSON.stringify(vehicle));

    return vehicle;
  }

  async remove(ctx: RequestContext, id: string): Promise<VehicleDocument> {
    this.logger.log(ctx, `${this.remove.name} was called`);

    const vehicle = await this.vehicleModel.findByIdAndRemove(id);
    if (!vehicle) throw new NotFoundException('Vehicle not found');

    // sync deleted data to redis
    await this.redisCache.del(`vehicle-${id}`);

    return vehicle;
  }
}
