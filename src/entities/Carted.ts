import { Field, ID, Int, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from "typeorm";
import { Product } from "./Product";
import { Sku } from "./Sku";

@ObjectType()
@Entity({
  name: "ts_carted"
})
export class Carted extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => ID)
  @Column()
  skuId: number;

  @Field(() => ID)
  @Column()
  productId: number;

  @Field(() => Int)
  @Column()
  itemQuantity: number;

  @Field(() => Product)
  @ManyToOne(
    () => Product,
    product => product.cartedItems
  )
  product: Promise<Product>;

  @Field(() => Sku)
  @ManyToOne(
    () => Sku,
    sku => sku.cartedItems
  )
  sku: Promise<Sku>;

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
