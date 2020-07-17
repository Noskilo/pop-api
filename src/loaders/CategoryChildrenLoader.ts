import DataLoader from "dataloader";
import { Category } from "../entities/Category";
import { getRepository } from "typeorm";

type Batch = (keys: number[]) => Promise<Category[][]>;

const batch: Batch = async keys => {
  const categories = await getRepository(Category)
    .createQueryBuilder("category")
    .leftJoinAndSelect("category.children", "child")
    .where("category.id IN (:...keys)", { keys })
    .getMany();

  const map: { [key: number]: Category } = {};

  categories.forEach(category => {
    map[category.id] = category;
  });

  const sorted = keys.map(key => map[key]);

  const children = sorted.map(category => {
    return category.children;
  });

  return children;
};

export const categoryChildrenLoader = () =>
  new DataLoader<number, Category[]>(batch);
