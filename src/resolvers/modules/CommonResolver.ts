import bcrypt from "bcryptjs";
import { JWT } from "jose";
import {
  Arg,
  Ctx,
  PubSub,
  PubSubEngine,
  Query,
  Resolver,
  Subscription
} from "type-graphql";
import { Product } from "../../entities/Product";
import { Store } from "../../entities/Store";
import { User } from "../../entities/User";
import { keyStore, RequestContext, Token } from "../../keys";

@Resolver()
export class CommonResolver {
  @Query(() => Boolean)
  async elasticInit(@PubSub() pubSub: PubSubEngine): Promise<boolean> {
    await Product.elasticInit();
    await Store.elasticInit();

    return true;
  }

  @Subscription({
    topics: "TEST"
  })
  test(): string {
    return "test";
  }

  @Query(() => String, {
    nullable: true
  })
  async login(
    @Arg("username") username: string,
    @Arg("password") password: string
  ): Promise<String> {
    let user = await User.findOne({
      where: {
        username: username
      }
    }).catch(error => null);

    if (!user) {
      user = await User.findOne({
        where: {
          email: username
        }
      }).catch(error => null);
    }

    if (!user) {
      return null;
    }

    const authorized = await bcrypt.compare(password, user.password);

    if (authorized) {
      const key = keyStore.all()[0];
      const jwt = JWT.sign(
        {
          uid: user.id
        } as Token,
        key,
        {
          algorithm: "HS256",
          audience: "https://pop961.com/api",
          expiresIn: "1 hour",
          header: {
            typ: "JWT"
          },
          issuer: "https://pop961.com/api"
        }
      );

      return jwt;
    }

    return null;
  }

  @Query(() => String, {
    nullable: true
  })
  async refreshToken(@Ctx() context: RequestContext): Promise<String> {
    if (context.user) {
      const key = keyStore.all()[0];
      const jwt = JWT.sign(context.user, key, {
        algorithm: "RS256",
        audience: "https://pop961.com/api",
        expiresIn: "1 hour",
        header: {
          typ: "JWT"
        },
        issuer: "https://pop961.com/api"
      });

      return jwt;
    }

    return null;
  }
}
