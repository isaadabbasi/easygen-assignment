import { User } from '@models/user'
import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm'

@Injectable()
export class UserRepository extends Repository<User> {

  constructor(
    private readonly datasource: DataSource,
  ) {
    super(User, datasource.createEntityManager());
  }

  findByEmail(email: string): Promise<User> {
    return this.findOne({ 
      where: { email }
    })
  }

  saveUserWithHashedPwd(user: Partial<User>, hash: string): Promise<User> {
    const _user = { ...user, password: hash }
    return this.save(_user)
  }

}
