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

  @Column({ default: new Date() })
  last_update: Date;

  @Column({ default: false })
  isGold: boolean;

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
    eager: true,
  })
  subcategory: SubCategory;

  @ManyToOne(() => User, (user) => user.id, {
    onDelete: "CASCADE",
    eager: true,
  })
  user: User;

  @OneToMany(() => ListingImage, (listingImage) => listingImage.listing, {
    eager: true,
  })
  images: ListingImage[];
}
