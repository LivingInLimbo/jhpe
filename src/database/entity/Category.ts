import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  JoinColumn,
} from "typeorm";
import { SubCategory } from "./SubCategory";
import { Listing } from "./Listing";

@Entity()
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  urlName: string;

  @OneToMany(() => SubCategory, (subcategory) => subcategory.category, {
    eager: true,
  })
  subcategory: SubCategory[];

  @OneToMany(() => Listing, (listing) => listing.category)
  listing: Listing[];
}
