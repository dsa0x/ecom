import { Document, Types } from "mongoose";

// ^
export interface IProductLean {
  title: string;
  description: string;
  price: number;
  brand: string;
  category: string;
  images: string[];
  quantity: number;
  owner: Types.ObjectId;
  reservations: {
    id: Types.ObjectId;
    quantity: number;
    createdAt: Date;
  }[];
  createdAt: Date;
  updatedAt: Date;
}

export type IProduct = Document & IProductLean;

export interface IProductUpdatable {
  title?: string;
  description?: string;
  price?: number;
  brand?: string;
  category?: string;
  imagePath?: string;
  quantity?: number;
  reservations?: {
    id: Types.ObjectId;
    quantity: number;
    createdAt: Date;
  }[];
}
