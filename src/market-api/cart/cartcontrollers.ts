import {
  Controller,
  Post,
  Body,
  Param,
  Get,
  Delete,
  NotFoundException,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { CartService } from './cartservice';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}
@Post(':userId')
async createCart(@Param('userId') userId: string) {
  return this.cartService.createCart(userId);
}

  @Post(':userId/add/:itemId')
  async addItemToCart(
    @Param('userId') userId: string,
    @Param('itemId') itemId: string,
    @Body('quantity') quantity: number,
  ) {
    return this.cartService.addItemToCart(userId, itemId, quantity);
  }

  @Delete(':userId/remove/:itemId')
  async removeItemFromCart(
    @Param('userId') userId: string,
    @Param('itemId') itemId: string,
  ) {
    return this.cartService.removeItemFromCart(userId, itemId);
  }

  @Get(':userId')
  async getCart(@Param('userId') userId: string) {
    return this.cartService.getCart(userId);
  }
}