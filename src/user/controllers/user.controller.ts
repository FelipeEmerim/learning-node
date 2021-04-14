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
import {
  ApiBody,
  ApiNotFoundResponse,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';
import { TransformPlainToClass } from 'class-transformer';
import { ErrorSchema } from '../../shared/swagger/types/error.schema';
import { ValidationErrorSchema } from '../../shared/swagger/types/validation-error.schema';
import { IdSchema } from '../../shared/schemas/id.schema';
import User from '../entities/user.entity';
import { UserService } from '../providers/user.service';
import { UserOutputSchema } from '../schemas/user-output.schema';
import { UserUpdateSchema } from '../schemas/user-update.schema';
import { UserSchema } from '../schemas/user.schema';

@Controller('user')
@ApiTags('User')
export class UserController {
  // eslint-disable-next-line no-useless-constructor
  constructor(protected userService: UserService) {}

  @Get()
  @ApiOperation({ summary: 'List users' })
  @ApiResponse({
    status: 200,
    description: 'Succesfully list users',
    type: [UserOutputSchema],
  })
  @TransformPlainToClass(UserOutputSchema)
  list(): Promise<User[]> {
    return this.userService.findAll();
  }

  @Post()
  @ApiOperation({ summary: 'Create user' })
  @ApiBody({
    type: UserSchema,
    description: 'User data',
  })
  @ApiResponse({
    status: 201,
    description: 'Succesfully created user',
    type: UserOutputSchema,
  })
  @ApiUnprocessableEntityResponse({
    description: 'One or more validation constraints were violated',
    type: ValidationErrorSchema,
  })
  @TransformPlainToClass(UserOutputSchema)
  post(@Body() user: UserSchema): Promise<User> {
    return this.userService.create(user);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user by id' })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'The id of the user to search for',
    type: Number,
  })
  @ApiResponse({
    status: 200,
    description: 'Succesfully got user',
    type: UserOutputSchema,
  })
  @ApiNotFoundResponse({
    description: 'Could not find user',
    type: ErrorSchema,
  })
  @TransformPlainToClass(UserOutputSchema)
  get(@Param() params: IdSchema): Promise<User> {
    return this.userService.findOne(params.id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update user' })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'The id of the user to search for',
    type: Number,
  })
  @ApiBody({
    type: UserUpdateSchema,
    description: 'User data',
  })
  @ApiResponse({
    status: 200,
    description: 'Succesfully updated users',
    type: UserOutputSchema,
  })
  @ApiUnprocessableEntityResponse({
    description: 'One or more validation constraints were violated',
    type: ValidationErrorSchema,
  })
  @ApiNotFoundResponse({
    description: 'Could not find user',
    type: ErrorSchema,
  })
  @TransformPlainToClass(UserOutputSchema)
  put(
    @Param() params: IdSchema,
    @Body() userUpdateSchema: UserUpdateSchema,
  ): Promise<User> {
    const user = userUpdateSchema;

    user.id = params.id;
    return this.userService.update(user);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete user' })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'The id of the user to search for',
    type: Number,
  })
  @ApiNotFoundResponse({
    description: 'Could not find user',
    type: ErrorSchema,
  })
  @ApiResponse({
    status: 204,
    description: 'Succesfully deleted user',
  })
  delete(@Param() params: IdSchema): Promise<void> {
    return this.userService.delete(params.id);
  }
}
