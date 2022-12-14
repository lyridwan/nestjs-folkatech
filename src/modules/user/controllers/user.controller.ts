import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import {
  BaseApiErrorResponse,
  BaseApiResponse,
  PaginationApiResponse,
  SwaggerBaseApiResponse,
  SwaggerPaginationApiResponse,
} from 'src/shared/dtos/base-api-response.dto';
import { PaginationParamsDto } from 'src/shared/dtos/pagination-params.dto';
import { AppLogger } from 'src/shared/logger/logger.service';
import { ReqContext } from 'src/shared/request-context/req-context.decorator';
import { RequestContext } from 'src/shared/request-context/request-context.dto';

import { CreateUserDto, UpdateUserDto } from '../dto/user-request.dto';
import { UserOutput } from '../dto/user-response.dto';
import { UserDocument } from '../entities/user.entity';
import { UserService } from '../services/user.service';

@Controller('users')
@ApiTags('users')
export class UserController {
  constructor(private readonly userService: UserService, private readonly logger: AppLogger) {
    this.logger.setContext(UserController.name);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create user API' })
  @ApiResponse({ status: HttpStatus.OK, type: SwaggerBaseApiResponse(UserOutput) })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, type: BaseApiErrorResponse })
  async create(
    @ReqContext() ctx: RequestContext,
    @Body(new ValidationPipe()) createUserDto: CreateUserDto,
  ): Promise<BaseApiResponse<UserOutput>> {
    this.logger.log(ctx, `${this.create.name} was called`);

    const data = await this.userService.create(ctx, createUserDto);

    return { data, meta: {} };
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Find user pagination API' })
  @ApiResponse({ status: HttpStatus.OK, type: SwaggerPaginationApiResponse(UserOutput) })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, type: BaseApiErrorResponse })
  async findAll(
    @ReqContext() ctx: RequestContext,
    @Query() pagination: PaginationParamsDto,
  ): Promise<PaginationApiResponse<UserDocument>> {
    this.logger.log(ctx, `${this.findAll.name} was called`);

    const { items, count } = await this.userService.findAll(ctx, pagination);

    return { data: { items }, meta: { page: pagination.offset, limit: pagination.limit, count } };
  }

  @Get('/account/:accountNumber')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Find user detail by account number API' })
  @ApiResponse({ status: HttpStatus.OK, type: SwaggerBaseApiResponse(UserOutput) })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, type: BaseApiErrorResponse })
  async findByAccountNumber(
    @ReqContext() ctx: RequestContext,
    @Param('accountNumber') accountNumber: string,
  ): Promise<BaseApiResponse<UserDocument>> {
    this.logger.log(ctx, `${this.findByAccountNumber.name} was called`);

    const data = await this.userService.findByAccountNumber(ctx, accountNumber);

    return { data, meta: {} };
  }

  @Get('/identity/:identityNumber')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Find user detail by identity number API' })
  @ApiResponse({ status: HttpStatus.OK, type: SwaggerBaseApiResponse(UserOutput) })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, type: BaseApiErrorResponse })
  async findByIdentityNumber(
    @ReqContext() ctx: RequestContext,
    @Param('identityNumber') identityNumber: string,
  ): Promise<BaseApiResponse<UserDocument>> {
    this.logger.log(ctx, `${this.findByAccountNumber.name} was called`);

    const data = await this.userService.findByIdentityNumber(ctx, identityNumber);

    return { data, meta: {} };
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update user API' })
  @ApiResponse({ status: HttpStatus.OK, type: SwaggerBaseApiResponse(UserOutput) })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, type: BaseApiErrorResponse })
  async update(
    @ReqContext() ctx: RequestContext,
    @Param('id') id: string,
    @Body(new ValidationPipe()) updateUserDto: UpdateUserDto,
  ) {
    this.logger.log(ctx, `${this.update.name} was called`);

    const data = await this.userService.update(ctx, id, updateUserDto);

    return { data, meta: {} };
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete user API' })
  @ApiResponse({ status: HttpStatus.OK, type: SwaggerBaseApiResponse(UserOutput) })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, type: BaseApiErrorResponse })
  async remove(@ReqContext() ctx: RequestContext, @Param('id') id: string) {
    this.logger.log(ctx, `${this.remove.name} was called`);

    const data = await this.userService.remove(ctx, id);

    return { data, meta: {} };
  }
}
