// export class CreateProductDto {
//     name: string;
//     description: string;
//     price: number;
//     categoryid: number;
//     quantity: number;
//     shipping: boolean;
//     photo: Buffer;
   
// }
import { IsNotEmpty, IsString, IsNumber, IsBoolean } from 'class-validator';

export class CreateProductDto {

  name: string;



  
  description: string;


  price: number;


  quantity: number;

 
  categoryid: number;

  // Add more validation for other fields as needed

 
  shipping: boolean;

 
}
