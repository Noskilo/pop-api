import { JWK, JWKS } from "jose";
import { categoryChildrenLoader } from "./loaders/CategoryChildrenLoader";
import { categoryLoader } from "./loaders/CategoryLoader";
import { imageLoader } from "./loaders/ImageLoader";
import { imagesOfProductsLoader } from "./loaders/ImagesOfProductsLoader";
import { productsOfCategoriesLoader } from "./loaders/ProductsOfCategoriesLoader";
import { skusOfProductsLoader } from "./loaders/SkusOfProducts";
import { storeLoader } from "./loaders/StoreLoader";

const key = JWK.asKey(process.env.API_SECRET || "secret");

export const keyStore = new JWKS.KeyStore([key]);

export interface Token {
  uid: number;
  aud?: string;
  iss?: string;
  iat?: number;
  exp?: number;
}

export interface RequestContext {
  user: Token;
  loaders: {
    categoryLoader: ReturnType<typeof categoryLoader>;
    productsOfCategoriesLoader: ReturnType<typeof productsOfCategoriesLoader>;
    categoryChildrenLoader: ReturnType<typeof categoryChildrenLoader>;
    imagesOfProductsLoader: ReturnType<typeof imagesOfProductsLoader>;
    skusOfProductsLoader: ReturnType<typeof skusOfProductsLoader>;
    storeLoader: ReturnType<typeof storeLoader>;
    imageLoader: ReturnType<typeof imageLoader>;
  };
}
