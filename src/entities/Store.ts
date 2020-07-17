import { Field, ID, ObjectType } from "type-graphql";
import { Column, OneToMany, OneToOne, JoinColumn } from "typeorm";
import { Product } from "./Product";
import { Image } from "./Image";
import { elasticClient } from "../connectors/elastic";
import {
  BaseEntity,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from "typeorm";

@ObjectType()
@Entity({
  name: "ts_store"
})
export class Store extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => String)
  @Column()
  name: string;

  @Column()
  logoImageId: number;

  @Column()
  bannerImageId: number;

  @OneToOne(
    () => Image,
    image => image.logoStore
  )
  @JoinColumn({
    name: "logoImageId"
  })
  logo: Image;

  @OneToMany(
    () => Product,
    product => product.store
  )
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

  static async elasticInit() {
    const exists = await elasticClient.indices
      .exists({
        index: "ts_store"
      })
      .then(response => {
        return response.body;
      });

    if (exists) {
      await elasticClient.indices.delete({
        index: "ts_store"
      });
    }

    await elasticClient.indices.create({
      index: "ts_store"
    });

    await elasticClient.indices.putMapping({
      index: "ts_store",
      body: {
        properties: {
          name: {
            type: "text",
            analyzer: "english"
          }
        }
      }
    });

    await Store.find()
      .then(stores => {
        stores.forEach(async store => {
          await elasticClient.index({
            index: "ts_store",
            id: store.id + "",
            body: store
          });
        });
      })
      .then(() => "Done!");
  }
}
