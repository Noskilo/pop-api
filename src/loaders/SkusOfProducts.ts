import DataLoader from "dataloader";
import { getRepository } from "typeorm";
import { Product } from "../entities/Product";
import { Sku } from "../entities/Sku";

type Batch = (keys: number[]) => Promise<Sku[][]>;

const batch: Batch = async keys => {
  const products = await getRepository(Product)
    .createQueryBuilder("product")
    .leftJoinAndSelect("product.skus", "sku")
    .where("product.id IN (:...keys)", { keys })
    .getMany();

  const map: { [key: number]: Product } = {};

  products.forEach(product => {
    map[product.id] = product;
  });

  const sorted = keys.map(key => map[key]);

  const skus = sorted.map(product => {
    return product.skus;
  });

  return skus;
};

export const skusOfProductsLoader = () => new DataLoader<number, Sku[]>(batch);
