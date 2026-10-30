import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

export class CreateProductDto {
  @ApiProperty({
    description: 'Nome do produto',
    example: 'Smartphone XYZ',
  })
  @IsString()
  @IsNotEmpty()
  public nome: string = '';

  @ApiProperty({
    description: 'Preço do produto',
    example: 1299.99,
    minimum: 0.01,
  })
  @IsNumber()
  @Min(0.01)
  preco: number = 0;

  @ApiProperty({
    description: 'Quantidade em estoque',
    example: 50,
    minimum: 0,
  })
  @IsNumber()
  @Min(0)
  estoque: number = 0;
}

export default CreateProductDto;
