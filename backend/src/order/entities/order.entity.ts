




import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { Product } from 'src/product/entities/product.entity';

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

@Column()
  buyer_id: number;

  @Column()
  product_id: number;

  @ManyToOne(() => User, user => user.orders)
  @JoinColumn({ name: 'buyer_id' })
  buyer: User;

  @ManyToOne(() => Product, product => product.orders)
  @JoinColumn({ name: 'product_id' })
  product: Product[];

  @Column({ default: 'Not Process' })
  status: string;

  // Add other columns as needed, such as payment details, timestamps, etc.
}
