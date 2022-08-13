import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { plainToClass } from 'class-transformer';

import { AppLogger } from '../../../shared/logger/logger.service';
import { RequestContext } from '../../../shared/request-context/request-context.dto';
import { ROLE } from '../constants/role.constant';
import { AuthTokenOutput, UserAccessTokenClaims } from '../dtos/auth-token-output.dto';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    private readonly logger: AppLogger,
  ) {
    this.logger.setContext(AuthService.name);
  }

  async validateUser(ctx: RequestContext, email: string, pass: string): Promise<UserAccessTokenClaims> {
    this.logger.log(ctx, `${this.validateUser.name} was called`);

    // Override local auth using default user & pass from .env
    const defaultEmail = this.configService.get('auth.defaultAdminUser');
    const defaultPass = this.configService.get('auth.defaultAdminPassword');

    // Validate user credentials
    if (email !== defaultEmail || pass !== defaultPass) {
      throw new UnauthorizedException('Authentication failed');
    }

    return { id: '0000', email: defaultEmail, roles: [ROLE.INTERNAL] };
  }

  login(ctx: RequestContext): AuthTokenOutput {
    this.logger.log(ctx, `${this.login.name} was called`);

    return this.getAuthToken(ctx, ctx.user);
  }

  async refreshToken(ctx: RequestContext): Promise<AuthTokenOutput> {
    this.logger.log(ctx, `${this.refreshToken.name} was called`);

    const email = this.configService.get('auth.defaultAdminUser');
    if (email !== ctx.user.email) {
      throw new UnauthorizedException('Invalid user id');
    }

    return this.getAuthToken(ctx, { id: '0000', email, roles: [ROLE.INTERNAL] });
  }

  getAuthToken(ctx: RequestContext, user: UserAccessTokenClaims): AuthTokenOutput {
    this.logger.log(ctx, `${this.getAuthToken.name} was called`);

    const subject = { sub: user.id };
    const payload = {
      email: user.email,
      sub: user.id,
      roles: user.roles,
    };

    const authToken = {
      refreshToken: this.jwtService.sign(subject, {
        expiresIn: this.configService.get('jwt.refreshTokenExpiresInSec'),
      }),
      accessToken: this.jwtService.sign(
        { ...payload, ...subject },
        { expiresIn: this.configService.get('jwt.accessTokenExpiresInSec') },
      ),
    };
    return plainToClass(AuthTokenOutput, authToken, {
      excludeExtraneousValues: true,
    });
  }
}
