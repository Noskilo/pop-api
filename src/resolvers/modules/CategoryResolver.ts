import {
  Arg,
  Ctx,
  FieldResolver,
  Int,
  Query,
  Resolver,
  Root
} from "type-graphql";
import { getRepository } from "typeorm";
import { Category } from "../../entities/Category";
import { Product } from "../../entities/Product";
import { RequestContext } from "../../keys";

@Resolver(() => Category)
export class CategoryResolver {
  @Query(() => [Category])
  async categories(
    @Arg("tree", { nullable: true }) tree?: boolean,
    @Arg("limit", { nullable: true }) limit?: number
  ): Promise<Category[]> {
    if (tree) {
      return Category.find({
        where: {
          parentId: 0
        },
        take: limit
      });
    }

    return Category.find({
      take: limit
    });
  }

  @Query(() => [Category])
  async categoryChildrenOf(
    @Arg("parentId", () => Int, { nullable: false }) parentId?: number
  ): Promise<Category[]> {
    return Category.find({
      where: {
        parentId: parentId
      }
    });
  }

  @FieldResolver(() => [Category])
  async children(
    @Root() parent: Category,
    @Ctx() context: RequestContext
  ): Promise<Category[]> {
    if (parent.product) {
      return getRepository(Category)
        .createQueryBuilder("category")
        .innerJoinAndSelect(
          "category.products",
          "product",
          "product.id = :productId",
          { productId: parent.product }
        )
        .innerJoinAndSelect(
          "category.parent",
          "parent",
          "parent.id = :parentId",
          { parentId: parent.id }
        )
        .getMany()
        .then(categories =>
          categories.map(category => {
            category.product = parent.product;
            return category;
          })
        );
    } else {
      return context.loaders.categoryChildrenLoader.load(parent.id);
    }
  }

  @FieldResolver(() => [Product])
  async products(
    @Root() parent: Category,
    @Ctx() context: RequestContext
  ): Promise<Product[]> {
    return context.loaders.productsOfCategoriesLoader.load(parent.id);
  }

  @FieldResolver(() => Category)
  async parent(
    @Root() parent: Category,
    @Ctx() context: RequestContext
  ): Promise<Category> {
    return context.loaders.categoryLoader.load(parent.parentId);
  }

  @FieldResolver(() => Int)
  async productCount(
    @Root() parent: Category,
    @Ctx() context: RequestContext
  ): Promise<number> {
    const products = await context.loaders.productsOfCategoriesLoader.load(
      parent.id
    );
    return products ? products.length : 0;
  }

  @FieldResolver(() => Boolean)
  async hasChildren(@Root() parent: Category): Promise<boolean> {
    return parent.children.length > 0;
  }
}
