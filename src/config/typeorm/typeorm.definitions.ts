import { EntityClassOrSchema } from '@nestjs/typeorm/dist/interfaces/entity-class-or-schema.type';
import UserModel from '../../user/models/user.model';

export const typeOrmEntities: EntityClassOrSchema[] = [UserModel];
