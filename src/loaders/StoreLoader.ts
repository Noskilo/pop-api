import DataLoader from "dataloader";
import { Store } from "../entities/Store";

type Batch = (keys: number[]) => Promise<Store[]>;

const batch: Batch = async keys => {
  const stores = await Store.findByIds(keys);

  const map: { [key: number]: Store } = {};

  stores.forEach(store => {
    map[store.id] = store;
  });

  return keys.map(key => map[key]);
};

export const storeLoader = () => new DataLoader<number, Store>(batch);
