import {
    Controller,
    Post,
    Body,
    Get,
    Param,
    Delete,
    UseGuards,
    Req,
} from '@nestjs/common';
import { CartService } from './cartservice';
import { AddToCartDto } from './cartdto';
import { RemoveFromCartDto } from './cartdto';
import { AuthGuard } from '@nestjs/passport';

@Controller('cart')
@UseGuards(AuthGuard('jwt'))
export class CartController {
    constructor(private readonly cartService: CartService) {}

    @Get()
    async getCart(@Req() req) {
        const userId = req.user.id;
        return this.cartService.getCart(userId);
    }

    @Post('add')
    async addToCart(@Req() req, @Body() addToCartDto: AddToCartDto) {
        const userId = req.user.id;
        return this.cartService.addToCart(userId, addToCartDto);
    }

    @Delete('remove')
    async removeFromCart(@Req() req, @Body() removeFromCartDto: RemoveFromCartDto) {
        const userId = req.user.id;
        return this.cartService.removeFromCart(userId, removeFromCartDto);
    }

    @Delete('clear')
    async clearCart(@Req() req) {
        const userId = req.user.id;
        return this.cartService.clearCart(userId);
    }
}