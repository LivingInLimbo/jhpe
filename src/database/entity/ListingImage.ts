import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from "typeorm";
import { SubCategory } from "./SubCategory";
import { Listing } from "./Listing";

@Entity()
export class ListingImage {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToOne(() => Listing, (listing) => listing.id, { onDelete: "CASCADE" })
  listing: Listing;
}
