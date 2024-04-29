// user.entity.ts
import { IsNotEmpty } from 'class-validator';
import { Order } from 'src/order/entities/order.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
// import { Order } from './order.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  @IsNotEmpty()
  name: string;

  @Column()
  @IsNotEmpty()
  email: string;

  @Column()
  @IsNotEmpty()
  password: string;

  @Column()
  @IsNotEmpty()
  phone: string;

  @Column()
  @IsNotEmpty()
  address: string;

  @Column()
  @IsNotEmpty()
  answer: string;

  @Column({ default: 0 })
  role: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
    @OneToMany(() => Order, (order) => order.buyer)
    orders: Order[];
}


// user.entity.ts
// import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
// import { Order } from 'src/order/entities/order.entity';
// import { IsNotEmpty } from 'class-validator';

// @Entity()
// export class User {
//   @PrimaryGeneratedColumn()
//   id: string;

//   @Column()
//   name: string;

//   @Column()
//   email: string;

//   @Column()
//   password: string;

//   @Column()
//   phone: string;

//   @Column()
//   address: string;

//     @Column()
//     @IsNotEmpty()
//     answer: string;

//     @Column({ default: 0 })
//     role: number;

//   @OneToMany(() => Order, (order) => order.buyer)
//   orders: Order[];
// }
