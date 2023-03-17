import { ProductDTO } from './products.dto';
import { User } from './../user/user.decorator';
import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  UsePipes,
  ValidationPipe,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { AuthGuard } from '../shared/auth.guard';

@Controller('api/v1/products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get('')
  getAllProducts() {
    return this.productsService.getAllProducts();
  }

  @Get('/:id')
  getProductById(@Param('id') id: number) {
    return this.productsService.getOneProduct(id);
  }

  @Post('')
  @UseGuards(new AuthGuard())
  @UsePipes(new ValidationPipe())
  createProduct(@User('id') user, @Body() body: ProductDTO) {
    return this.productsService.createProduct(user, body);
  }

  @Put('/:id')
  @UseGuards(new AuthGuard())
  @UsePipes(new ValidationPipe())
  updateProduct(
    @User('id') user,
    @Param('id') id: number,
    @Body() body: ProductDTO,
  ) {
    return this.productsService.updateProduct(user, id, body);
  }

  @Delete('/:id')
  @UseGuards(new AuthGuard())
  @UsePipes(new ValidationPipe())
  deleteProduct(@User('id') user, @Param('id') id: number) {
    return this.productsService.deleteProduct(user, id);
  }

  @Post('buy/:id')
  @UseGuards(new AuthGuard())
  @UsePipes(new ValidationPipe())
  async buyProduct(
    @User('id') userId: string,
    @Param('id') id: number,
    @Body('amount') amount: number,
  ) {
    return this.productsService.buyProduct(userId, id, amount);
  }
}
