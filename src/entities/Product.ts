import { Field, ID, Int, ObjectType } from "type-graphql";
import {
  AfterInsert,
  AfterUpdate,
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  AfterRemove,
  OneToMany
} from "typeorm";
import { elasticClient } from "../connectors/elastic";
import { Category } from "./Category";
import { Image } from "./Image";
import { ProductImage } from "./ProductImage";
import { Sku } from "./Sku";
import { ManyToOne } from "typeorm";
import { Store } from "./Store";
import { Tag } from "./Tag";
import { Carted } from "./Carted";

@ObjectType()
@Entity({
  name: "ts_product"
})
export class Product extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  storeId: number;

  @Index({ fulltext: true })
  @Field()
  @Column()
  name: string;

  @Index({ fulltext: true })
  @Field()
  @Column("text")
  description: string;

  @Field(() => Int, {
    nullable: true
  })
  @Column("int")
  sale: number;

  @Field()
  @Column()
  subUnit: string;

  @Field()
  @Column()
  reference: string;

  @Field()
  @Column()
  visible: boolean;

  @Field()
  @Column()
  type: string;

  @Field(() => [Category], {
    nullable: true
  })
  @ManyToMany(() => Category)
  @JoinTable({
    name: "ts_category_product",
    joinColumns: [{ name: "productId" }],
    inverseJoinColumns: [{ name: "categoryId" }]
  })
  categories: Promise<Category[]>;

  @Field(() => [Tag], {
    nullable: true
  })
  @ManyToMany(() => Tag)
  @JoinTable({
    name: "ts_product_tag",
    joinColumns: [{ name: "productId" }],
    inverseJoinColumns: [{ name: "tagId" }]
  })
  tags: Promise<Tag[]>;

  @ManyToMany(() => Image)
  @JoinTable({
    name: "ts_image_product",
    joinColumns: [{ name: "productId" }],
    inverseJoinColumns: [{ name: "imageId" }]
  })
  images: Image[];

  @OneToMany(
    () => ProductImage,
    productImage => productImage.product
  )
  productImages: ProductImage[];

  @Field(() => [Carted])
  @OneToMany(
    () => Carted,
    carted => carted.product
  )
  cartedItems: Promise<Carted[]>;

  @ManyToOne(
    () => Store,
    store => store.products
  )
  store: Store;

  @OneToMany(
    () => Sku,
    sku => sku.product
  )
  skus: Sku[];

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

  @AfterUpdate()
  async updateElasticIndex(): Promise<void> {
    try {
      await elasticClient.update({
        index: "ts_product",
        id: `${this.id}`,
        body: {
          doc: this
        }
      });
    } catch (error) {
      console.error(error);
    }
  }

  @AfterInsert()
  async insertElasticIndex(): Promise<void> {
    try {
      await elasticClient.index({
        index: "ts_product",
        id: `${this.id}`,
        body: this
      });
    } catch (error) {
      console.error(error);
    }
  }

  @AfterRemove()
  async removeElasticIndex(): Promise<void> {
    try {
      await elasticClient.delete({
        index: "ts_product",
        id: `${this.id}`
      });
    } catch (error) {
      console.error(error);
    }
  }

  static async elasticInit() {
    const exists = await elasticClient.indices
      .exists({
        index: "ts_product"
      })
      .then(response => {
        return response.body;
      });

    if (exists) {
      await elasticClient.indices.delete({
        index: "ts_product"
      });
    }

    await elasticClient.indices.create({
      index: "ts_product"
    });

    await elasticClient.indices.putMapping({
      index: "ts_product",
      body: {
        properties: {
          name: {
            type: "text",
            analyzer: "english"
          },
          description: {
            type: "text",
            analyzer: "english"
          }
        }
      }
    });

    await Product.find()
      .then(products => {
        products.forEach(async product => {
          await elasticClient.index({
            index: "ts_product",
            id: product.id + "",
            body: product
          });
        });
      })
      .then(() => "Done!");
  }
}
