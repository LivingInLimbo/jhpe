import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne,
} from "typeorm";
import { Category } from "./Category";
import { SubCategory } from "./SubCategory";
import { User } from "./User";
import { ListingImage } from "./ListingImage";

@Entity()
export class Listing {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  price: number;

  @Column()
  description: string;

  @ManyToOne(() => Category, (category) => category.id, {
    onDelete: "SET NULL",
  })
  category: Category;

  @ManyToOne(() => SubCategory, (subcategory) => subcategory.id, {
    onDelete: "SET NULL",
  })
  subcategory: SubCategory;

  @ManyToOne(() => User, (user) => user.id, { onDelete: "CASCADE" })
  user: User;

  @OneToMany(() => ListingImage, (listingImage) => listingImage.listing, {
    eager: true,
  })
  images: ListingImage[];
}
