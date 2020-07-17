import DataLoader from "dataloader";
import { Category } from "../entities/Category";
import { Product } from "../entities/Product";
import { getRepository } from "typeorm";

type Batch = (keys: number[]) => Promise<Product[][]>;

const batch: Batch = async keys => {
  const categories = await getRepository(Category)
    .createQueryBuilder("category")
    .leftJoinAndSelect("category.products", "product")
    .where("category.id IN (:...keys)", { keys })
    .getMany();

  const map: { [key: number]: Category } = {};

  categories.forEach(category => {
    map[category.id] = category;
  });

  const sorted = keys.map(key => map[key]);

  const products = sorted.map(category => {
    return category.products;
  });

  return products;
};

export const productsOfCategoriesLoader = () =>
  new DataLoader<number, Product[]>(batch);
