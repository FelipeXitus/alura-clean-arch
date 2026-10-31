import { Module } from '@nestjs/common';

import { CartController } from '../../presentation/cart/cart.controller';

import { AddCartItemUseCase } from '../../domain/cart/use-cases/add-cart-item.use-case';
import { GetCartUseCase } from '../../domain/cart/use-cases/get-cart.use-case';
import { RemoveCartItemUseCase } from '../../domain/cart/use-cases/remove-cart-item.use-case';

import { ICartRepository } from '../../domain/cart/i-cart.repository';
import { CartRepository } from '../repositories/cart.repository';
import { PrismaModule } from './prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [CartController],
  providers: [
    AddCartItemUseCase,
    GetCartUseCase,
    RemoveCartItemUseCase,
    {
      provide: ICartRepository,
      useClass: CartRepository,
    },
  ],
})
export class CartModule {}
