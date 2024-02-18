import { User } from '@models/user';
import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class UserRepository extends Repository<User> {
  constructor(private readonly datasource: DataSource) {
    super(User, datasource.createEntityManager());
  }

  findByEmail(email: string): Promise<User> {
    return this.findOne({
      where: { email },
    });
  }

  /**
   * @notice - {select: false} seem to not work for mongodb, probably a TYPEORM-with-mongodb issue.
   * Just a hacky work around
   */
  trimSecretFields(user: User): Partial<User> {
    const { password: _, refreshToken, secret, ..._user } = user;
    return _user;
  }

  saveUserWithHashedPwd(user: Partial<User>, hash: string): Promise<User> {
    const _user = { ...user, password: hash };
    return this.save(_user);
  }
}
