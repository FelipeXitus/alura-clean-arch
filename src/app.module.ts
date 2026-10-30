import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductModule } from './infrastucture/Modules/product.module';
import { CartModule } from './infrastucture/Modules/cart.module';

@Module({
  imports: [CartModule, ProductModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
