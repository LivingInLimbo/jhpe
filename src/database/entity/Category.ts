import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { SubCategory } from "./SubCategory";

@Entity()
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  urlName: string;

  @OneToMany(() => SubCategory, (subcategory) => subcategory.id)
  subcategory: SubCategory;
}
