// src/cart/cart.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CartController } from './cartcontrollers';
import { CartService } from './cartservice';
import { Cart, CartSchema } from './cart.schema';
import { User, UserSchema } from '../../Auth/schemas/user.schema';
import { Item, ItemSchema } from '../items/item.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Cart.name, schema: CartSchema },
      { name: User.name, schema: UserSchema },
      { name: Item.name, schema: ItemSchema }, 
    ]),
  ],
  controllers: [CartController],
  providers: [CartService],
})
export class CartModule {}