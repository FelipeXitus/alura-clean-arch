import { NotFoundException } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

export class DeleteProductUseCase {
  public constructor(private readonly prisma: PrismaClient) {}

  public async execute(id: string): Promise<void> {
    const productExists = await this.prisma.produto.findUnique({
      where: { id },
    });

    if (!productExists) {
      throw new NotFoundException(`Produto com ID ${id} não encontrado.`);
    }

    await this.prisma.produto.delete({
      where: { id },
    });
  }
}
