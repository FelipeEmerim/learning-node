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
import { CatService } from '../providers/cat.service';
import { CatOutputSchema } from '../schemas/cat-output.schema';
import { CatUpdateSchema } from '../schemas/cat-update.schema';
import { CatSchema } from '../schemas/cat.schema';
import { Cat } from '../entities/cat.entity';

@Controller('cat')
@ApiTags('Cat')
export class CatController {
  // eslint-disable-next-line no-useless-constructor
  constructor(protected catService: CatService) {}

  @Get()
  @ApiOperation({ summary: 'List cats' })
  @ApiResponse({
    status: 200,
    description: 'Succesfully list cats',
    type: [CatOutputSchema],
  })
  @TransformPlainToClass(CatOutputSchema)
  list(): Promise<Cat[]> {
    return this.catService.findAll();
  }

  @Post()
  @ApiOperation({ summary: 'Create cat' })
  @ApiBody({
    type: CatSchema,
    description: 'Cat data',
  })
  @ApiResponse({
    status: 201,
    description: 'Succesfully created cat',
    type: CatOutputSchema,
  })
  @ApiUnprocessableEntityResponse({
    description: 'One or more validation constraints were violated',
    type: ValidationErrorSchema,
  })
  @TransformPlainToClass(CatOutputSchema)
  post(@Body() cat: CatSchema): Promise<Cat> {
    return this.catService.create(cat);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get cat by id' })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'The id of the cat to search for',
    type: Number,
  })
  @ApiResponse({
    status: 200,
    description: 'Succesfully got cat',
    type: CatOutputSchema,
  })
  @ApiNotFoundResponse({
    description: 'Could not find cat',
    type: ErrorSchema,
  })
  @TransformPlainToClass(CatOutputSchema)
  get(@Param() params: IdSchema): Promise<Cat> {
    return this.catService.findOne(params.id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update cat' })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'The id of the cat to search for',
    type: Number,
  })
  @ApiBody({
    type: CatUpdateSchema,
    description: 'Cat data',
  })
  @ApiResponse({
    status: 200,
    description: 'Succesfully updated cat',
    type: CatOutputSchema,
  })
  @ApiUnprocessableEntityResponse({
    description: 'One or more validation constraints were violated',
    type: ValidationErrorSchema,
  })
  @ApiNotFoundResponse({
    description: 'Could not find cat',
    type: ErrorSchema,
  })
  @TransformPlainToClass(CatOutputSchema)
  put(
    @Param() params: IdSchema,
    @Body() catUpdateSchema: CatUpdateSchema,
  ): Promise<Cat> {
    const cat = catUpdateSchema;

    cat.id = params.id;
    return this.catService.update(cat);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete cat' })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'The id of the cat to search for',
    type: Number,
  })
  @ApiNotFoundResponse({
    description: 'Could not find cat',
    type: ErrorSchema,
  })
  @ApiResponse({
    status: 204,
    description: 'Succesfully deleted cat',
  })
  delete(@Param() params: IdSchema): Promise<void> {
    return this.catService.delete(params.id);
  }
}
