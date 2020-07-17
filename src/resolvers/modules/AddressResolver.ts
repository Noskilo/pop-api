import { Address } from "../../entities/Address";
import { Query, Resolver } from "type-graphql";

@Resolver(() => Address)
export class AddressResolver {
  @Query(() => [Address])
  async addresses(): Promise<Address[]> {
    return Address.find();
  }
}
