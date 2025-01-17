import { Controller, Get, Post, Body, Param, Put, Delete, Query, NotFoundException } from '@nestjs/common';
import { ItemsService } from './items.service';
import { CreateItemDto } from './create-item.dto';
import { UpdateItemDto } from './update-item.dto';

@Controller('items')
export class ItemsController {
    constructor(private readonly itemsService: ItemsService) {}

    @Post()
    async create(@Body() createItemDto: CreateItemDto) {
        return this.itemsService.create(createItemDto);
    }

    @Get()
    async findAll(@Query('page') page: number = 1, @Query('limit') limit: number = 40) {
        return this.itemsService.findAll(page, limit);
    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
        const item = await this.itemsService.findOne(id);
        if (!item) {
            throw new NotFoundException('Item not found');
        }
        return item;
    }

    @Put(':id')
    async update(@Param('id') id: string, @Body() updateItemDto: UpdateItemDto) {
        return this.itemsService.update(id, updateItemDto);
    }

    @Delete(':id')
    async delete(@Param('id') id: string) {
        return this.itemsService.delete(id);
    }

    // New endpoint to get items by category
    @Get('category/:category')
    async findByCategory(
        @Param('category') category: string,
        @Query('page') page: number = 1,
        @Query('limit') limit: number = 10,
    ) {
        return this.itemsService.findByCategory(category, page, limit);
    }
}