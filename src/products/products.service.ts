import { ProductDTO, ProductRO } from './products.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductEntity } from './products.entity';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserEntity } from 'src/user/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(ProductEntity)
    private productRepository: Repository<ProductEntity>,
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  private toResponseObject(product: ProductEntity): ProductRO {
    const responseObject: any = {
      ...product,
      adapter: product.adapter.toResponseObject(false),
    };
    return responseObject;
  }

  private ensureOwnership(product: ProductEntity, userId: string) {
    if (product.adapter.id !== userId) {
      throw new HttpException(
        'You do not own this product',
        HttpStatus.UNAUTHORIZED,
      );
    }
    // check if the user is a seller
    if (product.adapter.role !== 'seller') {
      throw new HttpException(
        'You are unauthorized to perform this action 🙄',
        HttpStatus.FORBIDDEN,
      );
    }
  }

  async getAllProducts() {
    return await this.productRepository.find();
  }

  async getOneProduct(id: number) {
    if (!id) {
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    }
    const product = await this.productRepository.findOne({
      where: { id },
      relations: ['adapter'],
    });
    if (!product) {
      throw new HttpException('Product Not found 💧💧', HttpStatus.NOT_FOUND);
    }
    return this.toResponseObject(product);
  }

  async createProduct(userId: string, data: ProductDTO): Promise<ProductRO> {
    const user = await this.userRepository.findOne({
      where: { id: userId, role: 'seller' },
    });

    if (!user) {
      throw new HttpException(
        'You are unauthorized to perform this action',
        HttpStatus.FORBIDDEN,
      );
    }

    const product = await this.productRepository.create({
      ...data,
      adapter: user,
    });
    await this.productRepository.save(product);
    return this.toResponseObject(product);
  }

  async deleteProduct(userId: string, id: number) {
    const product = await this.productRepository.findOne({
      where: { id },
      relations: ['adapter'],
    });

    if (!product) {
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    }

    this.ensureOwnership(product, userId);

    await this.productRepository.delete({ id });
    return { message: 'Product deleted successfully' };
  }

  async updateProduct(
    userId: string,
    id: number,
    data: Partial<ProductDTO>,
  ): Promise<ProductRO> {
    let product = await this.productRepository.findOne({
      where: { id },
      relations: ['adapter'],
    });

    if (!product) {
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    }

    this.ensureOwnership(product, userId);

    await this.productRepository.update({ id }, data);
    product = await this.productRepository.findOne({
      where: { id },
      relations: ['adapter'],
    });
    return this.toResponseObject(product);
  }

  async buyProduct(userId: string, id: number, amount: number) {
    const product = await this.productRepository.findOne({
      where: { id },
      relations: ['adapter'],
    });

    if (!product) {
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    }

    const user = await this.userRepository.findOne({
      where: { id: userId, role: 'buyer' },
    });

    if (!user) {
      throw new HttpException(
        'You are unauthorized to perform this action',
        HttpStatus.FORBIDDEN,
      );
    }

    // Extract the amount from the object and convert it to a number
    amount = Number(amount);
    if (amount > product.amountAvailable) {
      throw new HttpException(
        'Insufficient quantity. Please try again',
        HttpStatus.BAD_REQUEST,
      );
    }

    const total = product.cost * amount;
    if (total > user.balance) {
      throw new HttpException(
        'Insufficient balance. Please deposit money',
        HttpStatus.BAD_REQUEST,
      );
    }

    const change = user.balance - total;

    // Calculate change in coins if needed
    // const changeInCoins = this.calculateChange(change);

    user.balance = change;

    // Add purchased item to user's purchasedItems array
    const purchasedItem = {
      id: product.id,
      productName: product.productName,
      cost: product.cost,
      quantity: amount,
      datePurchased: new Date(),
    };

    user.purchasedItems.push(purchasedItem);

    await this.userRepository.save(user);

    // Update the amount of product available
    product.amountAvailable -= amount;

    await this.productRepository.save(product);

    return {
      total,
      purchasedItems: user.purchasedItems,
      change,
    };
  }
}
