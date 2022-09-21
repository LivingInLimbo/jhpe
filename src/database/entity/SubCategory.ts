import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Category } from "./Category";

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
}
