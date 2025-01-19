// import { Injectable, NotFoundException } from '@nestjs/common';
// import { InjectModel } from '@nestjs/mongoose';
// import { Model } from 'mongoose';
// import { Cart } from './cart.schema';
// import { Item } from '../items/item.schema';

// @Injectable()
// export class CartService {
//   constructor(
//     @InjectModel(Cart.name) private readonly cartModel: Model<Cart>,
//     @InjectModel('Item') private readonly itemModel: Model<Item>,
//   ) {}

//   async addItemToCart(userId: string, itemId: string, quantity: number = 1): Promise<Cart> {
//     const item = await this.itemModel.findById(itemId).exec();
//     if (!item) {
//       throw new NotFoundException('Item not found');
//     }

//     let cart = await this.cartModel.findOne({ user: userId }).exec();
//     if (!cart) {
//       cart = new this.cartModel({ user: userId, items: [] });
//     }

//     cart.addItem(item._id, quantity);
//     return cart.save();
//   }

//   async removeItemFromCart(userId: string, itemId: string): Promise<Cart> {
//     const cart = await this.cartModel.findOne({ user: userId }).exec();
//     if (!cart) {
//       throw new NotFoundException('Cart not found');
//     }

//     cart.removeItem(itemId);
//     return cart.save();
//   }
// }
