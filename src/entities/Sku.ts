import { Field, ID, ObjectType, Int, Float } from "type-graphql";
import { Product } from "./Product";
import { Column, ManyToMany, JoinTable, OneToMany } from "typeorm";
import { Attribute } from "./Attribute";
import {
  BaseEntity,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  ManyToOne
} from "typeorm";
import { Tag } from "./Tag";
import { Carted } from "./Carted";

@ObjectType()
@Entity({
  name: "ts_sku"
})
export class Sku extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => String, {
    nullable: true
  })
  @Column()
  reference: string;

  @Field(() => Int)
  @Column()
  stock: number;

  @Field(() => Float)
  @Column()
  price: number;

  @Field(() => String)
  @Column()
  currency: string;

  @Field(() => Product)
  @ManyToOne(
    () => Product,
    product => product.skus
  )
  product: Product;

  @Field(() => [Carted])
  @OneToMany(
    () => Carted,
    carted => carted.sku
  )
  cartedItems: Promise<Carted[]>;

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
  @ManyToMany(() => Attribute)
  @JoinTable({
    name: "ts_product_variant",
    joinColumns: [{ name: "skuId" }],
    inverseJoinColumns: [{ name: "attributeId" }]
  })
  attributes: Promise<Attribute[]>;
}
