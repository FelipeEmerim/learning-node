import { EntityClassOrSchema } from '@nestjs/typeorm/dist/interfaces/entity-class-or-schema.type';
import User from '../../user/models/user.model';

export const typeOrmEntities: EntityClassOrSchema[] = [User];
