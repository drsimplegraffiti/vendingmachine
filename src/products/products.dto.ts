import { IsNotEmpty } from 'class-validator';

export class ProductDTO {
  @IsNotEmpty()
  amountAvailable: number;

  @IsNotEmpty()
  cost: number;

  @IsNotEmpty()
  productName: string;

  user: string;
}

export class ProductRO {
  id?: number;
  amountAvailable: number;
  cost: number;
  productName: string;
  user?: string;
}
