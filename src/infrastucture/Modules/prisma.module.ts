import { Module } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { PRISMA_CLIENT } from '../constants/injection-tokens.const';

@Module({
  providers: [
    {
      provide: PRISMA_CLIENT,
      useFactory: () => {
        const connectionString = process.env.DATABASE_URL;

        if (!connectionString) {
          throw new Error('DATABASE_URL não foi definida');
        }

        const adapter = new PrismaPg({
          connectionString,
        });

        return new PrismaClient({
          adapter,
        });
      },
    },
  ],
  exports: [PRISMA_CLIENT],
})
export class PrismaModule {}
