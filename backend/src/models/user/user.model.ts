import {
  Column,
  Entity,
  Index,
} from 'typeorm';

import { Base } from 'src/models/base'

@Entity()
export class User extends Base {

  @Index()
  @Column({ nullable: false })
  email: string

  @Column({ nullable: true })
  name: string

  @Column({ nullable: false, select: false })
  password: string

}
