import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

export class AddCartItemDto {
  @ApiProperty({
    description: 'ID do produto',
    example: 'c7d8e9f0-1a2b-3c4d-5e6f-7g8h9i0j1k2l',
  })
  @IsString()
  @IsNotEmpty()
  produtoId: string = '';

  @ApiProperty({
    description: 'Quantidade do produto',
    example: 1,
    minimum: 1,
  })
  @IsNumber()
  @Min(1, { message: 'A quantidade deve ser de no mínimo 1.' })
  quantidade: number = 1;
}

export default AddCartItemDto;
