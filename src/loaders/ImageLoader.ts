import DataLoader from "dataloader";
import { Image } from "../entities/Image";

type Batch = (keys: number[]) => Promise<Image[]>;

const batch: Batch = async keys => {
  console.log(keys);
  const images = await Image.findByIds(keys);

  const map: { [key: number]: Image } = {};

  images.forEach(image => {
    map[image.id] = image;
  });

  return keys.map(key => map[key]);
};

export const imageLoader = () => new DataLoader<number, Image>(batch);
