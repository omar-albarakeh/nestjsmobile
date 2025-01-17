// src/cart/cart.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Cart, CartItem } from './cart.schema';
import { AddToCartDto } from './cartdto';
import { RemoveFromCartDto } from './cartdto';
import { User } from '../../Auth/schemas/user.schema';

@Injectable()
export class CartService {
    constructor(
        @InjectModel('Cart') private readonly cartModel: Model<Cart>,
        @InjectModel('User') private readonly userModel: Model<User>,
    ) {}

    async getCart(userId: string): Promise<Cart> {
        const cart = await this.cartModel.findOne({ userId }).populate('items.itemId').exec();
        if (!cart) {
            throw new NotFoundException('Cart not found');
        }
        return cart;
    }

    async addToCart(userId: string, addToCartDto: AddToCartDto): Promise<Cart> {
    const { itemId, quantity } = addToCartDto;

    let cart = await this.cartModel.findOne({ userId }).exec();

    if (!cart) {
        cart = new this.cartModel({ userId, items: [] });
    }

    const itemIndex = cart.items.findIndex((item) => item.itemId.toString() === itemId);

    if (itemIndex > -1) {
        cart.items[itemIndex].quantity += quantity;
    } else {
        const newItem: CartItem = {
            itemId: itemId,
            quantity: quantity,
        } as CartItem;
        cart.items.push(newItem);
    }

    return cart.save();
}

    async removeFromCart(userId: string, removeFromCartDto: RemoveFromCartDto): Promise<Cart> {
        const { itemId } = removeFromCartDto;

        const cart = await this.cartModel.findOne({ userId }).exec();

        if (!cart) {
            throw new NotFoundException('Cart not found');
        }

        cart.items = cart.items.filter((item) => item.itemId.toString() !== itemId);

        return cart.save();
    }

    async clearCart(userId: string): Promise<void> {
        await this.cartModel.findOneAndDelete({ userId }).exec();
    }
}