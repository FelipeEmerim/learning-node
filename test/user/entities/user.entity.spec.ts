import { assert } from 'chai';
import User from '../../../src/user/entities/user.entity';

describe('User entity', () => {
  it('Should make empty user', () => {
    const user = new User();
    assert.isOk(user);
    assert.isUndefined(user.firstName);
    assert.isUndefined(user.lastName, '');
    assert.isUndefined(user.password);
    assert.isUndefined(user.isActive);
  });
});
