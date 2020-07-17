import { ProductResolver } from "./modules/ProductResolver";
import { CategoryResolver } from "./modules/CategoryResolver";
import { AddressResolver } from "./modules/AddressResolver";
import { AttributeResolver } from "./modules/AttributeResolver";
import { UserResolver } from "./modules/UserResolver";
import { CommonResolver } from "./modules/CommonResolver";
import { StoreResolver } from "./modules/StoreResolver";

export let resolvers = [
  CommonResolver,
  ProductResolver,
  CategoryResolver,
  AddressResolver,
  AttributeResolver,
  UserResolver,
  StoreResolver
];
