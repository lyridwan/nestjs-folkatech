import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AuthService } from 'src/modules/auth/services/auth.service';
import { PaginationParamsDto } from 'src/shared/dtos/pagination-params.dto';
import { AppLogger } from 'src/shared/logger/logger.service';
import { RequestContext } from 'src/shared/request-context/request-context.dto';

import { CreateUserDto, UpdateUserDto } from '../dto/user-request.dto';
import { User, UserDocument } from '../entities/user.entity';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>, private readonly logger: AppLogger) {
    this.logger.setContext(AuthService.name);
  }

  async create(ctx: RequestContext, createUserDto: CreateUserDto): Promise<UserDocument> {
    this.logger.log(ctx, `${this.create.name} was called`);

    const createdUser = new this.userModel(createUserDto);
    return createdUser.save();
  }

  async findAll(
    ctx: RequestContext,
    paginationQuery: PaginationParamsDto,
  ): Promise<{ items: UserDocument[]; count: number }> {
    this.logger.log(ctx, `${this.create.name} was called`);

    const { limit, offset } = paginationQuery;

    const items = await this.userModel
      .find()
      .limit(limit)
      .skip(offset * limit)
      .exec();
    const count = await this.userModel.count();

    return { items, count };
  }

  async findByAccountNumber(ctx: RequestContext, accountNumber: string): Promise<UserDocument> {
    this.logger.log(ctx, `${this.findByAccountNumber.name} was called`);

    const user = await this.userModel.findOne({ accountNumber }).exec();
    if (!user) throw new NotFoundException('User not found');

    return user;
  }

  async findByIdentityNumber(ctx: RequestContext, identityNumber: string): Promise<UserDocument> {
    this.logger.log(ctx, `${this.findByIdentityNumber.name} was called`);

    const user = await this.userModel.findOne({ identityNumber }).exec();
    if (!user) throw new NotFoundException('User not found');

    return user;
  }

  async update(ctx: RequestContext, id: string, updateUserDto: UpdateUserDto): Promise<UserDocument> {
    this.logger.log(ctx, `${this.update.name} was called`);

    const user = await this.userModel.findByIdAndUpdate({ _id: id }, updateUserDto);
    if (!user) throw new NotFoundException('User not found');

    return user;
  }

  async remove(ctx: RequestContext, id: string): Promise<UserDocument> {
    this.logger.log(ctx, `${this.remove.name} was called`);

    const user = await this.userModel.findByIdAndRemove(id);
    if (!user) throw new NotFoundException('User not found');

    return user;
  }
}
