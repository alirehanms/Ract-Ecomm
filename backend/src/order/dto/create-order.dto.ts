// order.dto.ts

import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateOrderDto {
  @IsNotEmpty()
  @IsNumber()
  buyerId: number;

  @IsNotEmpty()
  @IsNumber()
  productId: number;

//   @IsNotEmpty()
//   @IsString()
//   status: string;
}
