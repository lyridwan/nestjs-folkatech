import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNumber, IsOptional, Min } from 'class-validator';

export class PaginationParamsDto {
  @ApiPropertyOptional({ description: 'Optional, defaults to 10', type: Number })
  @IsNumber()
  @IsOptional()
  @Min(5)
  @Transform(({ value }) => parseInt(value, 10), { toClassOnly: true })
  limit = 10;

  @ApiPropertyOptional({ description: 'Optional, defaults to 0', type: Number })
  @IsNumber()
  @IsOptional()
  @Min(0)
  @Transform(({ value }) => parseInt(value, 10), { toClassOnly: true })
  offset = 0;
}
