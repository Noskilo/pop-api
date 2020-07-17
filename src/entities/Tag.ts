import { Field, ID, ObjectType } from "type-graphql";
import { Product } from "./Product";
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  ManyToMany,
  JoinTable
} from "typeorm";

@ObjectType()
@Entity({
  name: "ts_tag"
})
export class Tag extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => String)
  @Column()
  value: string;

  @Field(() => [Product], {
    nullable: true
  })
  @ManyToMany(() => Product)
  @JoinTable({
    name: "ts_product_tag",
    joinColumns: [{ name: "tagId" }],
    inverseJoinColumns: [{ name: "productId" }]
  })
  products: Promise<Product[]>;

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
