import {
  Arg,
  FieldResolver,
  ID,
  Mutation,
  Query,
  Resolver,
  Root,
  ArgsType,
  Field,
  Int,
  Args
} from "type-graphql";
import { elasticClient } from "../../connectors/elastic";
import { Category } from "../../entities/Category";
import { Product } from "../../entities/Product";
import { Image } from "../../entities/Image";
import { RequestContext } from "../../keys";
import { Ctx, Float } from "type-graphql";
import { getRepository } from "typeorm";
import { Sku } from "../../entities/Sku";
import { PriceRange } from "../../types/PriceRange";
import { Store } from "../../entities/Store";
import { ApiResponse } from "@elastic/elasticsearch";

@ArgsType()
class ProductFilter {
  @Field(() => Int, { nullable: true })
  skip?: number;

  @Field(() => Int, { nullable: true })
  take?: number;

  @Field(() => ID, { nullable: true })
  storeId?: string;

  @Field(() => String, { nullable: true })
  search?: string;
}

@Resolver(() => Product)
export class ProductResolver {
  @Query(() => [Product])
  async products(
    @Args() { skip, take, storeId, search }: ProductFilter
  ): Promise<Product[]> {
    const must: any = {};
    const filter: { term: any }[] = [
      {
        term: {
          visible: true
        }
      }
    ];

    if (search) {
      must.multi_match = {
        type: "most_fields",
        fields: ["name"],
        query: search,
        fuzziness: "AUTO"
      };
    } else {
      must.match_all = {};
    }

    if (storeId) {
      filter.push({
        term: {
          storeId
        }
      });
    }

    console.log(filter);

    const result: ApiResponse = await elasticClient.search({
      index: "ts_product",
      body: {
        query: {
          bool: {
            must: must,
            filter: filter
          }
        }
      }
    });


    const hits = result.body.hits.hits;
    const products = hits.map(item => item._source);

    return products;
  }

  @Query(() => Product)
  async product(@Arg("id", () => ID) id: number): Promise<Product> {
    return Product.findOne(id);
  }

  @Mutation(() => Product)
  async updateProduct(
    @Arg("id", () => ID, {
      nullable: false
    })
    id: number,
    @Arg("name", {
      nullable: false
    })
    name: string
  ): Promise<Product> {
    return Product.findOne(id).then(product => {
      product.name = name;
      product.save();

      return product;
    });
  }

  @FieldResolver(() => [Category])
  async categories(
    @Root() parent: Product,
    @Arg("tree", { nullable: true }) tree?: boolean
  ): Promise<Category[]> {
    const categories = await parent.categories;
    return categories
      .filter(category => (tree ? !category.parentId : true))
      .map(category => {
        category.product = parent.id;
        return category;
      });
  }

  @FieldResolver(() => Boolean)
  async inStock(
    @Root() parent: Product,
    @Ctx() context: RequestContext
  ): Promise<boolean> {
    const skus = await context.loaders.skusOfProductsLoader.load(parent.id);

    return (
      skus &&
      skus.map(sku => sku.stock).reduce((total, current) => total + current) > 0
    );
  }

  @FieldResolver(() => [Sku])
  async skus(
    @Root() parent: Product,
    @Ctx() context: RequestContext
  ): Promise<Sku[]> {
    return context.loaders.skusOfProductsLoader.load(parent.id);
  }

  @FieldResolver(() => Store)
  async store(
    @Root() parent: Product,
    @Ctx() context: RequestContext
  ): Promise<Store> {
    return context.loaders.storeLoader.load(parent.storeId);
  }

  @FieldResolver(() => PriceRange, {
    nullable: true
  })
  async priceRange(
    @Root() parent: Product,
    @Ctx() context: RequestContext
  ): Promise<PriceRange> {
    const skus = await context.loaders.skusOfProductsLoader.load(parent.id);

    if (skus) {
      let min = skus[0].price;
      let max = skus[0].price;

      skus.forEach(sku => {
        if (sku.price > max) {
          max = sku.price;
        }

        if (sku.price < min) {
          min = sku.price;
        }
      });

      return {
        min,
        max
      };
    }

    return null;
  }

  @FieldResolver(() => [Image])
  async images(
    @Root() parent: Product,
    @Ctx() context: RequestContext,
    @Arg("thumbnailOnly", {
      nullable: true
    })
    thumbnailOnly?: boolean
  ): Promise<Image[]> {
    if (thumbnailOnly) {
      return getRepository(Image)
        .createQueryBuilder("image")
        .leftJoinAndSelect("image.productImages", "productImage")
        .where("productImage.productId = :productId", {
          productId: parent.id
        })
        .andWhere("productImage.type = 'thumbnail'")
        .getMany();
    } else {
      return context.loaders.imagesOfProductsLoader.load(parent.id);
    }
  }
}
