import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {}




// // update-profile.dto.ts
// import { IsNotEmpty } from 'class-validator';

// export class UpdateProfileDto {
//   @IsNotEmpty()
// id: string;

//   name?: string;

//   email?: string;

//   password?: string;

//   phone?: string;

//   address?: string;
// }
