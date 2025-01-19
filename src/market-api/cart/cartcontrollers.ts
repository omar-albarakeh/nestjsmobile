// import { Controller, Post, Delete, Param, Body } from '@nestjs/common';
// import { CartService } from './cartservice';

// @Controller('cart')
// export class CartController {
//   constructor(private readonly cartService: CartService) {}

//   @Post(':userId/add')
//   async addItem(@Param('userId') userId: string, @Body() { itemId, quantity }: { itemId: string; quantity: number }) {
//     return this.cartService.addItemToCart(userId, itemId, quantity);
//   }

//   @Delete(':userId/remove/:itemId')
//   async removeItem(@Param('userId') userId: string, @Param('itemId') itemId: string) {
//     return this.cartService.removeItemFromCart(userId, itemId);
//   }
// }
