import { Field, ID, ObjectType } from "type-graphql";
import {
  BaseEntity,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from "typeorm";

@ObjectType()
@Entity({
  name: "ts_dispute_type"
})
export class DisputeType extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

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
