import { CACHE_MANAGER, CacheModule, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as redisStore from 'cache-manager-redis-store';

@Module({
  imports: [
    CacheModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        store: redisStore,
        host: configService.get('redis.host'),
        port: configService.get('redis.port'),
        ttl: 600,
      }),
    }),
  ],
  providers: [
    {
      provide: 'RedisStore',
      useExisting: CACHE_MANAGER,
    },
  ],
  exports: ['RedisStore'],
})
export class RedisStoreModule {}
