import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from "typeorm";
import { Category } from "./Category";
import { Listing } from "./Listing";

@Entity()
export class SubCategory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  urlName: string;

  @Column()
  name: string;

  @ManyToOne(() => Category, (category) => category.id, { onDelete: "CASCADE" })
  category: Category;

  @OneToMany(() => Listing, (listing) => listing.id)
  listing: Listing;
}
