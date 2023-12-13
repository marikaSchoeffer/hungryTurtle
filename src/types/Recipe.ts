export type Recipe = {
  id: string;
  title: string;
  duration: number;
  ingredients: string;
  description: string;
  deleted: boolean;
  imageURL: string;
  thumbnailURL: string;
  userId: string;
  categories: string[];
  favorite: string[];
};
