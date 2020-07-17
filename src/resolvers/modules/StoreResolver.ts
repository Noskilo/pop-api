import {
  Arg,
  Ctx,
  FieldResolver,
  ID,
  Query,
  Resolver,
  Root
} from "type-graphql";
import { elasticClient } from "../../connectors/elastic";
import { Image } from "../../entities/Image";
import { Store } from "../../entities/Store";
import { RequestContext } from "../../keys";

@Resolver(() => Store)
export class StoreResolver {
  @Query(() => [Store])
  async stores(
    @Arg("search", { nullable: true }) search?: string
  ): Promise<Store[]> {
    if (search) {
      const { body } = await elasticClient.search({
        index: "ts_store",
        body: {
          query: {
            multi_match: {
              fields: ["name", "description"],
              query: search,
              fuzziness: "AUTO"
            }
          }
        }
      });

      const hits = body.hits.hits;
      const stores = hits.map(item => item._source);

      return stores;
    }

    return Store.find();
  }

  @Query(() => Store)
  async store(@Arg("id", () => ID) id: number): Promise<Store> {
    return Store.findOne(id);
  }

  @FieldResolver(() => Image, { nullable: true })
  async logo(
    @Root() parent: Store,
    @Ctx() context: RequestContext
  ): Promise<Image> {
    if (parent.logoImageId) {
      return context.loaders.imageLoader.load(parent.logoImageId);
    } else {
      return null;
    }
  }

  @FieldResolver(() => Image, { nullable: true })
  async banner(
    @Root() parent: Store,
    @Ctx() context: RequestContext
  ): Promise<Image> {
    if (parent.bannerImageId) {
      return context.loaders.imageLoader.load(parent.bannerImageId);
    } else {
      return null;
    }
  }
}
