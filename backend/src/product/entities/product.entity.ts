// product.entity.ts
import { Category } from 'src/category/entities/category.entity';
import { Order } from 'src/order/entities/order.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  slug: string;

  @Column()
  description: string;

  @Column()
  price: number;

  @Column()
  quantity: number;

  @Column()
  categoryid: number;

  @Column({ nullable: true, type: 'text' })
  photo: string;
  @Column()
  shipping: boolean;

  @ManyToOne(() => Category, (category) => category.products)
  @JoinColumn({ name: 'categoryid' })
  category: Category;
  @OneToMany(() => Order, (order) => order.product)
  orders: Order[];
}



// product.entity.ts
// import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
// import { Order } from 'src/order/entities/order.entity';

// @Entity()
// export class Product {
//   @PrimaryGeneratedColumn()
//   id: number;

//   @Column()
//   name: string;

//   @Column()
//   slug: string;

//   @Column()
//   description: string;

//   @Column()
//   price: number;

//   @Column()
//   quantity: number;

//   @Column()
//   categoryid: number;

//   @Column({ nullable: true, type: 'text' })
//   photo: string;

//   @Column()
//   shipping: boolean;

//   // Add other columns as needed

//   @OneToMany(() => Order, order => order.product)
//   orders: Order[];
// }
