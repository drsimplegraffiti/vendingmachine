import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserDTO, UserRO } from './user.dto';
import { UserEntity } from './user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  async signup(data: UserDTO) {
    const { username } = data;
    let user = await this.userRepository.findOne({ where: { username } });
    if (user) {
      throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
    }
    user = await this.userRepository.create(data);
    await this.userRepository.save(user);
    return user.toResponseObject();
  }

  async login(data: UserDTO): Promise<UserRO> {
    const { username, password } = data;
    const user = await this.userRepository.findOne({
      where: { username },
    });
    if (!user || !(await user.comparePassword(password))) {
      throw new HttpException(
        'Invalid username/password',
        HttpStatus.BAD_REQUEST,
      );
    }
    return user.toResponseObject();
  }
  //get user profile by id
  async profile(id: string): Promise<UserRO> {
    const user = await this.userRepository.findOne({
      where: { id },
    });
    if (!user) {
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    }
    return user.toResponseObject();
  }

  async depositMoney(userId: string, deposit: number) {
    const user = await this.userRepository.findOne({
      where: { id: userId, role: 'buyer' },
    });

    if (!user) {
      throw new HttpException(
        'Forbidden. You are not authorized to perform this action 🙄',
        HttpStatus.FORBIDDEN,
      );
    }

    if (![5, 10, 20, 50, 100].includes(deposit)) {
      throw new HttpException(
        'Invalid deposit amount. Please deposit 5, 10, 20, 50 or 100',
        HttpStatus.BAD_REQUEST,
      );
    }

    user.balance = Number(user.balance) + deposit;

    user.deposit = Number(user.deposit) + deposit;

    await this.userRepository.save(user);

    return {
      message: `Amount deposited successfully. Your current balance is ${user.balance}`,
    };
  }

  ///reset endpoint so users with a “buyer” role can reset their deposit back to 0
  async resetDeposit(id: string) {
    const user = await this.userRepository.findOne({
      where: { id },
    });
    if (!user) {
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    }
    user.deposit = 0;
    user.balance = 0;
    user.updated = new Date();
    await this.userRepository.save(user);
    return user.toResponseObject();
  }
}
