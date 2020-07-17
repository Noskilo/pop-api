import { Field, ID, ObjectType } from "type-graphql";
import { Product } from "./Product";
import { ProductImage } from "./ProductImage";
import { Store } from "./Store";
import {
  BaseEntity,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  Column,
  ManyToMany,
  JoinTable,
  OneToMany,
  OneToOne,
  JoinColumn
} from "typeorm";

@ObjectType()
@Entity({
  name: "ts_image"
})
export class Image extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column()
  imageUrl: string;

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

  @OneToMany(
    () => ProductImage,
    productImage => productImage.image
  )
  productImages: ProductImage[];

  @OneToOne(
    () => Store,
    store => store.logo
  )
  logoStore: Store;
}
