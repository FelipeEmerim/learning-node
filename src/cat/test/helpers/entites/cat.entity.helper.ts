import { Cat } from '../../../entities/cat.entity';

export class CatEntityHelper {
  static createEntity(): Cat {
    const cat = new Cat();
    cat.id = 1;
    cat.name = 'Robert';
    cat.description = 'Garcia';
    cat.isActive = true;

    return cat;
  }
}
