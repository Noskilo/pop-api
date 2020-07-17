import DataLoader from "dataloader";
import { Category } from "../entities/Category";

type BatchCategory = (keys: number[]) => Promise<Category[]>;

const batchCategories: BatchCategory = async keys => {
  const categories = await Category.findByIds(keys);

  const map: { [key: number]: Category } = {};

  categories.forEach(category => {
    map[category.id] = category;
  });

  return keys.map(key => map[key]);
};

export const categoryLoader = () =>
  new DataLoader<number, Category>(batchCategories);
