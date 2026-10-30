import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  Delete,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import CreateProductDto from './dto/create-product.dto';
import UpdateProductDto from './dto/update-product.dto';
import { PrismaClient } from '.prisma/client/default.js';

@Controller('produto')
export class ProductController {
  private readonly prisma = new PrismaClient();

  @ApiOperation({ summary: 'Criar um novo produto' })
  @ApiResponse({
    status: 201,
    description: 'Produto criado com sucesso',
  })
  @ApiResponse({
    status: 409,
    description: 'Já existe um produto com este nome',
  })
  @Post('produtos')
  async criarProduto(@Body() dadosDoProduto: CreateProductDto) {
    const produtoExistente = await this.prisma.produto.findUnique({
      where: { nome: dadosDoProduto.nome },
    });

    if (produtoExistente) {
      throw new ConflictException('Já existe um produto com este nome.');
    }

    const produto = await this.prisma.produto.create({
      data: dadosDoProduto,
    });

    return { mensagem: 'Produto criado com sucesso!', produto };
  }

  @ApiOperation({ summary: 'Listar todos os produtos' })
  @ApiResponse({
    status: 200,
    description: 'Lista de produtos retornada com sucesso',
  })
  @Get('produtos')
  async listarTodos() {
    return this.prisma.produto.findMany();
  }

  @ApiOperation({ summary: 'Obter um produto específico' })
  @ApiParam({ name: 'id', description: 'ID do produto' })
  @ApiResponse({
    status: 200,
    description: 'Produto encontrado',
  })
  @ApiResponse({
    status: 404,
    description: 'Produto não encontrado',
  })
  @Get('produtos/:id')
  async buscarProdutoPorId(@Param('id') id: string) {
    const produto = await this.prisma.produto.findUnique({ where: { id } });
    if (!produto) {
      throw new NotFoundException(`Produto com ID ${id} não encontrado.`);
    }
    return produto;
  }

  @ApiOperation({ summary: 'Atualizar um produto existente' })
  @ApiParam({ name: 'id', description: 'ID do produto' })
  @ApiResponse({
    status: 200,
    description: 'Produto atualizado com sucesso',
  })
  @ApiResponse({
    status: 404,
    description: 'Produto não encontrado',
  })
  @ApiResponse({
    status: 400,
    description: 'Dados inválidos para atualização',
  })
  @Put('produtos/:id')
  async atualizarProduto(
    @Param('id') id: string,
    @Body() dadosParaAtualizar: UpdateProductDto,
  ) {
    await this.buscarProdutoPorId(id);

    if (Object.keys(dadosParaAtualizar).length === 0) {
      throw new BadRequestException(
        'Pelo menos um campo deve ser fornecido para atualização.',
      );
    }

    const produtoAtualizado = await this.prisma.produto.update({
      where: { id },
      data: dadosParaAtualizar,
    });

    return { mensagem: 'Produto atualizado!', produto: produtoAtualizado };
  }

  @ApiOperation({ summary: 'Remover um produto' })
  @ApiParam({ name: 'id', description: 'ID do produto' })
  @ApiResponse({
    status: 204,
    description: 'Produto removido com sucesso',
  })
  @ApiResponse({
    status: 404,
    description: 'Produto não encontrado',
  })
  @Delete('produtos/:id')
  @HttpCode(204)
  async removerProduto(@Param('id') id: string) {
    await this.buscarProdutoPorId(id);
    await this.prisma.produto.delete({ where: { id } });
  }
}
