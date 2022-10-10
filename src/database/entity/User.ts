import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Listing } from "./Listing";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column({ nullable: true })
  phone?: string;

  @Column({ nullable: true })
  firstName?: string;

  @Column({ nullable: true })
  lastName?: string;

  @Column({ default: false })
  isGold: boolean;

  @OneToMany(() => Listing, (listing) => listing.id)
  listing: Listing;
}
