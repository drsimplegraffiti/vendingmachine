import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let appController: AppController;
  let appService: AppService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appService = app.get<AppService>(AppService);
    appController = app.get<AppController>(AppController);
  });

  describe('getHello', () => {
    it('should return a message with "Vendex"', () => {
      const result = { message: 'Welcome to the Vendex 🍬🍬' };
      jest.spyOn(appService, 'getHello').mockImplementation(() => result);
      expect(appController.getHello()).toBe(result);
    });
  });
});
