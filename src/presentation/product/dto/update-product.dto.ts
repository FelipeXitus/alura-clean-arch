import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class UpdateProductDto {
  @ApiProperty({
    description: 'Nome do produto',
    example: 'Smartphone XYZ',
    required: false,
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  nome?: string;

  @ApiProperty({
    description: 'Preço do produto',
    example: 1299.99,
    minimum: 0.01,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(0.01)
  preco?: number;

  @ApiProperty({
    description: 'Quantidade em estoque',
    example: 50,
    minimum: 0,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  estoque?: number;
}

export default UpdateProductDto;
