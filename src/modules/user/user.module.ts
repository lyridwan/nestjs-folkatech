import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SharedModule } from 'src/shared/shared.module';

import { UserController } from './controllers/user.controller';
import { User, UserSchema } from './entities/user.entity';
import { UserService } from './services/user.service';

@Module({
  imports: [SharedModule, MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
