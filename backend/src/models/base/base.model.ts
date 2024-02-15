import {
  CreateDateColumn,
  Entity,
  ObjectId,
  ObjectIdColumn,
  UpdateDateColumn,
} from 'typeorm'

@Entity()
export class Base {

  @ObjectIdColumn()
  _id: ObjectId

  @CreateDateColumn({ type: 'timestamp with time zone' })
  createdAt: Date

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updatedAt: Date

  // @DeleteDateColumn({ type: 'timestamp with time zone' })
  // deletedAt?: Date
  
}
