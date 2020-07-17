import { Field, ID, ObjectType } from "type-graphql";
import { BaseEntity, Column, Entity, ManyToOne, PrimaryColumn } from "typeorm";
import { Image } from "./Image";
import { Product } from "./Product";

@ObjectType()
@Entity({
  name: "ts_image_product"
})
export class ProductImage extends BaseEntity {
  @Field(() => ID)
  @PrimaryColumn()
  productId: number;

  @Field(() => ID)
  @PrimaryColumn()
  imageId: number;

  @Field()
  @Column()
  type: string;

  @ManyToOne(() => Image)
  image: Image;

  @ManyToOne(() => Product)
  product: Product;
}
