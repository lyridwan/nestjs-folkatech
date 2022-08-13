import { ApiProperty } from '@nestjs/swagger';

export class BaseApiResponse<T> {
  @ApiProperty()
  public statusCode?: number;

  @ApiProperty()
  public statusMessage?: string;

  @ApiProperty()
  public message?: string;

  @ApiProperty({ type: Object })
  public error?: string;

  public data: T; // Swagger Decorator is added in the extended class below, since that will override this one.

  @ApiProperty({ type: Object })
  public meta: any;
}

export function SwaggerBaseApiResponse<T>(type: T): typeof BaseApiResponse {
  class ExtendedBaseApiResponse<T> extends BaseApiResponse<T> {
    @ApiProperty({ type })
    public data: T;
  }
  // NOTE : Overwrite the returned class name, otherwise whichever type calls this function in the last,
  // will overwrite all previous definitions. i.e., Swagger will have all response types as the same one.
  const isAnArray = Array.isArray(type) ? ' [ ] ' : '';
  Object.defineProperty(ExtendedBaseApiResponse, 'name', {
    value: `SwaggerBaseApiResponseFor ${type} ${isAnArray}`,
  });

  return ExtendedBaseApiResponse;
}

class PaginationItems<T> {
  public items: T[];
}

class Pagination {
  @ApiProperty()
  public itemCount: number;

  @ApiProperty()
  public totalItems: number;

  @ApiProperty()
  public itemsPerPage: number;

  @ApiProperty()
  public totalPages: number;

  @ApiProperty()
  public currentPage: number;
}

export class PaginationApiResponse<T> {
  @ApiProperty()
  public statusCode?: number;

  @ApiProperty()
  public statusMessage?: string;

  @ApiProperty()
  public message?: string;

  @ApiProperty({ type: Object })
  public error?: string;

  public data: PaginationItems<T>; // Swagger Decorator is added in the extended class below, since that will override this one.

  @ApiProperty({ type: Pagination })
  public meta: object;
}

export function SwaggerPaginationApiResponse<T>(type: T): typeof PaginationApiResponse {
  class Items<T> {
    @ApiProperty({ type: [type] })
    public items: T[];
  }

  class ExtendedPaginationApiResponse<T> extends PaginationApiResponse<T> {
    @ApiProperty()
    public data: Items<T>;
  }
  // NOTE : Overwrite the returned class name, otherwise whichever type calls this function in the last,
  // will overwrite all previous definitions. i.e., Swagger will have all response types as the same one.
  const isAnArray = Array.isArray(type) ? ' [ ] ' : '';
  Object.defineProperty(ExtendedPaginationApiResponse, 'name', {
    value: `SwaggerPaginationApiResponseFor ${type} ${isAnArray}`,
  });

  return ExtendedPaginationApiResponse;
}

class MetaErrorObject {
  @ApiProperty({ type: String })
  public path: string;

  @ApiProperty({ type: String })
  public requestId: string;

  @ApiProperty({ type: String })
  public timestamp: string;
}

export class BaseApiErrorResponse {
  @ApiProperty({ type: Number })
  public statusCode: number;

  @ApiProperty({ type: String })
  public sttatusMessage: string;

  @ApiProperty({ type: String })
  public errorName: string;

  @ApiProperty({ type: String })
  public message: string;

  @ApiProperty({ type: Object })
  public error: unknown;

  @ApiProperty({ type: MetaErrorObject })
  public meta: MetaErrorObject;
}
