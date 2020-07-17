import { Field, ID, ObjectType } from "type-graphql";
import { AttributeGroup } from "./AttributeGroup";
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  ManyToOne
} from "typeorm";

@ObjectType()
@Entity({
  name: "ts_attribute"
})
export class Attribute extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column()
  name: string;

  @Field()
  @Column()
  value: string;

  @Field(() => AttributeGroup)
  @ManyToOne(
    () => AttributeGroup,
    attributeGroup => attributeGroup.attributes
  )
  attributeGroup: Promise<AttributeGroup>;

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
