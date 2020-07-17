import { ObjectType, Field, Float } from "type-graphql";

@ObjectType()
export class PriceRange {
  @Field(() => Float)
  min: number;

  @Field(() => Float)
  max: number;
}
