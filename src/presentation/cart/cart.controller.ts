import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';

import AddCartItemDto from '../cart-item/dto/add-item.dto';
import { AddCartItemUseCase } from '../../domain/cart/use-cases/add-cart-item.use-case';
import { GetCartUseCase } from '../../domain/cart/use-cases/get-cart.use-case';
import { RemoveCartItemUseCase } from '../../domain/cart/use-cases/remove-cart-item.use-case';

@ApiTags('carrinho')
@Controller('carrinho')
export class CartController {
  private readonly usuarioId = 'usuario-123';

  public constructor(
    private readonly addCartItemUseCase: AddCartItemUseCase,
    private readonly getCartUseCase: GetCartUseCase,
    private readonly removeCartItemUseCase: RemoveCartItemUseCase,
  ) {}

  @ApiOperation({ summary: 'Adicionar item ao carrinho' })
  @ApiResponse({
    status: 200,
    description: 'Item adicionado ao carrinho com sucesso',
  })
  @ApiResponse({
    status: 404,
    description: 'Produto não encontrado',
  })
  @ApiResponse({
    status: 400,
    description: 'Quantidade inválida ou estoque insuficiente',
  })
  @Post()
  async addCartItem(@Body() itemDto: AddCartItemDto) {
    return this.addCartItemUseCase.execute(this.usuarioId, itemDto);
  }

  @ApiOperation({ summary: 'Ver carrinho atual' })
  @ApiResponse({
    status: 200,
    description: 'Carrinho retornado com sucesso',
  })
  @Get()
  async getCart() {
    return this.getCartUseCase.execute(this.usuarioId);
  }

  @ApiOperation({ summary: 'Remover item do carrinho' })
  @ApiParam({
    name: 'produtoId',
    description: 'ID do produto a ser removido',
  })
  @ApiResponse({
    status: 200,
    description: 'Item removido do carrinho com sucesso',
  })
  @ApiResponse({
    status: 404,
    description: 'Produto não está no carrinho',
  })
  @Delete('/:produtoId')
  async removeCartItem(@Param('produtoId') produtoId: string) {
    return this.removeCartItemUseCase.execute(this.usuarioId, produtoId);
  }
}
