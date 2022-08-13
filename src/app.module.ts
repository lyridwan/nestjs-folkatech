import { Module } from '@nestjs/common';

import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { SharedModule } from './shared/shared.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [SharedModule, AuthModule, UserModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
