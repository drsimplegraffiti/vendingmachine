import { UserEntity } from '../user/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';

@Entity()
export class ProductEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  amountAvailable: number;

  @Column()
  cost: number;

  @Column()
  productName: string;

  @ManyToOne((type) => UserEntity, (adapter) => adapter.username)
  adapter: UserEntity;
}
