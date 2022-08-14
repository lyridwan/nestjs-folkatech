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

import { CreateVehicleDto, UpdateVehicleDto } from '../dto/vehicle-request.dto';
import { VehicleOutput } from '../dto/vehicle-response.dto';
import { VehicleDocument } from '../entities/vehicle.entity';
import { VehicleService } from '../services/vehicle.service';

@Controller('vehicles')
@ApiTags('vehicles')
export class VehicleController {
  constructor(private readonly vehicleService: VehicleService, private readonly logger: AppLogger) {
    this.logger.setContext(VehicleController.name);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create vehicle API' })
  @ApiResponse({ status: HttpStatus.OK, type: SwaggerBaseApiResponse(VehicleOutput) })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, type: BaseApiErrorResponse })
  async create(
    @ReqContext() ctx: RequestContext,
    @Body(new ValidationPipe()) createVehicleDto: CreateVehicleDto,
  ): Promise<BaseApiResponse<VehicleOutput>> {
    this.logger.log(ctx, `${this.create.name} was called`);

    const data = await this.vehicleService.create(ctx, createVehicleDto);

    return { data, meta: {} };
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Find vehicle pagination API' })
  @ApiResponse({ status: HttpStatus.OK, type: SwaggerPaginationApiResponse(VehicleOutput) })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, type: BaseApiErrorResponse })
  async findAll(
    @ReqContext() ctx: RequestContext,
    @Query() pagination: PaginationParamsDto,
  ): Promise<PaginationApiResponse<VehicleDocument>> {
    this.logger.log(ctx, `${this.findAll.name} was called`);

    const { items, count } = await this.vehicleService.findAll(ctx, pagination);

    return { data: { items }, meta: { page: pagination.offset, limit: pagination.limit, count } };
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Find vehicle detail API' })
  @ApiResponse({ status: HttpStatus.OK, type: SwaggerBaseApiResponse(VehicleOutput) })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, type: BaseApiErrorResponse })
  async findOne(@ReqContext() ctx: RequestContext, @Param('id') id: string): Promise<BaseApiResponse<VehicleDocument>> {
    this.logger.log(ctx, `${this.findOne.name} was called`);

    const { data, ...meta } = await this.vehicleService.findOne(ctx, id);

    return { data, meta };
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update vehicle API' })
  @ApiResponse({ status: HttpStatus.OK, type: SwaggerBaseApiResponse(VehicleOutput) })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, type: BaseApiErrorResponse })
  async update(
    @ReqContext() ctx: RequestContext,
    @Param('id') id: string,
    @Body(new ValidationPipe()) updateVehicleDto: UpdateVehicleDto,
  ) {
    this.logger.log(ctx, `${this.update.name} was called`);

    const data = await this.vehicleService.update(ctx, id, updateVehicleDto);

    return { data, meta: {} };
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete vehicle API' })
  @ApiResponse({ status: HttpStatus.OK, type: SwaggerBaseApiResponse(VehicleOutput) })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, type: BaseApiErrorResponse })
  async remove(@ReqContext() ctx: RequestContext, @Param('id') id: string) {
    this.logger.log(ctx, `${this.remove.name} was called`);

    const data = await this.vehicleService.remove(ctx, id);

    return { data, meta: {} };
  }
}
