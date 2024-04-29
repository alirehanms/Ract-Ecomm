// // admin.middleware.ts
// import {
//   Injectable,
//   NestMiddleware,
//   UnauthorizedException,
// } from '@nestjs/common';
// import { Request, Response, NextFunction } from 'express';
// import { User } from 'src/user/entities/user.entity';
// import { UserService } from 'src/user/user.service';
// import { FindOneOptions } from 'typeorm';


// @Injectable()
// export class AdminMiddleware implements NestMiddleware {
//   constructor(private readonly userService: UserService) {}

//   // async use(req: Request, res: Response, next: NextFunction) {
//   //   try {
//   //     const userId = req['user'].id; // Assuming the user information is attached to the request
//   //     const user = await this.userService.findById(userId);
//   //     if (!user || user.role !== 1) {
//   //       throw new UnauthorizedException('Unauthorized Access');
//   //     }
//   //     next();
//   //   } catch (error) {
//   //     console.log(error);
//   //     throw new UnauthorizedException('Error in admin middleware');
//   //   }
//   // }
//   ///////////second/////
//   // async use(req: Request, res: Response, next: NextFunction) {
//   //   try {
//   //     console.log('Request user:', req['user']); // Log user information
//   //     const userId = req['user']?.id; // Access user ID safely
//   //     if (!userId) {
//   //       throw new UnauthorizedException('User ID not found in request');
//   //     }
//   //     const user = await this.userService.findById(userId);
//   //     if (!user || user.role !== 1) {
//   //       throw new UnauthorizedException('Unauthorized Access');
//   //     }
//   //     next();
//   //   } catch (error) {
//   //     console.log(error);
//   //     throw new UnauthorizedException('Error in admin middleware');
//   //   }
//   // }

//   async use(req: Request, res: Response, next: NextFunction) {
//     try {
//       if (!req['user'] || !req['user'].id) {
//         throw new UnauthorizedException('User ID not found in request');
//       }
//       const userId = req['user'].id;
//       const options: FindOneOptions<User> = {
//         where: { id: userId.toString() }, // Convert to string if necessary
//       };
//       const users = await this.userService.findById(userId, options);
//       const user = users[0];
//       if (!user || user.role !== 1) {
//         throw new UnauthorizedException('Unauthorized Access');
//       }
//       next();
//     } catch (error) {
//       console.log(error);
//       throw new UnauthorizedException('Error in admin middleware');
//     }
//   }
// }
     




// import {
//   Injectable,
//   NestMiddleware,
//   UnauthorizedException,
// } from '@nestjs/common';
// import { Request, Response, NextFunction } from 'express';
// import { JwtService } from '@nestjs/jwt';

// @Injectable()
// export class AdminMiddleware implements NestMiddleware {
//   constructor(private jwtService: JwtService) {}

//   use(req: Request, res: Response, next: NextFunction) {
//     // Extract the JWT token from the Authorization header
//     const token = req.headers.authorization?.split(' ')[1];

//     if (!token) {
//       throw new UnauthorizedException('Token not provided');
//     }

//     try {
//       // Decode the JWT token to get the payload
//       const payload = this.jwtService.verify(token);

//       // Check if the user has the admin role (assuming role 1 indicates admin)
//       if (payload.role !== 1) {
//         throw new UnauthorizedException('Unauthorized: Not an admin');
//       }

//       // If the user is an admin, proceed with the request
//       next();
//     } catch (error) {
//       throw new UnauthorizedException('Invalid token');
//     }
//   }
// }
 













import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class AdminMiddleware implements NestMiddleware {
  constructor(private jwtService: JwtService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const token = req.headers.authorization?.split(' ')[1]; // Extract JWT token from Authorization header
    if (!token) {
      throw new UnauthorizedException('Token not found');
    }

    try {
      const decodedToken = this.jwtService.verify(token); // Verify JWT token
      const { role } = decodedToken;
      if (role !== 1) {
        // Assuming 1 represents the admin role
        throw new UnauthorizedException(
          'You are not authorized to access this resource',
        );
      }
      next(); // Proceed with the request
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
