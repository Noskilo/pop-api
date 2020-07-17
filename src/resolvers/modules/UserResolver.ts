import { Query, Resolver, Ctx } from "type-graphql";
import { User } from "../../entities/User";
import { RequestContext } from "../../keys";
import { AuthenticationError } from "apollo-server-express";

@Resolver(() => User)
export class UserResolver {
  @Query(() => User, {
    nullable: true
  })
  async me(@Ctx() context: RequestContext): Promise<User> {
    if (context.user) {
      return User.findOne(context.user.uid);
    }

    throw new AuthenticationError("must authenticate");
  }
}
