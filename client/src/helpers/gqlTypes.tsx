export type Category = {
  id: number;
  name: string;
  urlName: string;
  subcategory: SubCategory[];
};

export type SubCategory = {
  id: number;
  name: string;
  urlName: string;
};

export type User = {
  id: Number;
  phone?: String;
  email: String;
  firstName?: String;
  lastName?: String;
  isGold?: Boolean;
};

export type Listing = {
  id: number;
  isGold: boolean;
  title: string;
  description: string;
  price: number;
  category: {
    id?: number;
    name: string;
  };
  subcategory: {
    id?: number;
    name: string;
  };
  images: {
    id: number;
    name: string;
  }[];
  user: User;
};
