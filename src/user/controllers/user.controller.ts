import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { TransformPlainToClass } from 'class-transformer';
import { IdSchema } from '../../shared/schemas/id.schema';
import User from '../entities/user.entity';
import { UserService } from '../providers/user.service';
import { UserOutputSchema } from '../schemas/user-output.schema';
import { UserSchema } from '../schemas/user.schema';

@Controller('user')
export class UserController {
  // eslint-disable-next-line no-useless-constructor
  constructor(protected userService: UserService) {}

  @Get()
  @TransformPlainToClass(UserOutputSchema)
  list(): Promise<User[]> {
    return this.userService.findAll();
  }

  @Post()
  @TransformPlainToClass(UserOutputSchema)
  post(@Body() user: UserSchema): Promise<User> {
    return this.userService.save(user);
  }

  @Get(':id')
  @TransformPlainToClass(UserOutputSchema)
  get(@Param() params: IdSchema): Promise<User> {
    return this.userService.findOne(params.id);
  }

  @Put(':id')
  @TransformPlainToClass(UserOutputSchema)
  put(@Param() params: IdSchema, @Body() user: UserSchema): Promise<User> {
    return this.userService.update(params.id, user);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  delete(@Param() params: IdSchema): Promise<void> {
    return this.userService.delete(params.id);
  }
}
