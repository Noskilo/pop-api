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
  name: "ts_district"
})
export class District extends BaseEntity {
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
