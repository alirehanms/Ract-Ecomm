import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { dataSourceOptions } from 'db/data-source';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { CategoryModule } from './category/category.module';
import { ProductModule } from './product/product.module';
import { OrderModule } from './order/order.module';
import { AdminMiddleware } from './middleware/admin.middleware';
import { JwtModule } from '@nestjs/jwt';
import { AuthModule } from './user/auth/auth.module';
// import { AdminMiddleware } from './middleware/admin.middleware';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    AuthModule,
    JwtModule.registerAsync({
      imports: [ConfigModule], // Ensure ConfigModule is imported
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.get<string | number>('JWT_EXPIRES'),
        },
      }),
      inject: [ConfigService], // Inject ConfigService into factory function
    }),
    TypeOrmModule.forRoot(dataSourceOptions),

    UserModule,

    CategoryModule,

    ProductModule,

    OrderModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AdminMiddleware).forRoutes(
      { path: 'product', method: RequestMethod.POST },
      // { path: 'product/:id', method: RequestMethod.PUT },
      // { path: 'product/:id', method: RequestMethod.DELETE },
      { path: 'category', method: RequestMethod.POST },
      // { path: 'check-auth', method: RequestMethod.GET },
    );
  }
}
