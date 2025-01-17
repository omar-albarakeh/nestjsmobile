import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Item } from './item.interface';
import { CreateItemDto } from './create-item.dto';
import { UpdateItemDto } from './update-item.dto';

@Injectable()
export class ItemsService {
    constructor(@InjectModel('Item') private readonly itemModel: Model<Item>) {}

    async create(createItemDto: CreateItemDto): Promise<Item> {
        const newItem = new this.itemModel(createItemDto);
        return newItem.save();
    }

    async findAll(page: number = 1, limit: number = 10): Promise<{ items: Item[]; total: number }> {
        const skip = (page - 1) * limit;
        const items = await this.itemModel.find().skip(skip).limit(limit).exec();
        const total = await this.itemModel.countDocuments().exec();
        return { items, total };
    }

    async findOne(id: string): Promise<Item> {
        const item = await this.itemModel.findById(id).exec();
        if (!item) {
            throw new NotFoundException('Item not found');
        }
        return item;
    }

    async update(id: string, updateItemDto: UpdateItemDto): Promise<Item> {
        const updatedItem = await this.itemModel.findByIdAndUpdate(id, updateItemDto, { new: true }).exec();
        if (!updatedItem) {
            throw new NotFoundException('Item not found');
        }
        return updatedItem;
    }

    async delete(id: string): Promise<void> {
        const result = await this.itemModel.findByIdAndDelete(id).exec();
        if (!result) {
            throw new NotFoundException('Item not found');
        }
    }

    async findByCategory(category: string, page: number = 1, limit: number = 10): Promise<{ items: Item[]; total: number }> {
        const skip = (page - 1) * limit;
        const items = await this.itemModel.find({ category }).skip(skip).limit(limit).exec();
        const total = await this.itemModel.countDocuments({ category }).exec();
        return { items, total };
    }
}