import { Module } from '@nestjs/common';
import { ProductModule } from './infrastucture/Modules/product.module';
import { CartModule } from './infrastucture/Modules/cart.module';

@Module({
  imports: [CartModule, ProductModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
