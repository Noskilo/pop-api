import DataLoader from "dataloader";
import { Category } from "../entities/Category";
import { Product } from "../entities/Product";
import { getRepository } from "typeorm";
import { Image } from "../entities/Image";

type Batch = (keys: number[]) => Promise<Image[][]>;

const batch: Batch = async keys => {
  const categories = await getRepository(Product)
    .createQueryBuilder("product")
    .leftJoinAndSelect("product.images", "image")
    .where("product.id IN (:...keys)", { keys })
    .getMany();

  const map: { [key: number]: Product } = {};

  categories.forEach(product => {
    map[product.id] = product;
  });

  const sorted = keys.map(key => map[key]);

  const images = sorted.map(product => {
    return product.images;
  });

  return images;
};

export const imagesOfProductsLoader = () =>
  new DataLoader<number, Image[]>(batch);
