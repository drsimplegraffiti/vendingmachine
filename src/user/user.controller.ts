import { User } from './user.decorator';
import {
  Controller,
  Post,
  Body,
  Get,
  UsePipes,
  ValidationPipe,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from 'src/shared/auth.guard';
import { UserDTO } from './user.dto';
import { UserService } from './user.service';

@Controller('api/v1/user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('signup')
  @UsePipes(new ValidationPipe())
  async signup(@Body() data: UserDTO) {
    return this.userService.signup(data);
  }

  @Post('login')
  @UsePipes(new ValidationPipe())
  async login(@Body() data: UserDTO) {
    return this.userService.login(data);
  }

  @Get('profile')
  @UseGuards(new AuthGuard())
  async profile(@User('id') user) {
    return this.userService.profile(user);
  }

  @Post('deposit')
  @UseGuards(new AuthGuard())
  @UsePipes(new ValidationPipe())
  async depositMoney(@User('id') user, @Body('deposit') deposit) {
    return this.userService.depositMoney(user, deposit);
  }

  @Post('reset')
  @UseGuards(new AuthGuard())
  @UsePipes(new ValidationPipe())
  async resetDeposit(@User('id') user) {
    return this.userService.resetDeposit(user);
  }
}
