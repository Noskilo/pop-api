import { Field, ID, ObjectType } from "type-graphql";
import {
  BaseEntity,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  Column
} from "typeorm";

@ObjectType()
@Entity({
  name: "ts_user"
})
export class User extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column({
    unique: true
  })
  username: string;

  @Field()
  @Column()
  firstName: string;

  @Field()
  @Column()
  lastName: string;

  @Column()
  password: string;

  @Field()
  name(): string {
    return this.firstName + " " + this.lastName;
  }

  @Field(() => Date, {
    nullable: true
  })
  @CreateDateColumn()
  createdAt: Date;

  @Field(() => Date, {
    nullable: true
  })
  @UpdateDateColumn()
  updatedAt: Date;
}
