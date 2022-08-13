import { PartialType } from '@nestjs/swagger';

import { CreateUserDto } from './user-request.dto';

export class UserOutput extends PartialType(CreateUserDto) {}
