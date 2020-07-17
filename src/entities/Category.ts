import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  OneToMany,
  ManyToOne,
  ManyToMany,
  JoinTable,
  CreateDateColumn,
  UpdateDateColumn
} from "typeorm";
import { ObjectType, Field, ID } from "type-graphql";
import { Product } from "./Product";

@ObjectType()
@Entity({
  name: "ts_category"
})
export class Category extends BaseEntity {
  product?: number;

  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column()
  title: string;

  @Field()
  @Column("text")
  description: string;

  @Column()
  parentId: number;

  @Field(() => Category, {
    nullable: true
  })
  @ManyToOne(
    () => Category,
    category => category.children
  )
  parent: Promise<Category>;

  @OneToMany(
    () => Category,
    category => category.parent,
    {
      cascade: true
    }
  )
  children: Category[];

  @ManyToMany(() => Product)
  @JoinTable({
    name: "ts_category_product",
    joinColumns: [{ name: "categoryId" }],
    inverseJoinColumns: [{ name: "productId" }]
  })
  products: Product[];

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
