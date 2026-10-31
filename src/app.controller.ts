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
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';

// --- DTOs (Data Transfer Objects) ---
// Todos os DTOs foram movidos para este arquivo.


@Controller()
export class AppController {
  // Instanciação direta do PrismaClient.
  adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL!,
  });
  private readonly prisma = new PrismaClient({ adapter: this.adapter });
  // ID do usuário fixo para simulação do carrinho.
  private readonly usuarioId = 'usuario-123';

  constructor() {}
}
