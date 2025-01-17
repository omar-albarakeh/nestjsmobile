// src/cart/cart.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CartController } from './cartcontrollers';
import { CartService } from './cartservice';
import { Cart, CartSchema } from './cart.schema';
import { User, UserSchema } from '../../Auth/schemas/user.schema';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: 'Cart', schema: CartSchema }]),
        MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
    ],
    controllers: [CartController],
    providers: [CartService],
})
export class CartModule {}