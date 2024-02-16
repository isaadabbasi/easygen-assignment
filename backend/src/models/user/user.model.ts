import {
  Column,
  Entity,
  Index,
} from 'typeorm';

import { Base } from 'src/models/base'

@Entity()
export class User extends Base {

  @Index()
  @Column({ nullable: false, unique: true })
  email: string

  @Column({ nullable: true })
  name: string

  @Column({ nullable: false, select: false })
  password: string

  @Column({ nullable: true, select: false })
  refreshToken: string

}
