import { User } from '@models/user'
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

@Injectable()
export class UserRepository extends Repository<User> {

  constructor(
    @InjectRepository(User)
    userRepository: Repository<User>,
  ) {
    super(
      userRepository.target,
      userRepository.manager,
      userRepository.queryRunner
    );
  }

  findByEmail(email: string): Promise<User> {
    return this.findOne({ 
      where: { email }
    })
  }

}
