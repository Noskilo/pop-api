import { Attribute } from "../../entities/Attribute";
import { Query, Resolver } from "type-graphql";

@Resolver(() => Attribute)
export class AttributeResolver {
  @Query(() => [Attribute])
  async attributes(): Promise<Attribute[]> {
    return Attribute.find();
  }
}
