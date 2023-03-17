import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BeforeInsert,
  OneToMany,
} from 'typeorm';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { UserRO } from './user.dto';
import { ProductEntity } from '../products/products.entity';

@Entity()
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    unique: true,
    type: 'text',
    nullable: false,
  })
  username: string;

  @Column()
  password: string;

  @Column({
    default: 0,
    enum: [5, 10, 20, 50, 100],
  })
  deposit: number; // default is 0

  @Column({
    default: 0,
  })
  balance: number; // default is 0

  @Column({
    enum: ['buyer', 'seller'],
    default: 'buyer',
  })
  role: string; // buyer or seller default is buyer

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  created: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updated: Date;

  @Column('jsonb', { default: [] })
  purchasedItems: {
    id: number;
    productName: string;
    cost: number;
    quantity: number;
    datePurchased: Date;
  }[];

  // associate user with products
  @OneToMany((type) => ProductEntity, (product) => product.adapter)
  products: ProductEntity[];

  @BeforeInsert()
  async hashPassword() {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }

  toResponseObject(showToken = true): UserRO {
    const { id, created, username, token } = this;
    const responseObject: any = { id, created, username };
    if (showToken) {
      responseObject.token = token;
    }

    return responseObject;
  }

  async comparePassword(attempt: string) {
    return await bcrypt.compare(attempt, this.password);
  }
  private get token() {
    const { id, username } = this;
    return jwt.sign(
      {
        id,
        username,
      },
      process.env.USER_JWT_SECRET,
      { expiresIn: '7d' },
    );
  }
}
