import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiParam, ApiTags } from '@nestjs/swagger';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';
import AddCartItemDto from '../cart-item/dto/add-item.dto';

@ApiTags('carrinho')
@Controller('carrinho')
export class CartController {
  adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL!,
  });
  private readonly prisma = new PrismaClient({ adapter: this.adapter });
  private readonly usuarioId = 'usuario-123';

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
    description: 'Estoque insuficiente',
  })
  @Post('carrinho/adicionar')
  async adicionarItem(@Body() itemDto: AddCartItemDto) {
    const carrinho = await this.obterOuCriarCarrinho();

    const produto = await this.prisma.produto.findUnique({
      where: { id: itemDto.produtoId },
    });
    if (!produto) {
      throw new NotFoundException(
        `Produto com ID ${itemDto.produtoId} não encontrado.`,
      );
    }

    if (produto.estoque < itemDto.quantidade) {
      throw new BadRequestException(
        `Estoque insuficiente para "${produto.nome}". Disponível: ${produto.estoque}.`,
      );
    }

    const [, carrinhoAtualizado] = await this.prisma.$transaction([
      this.prisma.produto.update({
        where: { id: itemDto.produtoId },
        data: { estoque: { decrement: itemDto.quantidade } },
      }),
      this.prisma.carrinho.update({
        where: { id: carrinho.id },
        data: {
          itens: {
            upsert: {
              where: {
                produtoId_carrinhoId: {
                  produtoId: itemDto.produtoId,
                  carrinhoId: carrinho.id,
                },
              },
              create: {
                produtoId: itemDto.produtoId,
                quantidade: itemDto.quantidade,
              },
              update: { quantidade: { increment: itemDto.quantidade } },
            },
          },
        },
        include: { itens: { include: { produto: true } } },
      }),
    ]);

    return {
      mensagem: 'Item adicionado ao carrinho!',
      carrinho: this.formatarCarrinho(carrinhoAtualizado),
    };
  }

  @ApiOperation({ summary: 'Ver carrinho atual' })
  @ApiResponse({
    status: 200,
    description: 'Carrinho retornado com sucesso',
  })
  @Get('carrinho')
  async verCarrinho() {
    const carrinho = await this.obterOuCriarCarrinho();
    return this.formatarCarrinho(carrinho);
  }

  @ApiOperation({ summary: 'Remover item do carrinho' })
  @ApiParam({ name: 'produtoId', description: 'ID do produto a ser removido' })
  @ApiResponse({
    status: 200,
    description: 'Item removido do carrinho com sucesso',
  })
  @ApiResponse({
    status: 404,
    description: 'Produto não está no carrinho',
  })
  @Delete('carrinho/remover/:produtoId')
  async removerItem(@Param('produtoId') produtoId: string) {
    const carrinho = await this.obterOuCriarCarrinho();
    const itemNoCarrinho = carrinho.itens.find(
      (i) => i.produtoId === produtoId,
    );

    if (!itemNoCarrinho) {
      throw new NotFoundException(
        `Produto com ID ${produtoId} não está no carrinho.`,
      );
    }

    const [, carrinhoAtualizado] = await this.prisma.$transaction([
      this.prisma.produto.update({
        where: { id: produtoId },
        data: { estoque: { increment: itemNoCarrinho.quantidade } },
      }),
      this.prisma.carrinho.update({
        where: { id: carrinho.id },
        data: {
          itens: {
            delete: { id: itemNoCarrinho.id },
          },
        },
        include: { itens: { include: { produto: true } } },
      }),
    ]);

    return {
      mensagem: 'Item removido do carrinho!',
      carrinho: this.formatarCarrinho(carrinhoAtualizado),
    };
  }

  // --- MÉTODOS PRIVADOS AUXILIARES ---

  private async obterOuCriarCarrinho() {
    let carrinho = await this.prisma.carrinho.findUnique({
      where: { usuarioId: this.usuarioId },
      include: { itens: { include: { produto: true } } },
    });

    if (!carrinho) {
      carrinho = await this.prisma.carrinho.create({
        data: { usuarioId: this.usuarioId },
        include: { itens: { include: { produto: true } } },
      });
    }
    return carrinho;
  }

  private formatarCarrinho(
    carrinho: Awaited<ReturnType<typeof this.obterOuCriarCarrinho>>,
  ) {
    const total = carrinho.itens.reduce((acc, item) => {
      return acc + item.quantidade * item.produto.preco;
    }, 0);

    return {
      id: carrinho.id,
      usuarioId: carrinho.usuarioId,
      itens: carrinho.itens.map((i) => ({
        produtoId: i.produtoId,
        nome: i.produto.nome,
        quantidade: i.quantidade,
        precoUnitario: i.produto.preco,
        totalItem: i.quantidade * i.produto.preco,
      })),
      total: total,
    };
  }
}
