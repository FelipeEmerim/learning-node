import { Cat } from '../../../entities/cat.entity';

export class CatEntityHelper {
  static createEntity(): Cat {
    const cat = new Cat();
    cat.id = '7ef3c0ba-03d7-49e4-8d83-7b7b6c8eb929';
    cat.name = 'Robert';
    cat.description = 'Garcia';
    cat.isActive = true;

    return cat;
  }
}
