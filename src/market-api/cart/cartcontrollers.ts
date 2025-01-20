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

  /**
   * Create a new cart for a user.
   * @param userId - The ID of the user.
   * @returns The newly created cart.
   */
  @Post(':userId')
  @HttpCode(HttpStatus.CREATED) // Return 201 status code for resource creation
  async createCart(@Param('userId') userId: string) {
    try {
      return await this.cartService.createCart(userId);
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  /**
   * Add an item to the user's cart.
   * @param userId - The ID of the user.
   * @param itemId - The ID of the item to add.
   * @param quantity - The quantity of the item to add.
   * @returns The updated cart.
   */
  @Post(':userId/add/:itemId')
  @HttpCode(HttpStatus.OK) // Return 200 status code for successful updates
  async addItemToCart(
    @Param('userId') userId: string,
    @Param('itemId') itemId: string,
    @Body('quantity') quantity: number,
  ) {
    try {
      return await this.cartService.addItemToCart(userId, itemId, quantity);
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  /**
   * Remove an item from the user's cart.
   * @param userId - The ID of the user.
   * @param itemId - The ID of the item to remove.
   * @returns The updated cart.
   */
  @Delete(':userId/remove/:itemId')
  @HttpCode(HttpStatus.OK) // Return 200 status code for successful updates
  async removeItemFromCart(
    @Param('userId') userId: string,
    @Param('itemId') itemId: string,
  ) {
    try {
      return await this.cartService.removeItemFromCart(userId, itemId);
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  /**
   * Get the user's cart with populated items.
   * @param userId - The ID of the user.
   * @returns The user's cart with populated items.
   */
  @Get(':userId')
  @HttpCode(HttpStatus.OK) // Return 200 status code for successful retrieval
  async getCart(@Param('userId') userId: string) {
    try {
      return await this.cartService.getCart(userId);
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }
}