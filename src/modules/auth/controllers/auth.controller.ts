import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { ApiExcludeEndpoint, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import {
  BaseApiErrorResponse,
  BaseApiResponse,
  SwaggerBaseApiResponse,
} from '../../../shared/dtos/base-api-response.dto';
import { AppLogger } from '../../../shared/logger/logger.service';
import { ReqContext } from '../../../shared/request-context/req-context.decorator';
import { RequestContext } from '../../../shared/request-context/request-context.dto';
import { LoginInput } from '../dtos/auth-login-input.dto';
import { AuthTokenOutput } from '../dtos/auth-token-output.dto';
import { JwtRefreshGuard } from '../guards/jwt-refresh.guard';
import { LocalAuthGuard } from '../guards/local-auth.guard';
import { AuthService } from '../services/auth.service';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService, private readonly logger: AppLogger) {
    this.logger.setContext(AuthController.name);
  }

  @Post('login')
  @ApiOperation({ summary: 'User login API' })
  @ApiResponse({ status: HttpStatus.OK, type: SwaggerBaseApiResponse(AuthTokenOutput) })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, type: BaseApiErrorResponse })
  @HttpCode(HttpStatus.OK)
  @UseGuards(LocalAuthGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  login(
    @ReqContext() ctx: RequestContext,
    @Body(new ValidationPipe()) credential: LoginInput,
  ): BaseApiResponse<AuthTokenOutput> {
    this.logger.log(ctx, `${this.login.name} was called`, credential);

    const authToken = this.authService.login(ctx);
    return { data: authToken, meta: {} };
  }

  @Post('refresh-token')
  @ApiOperation({ summary: 'Refresh access token API' })
  @ApiResponse({ status: HttpStatus.OK, type: SwaggerBaseApiResponse(AuthTokenOutput) })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, type: BaseApiErrorResponse })
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtRefreshGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiExcludeEndpoint()
  async refreshToken(@ReqContext() ctx: RequestContext): Promise<BaseApiResponse<AuthTokenOutput>> {
    this.logger.log(ctx, `${this.refreshToken.name} was called`);

    const authToken = await this.authService.refreshToken(ctx);
    return { data: authToken, meta: {} };
  }
}
