import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Cart } from './cart.schema';
import { Item } from '../items/item.schema';
import { User } from '../../Auth/schemas/user.schema';

@Injectable()
export class CartService {
  constructor(
    @InjectModel('Cart') private readonly cartModel: Model<Cart>,
    @InjectModel('Item') private readonly itemModel: Model<Item>,
    @InjectModel('User') private readonly userModel: Model<User>,
  ) {}

  async createCart(userId: string): Promise<Cart> {
    const newCart = new this.cartModel();
    await newCart.save();

    await this.userModel.findByIdAndUpdate(userId, { cart: newCart._id });

    return newCart;
  }


 async addItemToCart(userId: string, itemId: string, quantity: number): Promise<Cart> {
  const user = await this.userModel.findById(userId).populate('cart');
  if (!user || !user.cart) {
    throw new NotFoundException('User or cart not found');
  }

  const item = await this.itemModel.findById(itemId);
  if (!item) {
    throw new NotFoundException('Item not found');
  }

  const cart = await this.cartModel.findById(user.cart);

  const itemIndex = cart.items.findIndex((id) => id.toString() === itemId);

  if (itemIndex > -1) {
    const currentQuantity = cart.quantities.get(itemId) || 0;
    cart.quantities.set(itemId, currentQuantity + quantity);
  } else {
    cart.items.push(itemId);
    cart.quantities.set(itemId, quantity);
  }

  cart.totalPrice += item.price * quantity;

  await cart.save();
  return cart;
}
  async removeItemFromCart(userId: string, itemId: string): Promise<Cart> {
  const user = await this.userModel.findById(userId).populate('cart');
  if (!user || !user.cart) {
    throw new NotFoundException('User or cart not found');
  }

  const cart = await this.cartModel.findById(user.cart);

  const itemIndex = cart.items.findIndex((id) => id.toString() === itemId);

  if (itemIndex > -1) {
    const item = await this.itemModel.findById(itemId);
    if (item) {
      cart.totalPrice -= item.price * (cart.quantities.get(itemId) || 0);
    }
    cart.items.splice(itemIndex, 1);
    cart.quantities.delete(itemId);
  } else {
    throw new NotFoundException('Item not found in cart');
  }

  await cart.save();
  return cart;
}

  async getCart(userId: string): Promise<Cart> {
    const user = await this.userModel.findById(userId).populate('cart');
    if (!user || !user.cart) {
      throw new NotFoundException('User or cart not found');
    }
    return this.cartModel.findById(user.cart).populate('items');
  }
}