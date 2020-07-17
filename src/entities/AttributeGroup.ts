import { Field, ID, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  OneToMany
} from "typeorm";
import { Attribute } from "./Attribute";

@ObjectType()
@Entity({
  name: "ts_attribute_group"
})
export class AttributeGroup extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column()
  name: string;

  @Field()
  @Column()
  displayName: string;

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

  @Field(() => [Attribute], {
    nullable: true
  })
  @OneToMany(
    () => Attribute,
    attribute => attribute.attributeGroup
  )
  attributes: Promise<Attribute>[];
}
