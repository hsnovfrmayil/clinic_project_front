export type ProductCategory =
  | "Сыворотки"
  | "Кремы"
  | "Очищение"
  | "Маски"
  | "Домашние устройства";

export type BottleVariant = "dropper" | "pump" | "jar" | "tube" | "device";

export interface Product {
  id: string;
  slug: string;
  name: string;
  category: ProductCategory;
  tagline: string;
  description: string;
  volume: string;
  price: number;
  oldPrice?: number;
  bonusPoints: number;
  bestseller?: boolean;
  isNew?: boolean;
  rating: number;
  reviews: number;
  ingredients: string[];
  bottle: BottleVariant;
  tint: "ion" | "silver" | "gold";
}
