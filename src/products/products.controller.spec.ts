import { HttpException, HttpStatus } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';

describe('ProductsController', () => {
  let controller: ProductsController;
  let service: ProductsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductsController],
      providers: [
        {
          provide: ProductsService,
          useValue: {
            buyProduct: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<ProductsController>(ProductsController);
    service = module.get<ProductsService>(ProductsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('buyProduct', () => {
    it('should throw an error if the product is not found', async () => {
      jest
        .spyOn(service, 'buyProduct')
        .mockRejectedValueOnce(
          new HttpException('Not found', HttpStatus.NOT_FOUND),
        );

      await expect(controller.buyProduct('1', 1, 2)).rejects.toThrow(
        HttpException,
      );
    });

    it('should throw an error if the user is not authorized', async () => {
      jest
        .spyOn(service, 'buyProduct')
        .mockRejectedValueOnce(
          new HttpException(
            'You are unauthorized to perform this action',
            HttpStatus.FORBIDDEN,
          ),
        );

      await expect(controller.buyProduct('2', 1, 2)).rejects.toThrow(
        HttpException,
      );
    });

    it('should throw an error if the quantity is insufficient', async () => {
      jest
        .spyOn(service, 'buyProduct')
        .mockRejectedValueOnce(
          new HttpException(
            'Insufficient quantity. Please try again',
            HttpStatus.BAD_REQUEST,
          ),
        );

      await expect(controller.buyProduct('1', 1, 5)).rejects.toThrow(
        HttpException,
      );
    });

    it('should throw an error if the balance is insufficient', async () => {
      jest
        .spyOn(service, 'buyProduct')
        .mockRejectedValueOnce(
          new HttpException(
            'Insufficient balance. Please deposit money',
            HttpStatus.BAD_REQUEST,
          ),
        );

      await expect(controller.buyProduct('1', 1, 2)).rejects.toThrow(
        HttpException,
      );
    });

    it('should buy the product successfully', async () => {
      const user = {
        id: '1',
        role: 'buyer',
        balance: 20,
        purchasedItems: [],
      };

      const product = {
        id: 1,
        productName: 'Test Product',
        cost: 5,
        amountAvailable: 10,
        adapter: null,
      };

      const purchasedItem = {
        id: product.id,
        productName: product.productName,
        cost: product.cost,
        quantity: 2,
        datePurchased: expect.any(Date),
      };

      jest.spyOn(service, 'buyProduct').mockResolvedValueOnce({
        total: 10,
        purchasedItems: [purchasedItem],
        change: 10,
      });

      const result = await controller.buyProduct('1', 1, 2);
      expect(result).toEqual({
        total: 10,
        purchasedItems: [purchasedItem],
        change: 10,
      });
    });
  });
});
