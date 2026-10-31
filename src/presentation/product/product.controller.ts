import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';
import CreateProductDto from './dto/create-product.dto';
import UpdateProductDto from './dto/update-product.dto';
import { CreateProductUseCase } from '../../domain/product/use-cases/create-product.use-case';
import { ListProductsUseCase } from '../../domain/product/use-cases/list-products.use-case';
import { GetProductByIdUseCase } from '../../domain/product/use-cases/get-product-by-id.use.case';
import { UpdateProductUseCase } from '../../domain/product/use-cases/update-product.use.case';
import { DeleteProductUseCase } from '../../domain/product/use-cases/delete-product.use-case';

@ApiTags('produtos')
@Controller('produtos')
export class ProductController {
  private readonly adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL!,
  });

  private readonly prisma = new PrismaClient({
    adapter: this.adapter,
  });

  @ApiOperation({ summary: 'Criar um novo produto' })
  @ApiResponse({
    status: 201,
    description: 'Produto criado com sucesso',
  })
  @ApiResponse({
    status: 409,
    description: 'Já existe um produto com este nome',
  })
  @Post()
  async createProduct(@Body() dadosDoProduto: CreateProductDto) {
    const useCase = new CreateProductUseCase(this.prisma);

    const product = await useCase.execute(dadosDoProduto);

    return {
      mensagem: 'Produto criado com sucesso!',
      produto: product,
    };
  }

  @ApiOperation({ summary: 'Listar todos os produtos' })
  @ApiResponse({
    status: 200,
    description: 'Lista de produtos retornada com sucesso',
  })
  @Get()
  async listProducts() {
    const useCase = new ListProductsUseCase(this.prisma);

    return useCase.execute();
  }

  @ApiOperation({ summary: 'Obter um produto específico' })
  @ApiParam({
    name: 'id',
    description: 'ID do produto',
  })
  @ApiResponse({
    status: 200,
    description: 'Produto encontrado',
  })
  @ApiResponse({
    status: 404,
    description: 'Produto não encontrado',
  })
  @Get('/:id')
  async getProductById(@Param('id') id: string) {
    const useCase = new GetProductByIdUseCase(this.prisma);

    return useCase.execute(id);
  }

  @ApiOperation({ summary: 'Atualizar um produto existente' })
  @ApiParam({
    name: 'id',
    description: 'ID do produto',
  })
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
  @ApiResponse({
    status: 409,
    description: 'Já existe um produto com este nome',
  })
  @Put('/:id')
  async updateProduct(
    @Param('id') id: string,
    @Body() dadosParaAtualizar: UpdateProductDto,
  ) {
    const useCase = new UpdateProductUseCase(this.prisma);

    const product = await useCase.execute(id, dadosParaAtualizar);

    return {
      mensagem: 'Produto atualizado!',
      produto: product,
    };
  }

  @ApiOperation({ summary: 'Remover um produto' })
  @ApiParam({
    name: 'id',
    description: 'ID do produto',
  })
  @ApiResponse({
    status: 204,
    description: 'Produto removido com sucesso',
  })
  @ApiResponse({
    status: 404,
    description: 'Produto não encontrado',
  })
  @Delete('/:id')
  @HttpCode(204)
  async deleteProduct(@Param('id') id: string) {
    const useCase = new DeleteProductUseCase(this.prisma);

    await useCase.execute(id);
  }
}
