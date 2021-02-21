import { EntityClassOrSchema } from '@nestjs/typeorm/dist/interfaces/entity-class-or-schema.type';
import User from '../../user/entities/user.entity';

export const typeOrmEntities: EntityClassOrSchema[] = [User];
