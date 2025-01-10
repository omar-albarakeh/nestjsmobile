import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, isValidObjectId } from 'mongoose';
import { Product } from './schema/product.schema';
import { CreateMarketItemDto } from './dto/create-market-item.dto';
import { UpdateMarketItemDto } from './dto/update-market-item.dto';

@Injectable()
export class ProductRepository {
  constructor(
    @InjectModel(Product.name) private readonly productModel: Model<Product>,
  ) {}

  async findAll(): Promise<Product[]> {
    return await this.productModel
      .find()
      .sort({ createdAt: -1 }) 
      .exec();
  }

  async findByCategory(category: string): Promise<Product[]> {
    return await this.productModel
      .find({ category })
      .sort({ price: 1 })
      .exec();
  }

  async findOneById(id: string): Promise<Product> {
    if (!isValidObjectId(id)) {
      throw new NotFoundException(`Invalid ID: ${id}`);
    }

    const product = await this.productModel.findById(id).exec();
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    return product;
  }

  async create(createMarketItemDto: CreateMarketItemDto): Promise<Product> {
    try {
      const product = new this.productModel(createMarketItemDto);
      return await product.save();
    } catch (error) {
      throw new Error('Failed to create product');
    }
  }

  async update(
    id: string,
    updateMarketItemDto: UpdateMarketItemDto,
  ): Promise<Product> {
    if (!isValidObjectId(id)) {
      throw new NotFoundException(`Invalid ID: ${id}`);
    }

    const updatedProduct = await this.productModel
      .findByIdAndUpdate(id, updateMarketItemDto, { new: true })
      .exec();

    if (!updatedProduct) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    return updatedProduct;
  }

  async delete(id: string): Promise<void> {
    if (!isValidObjectId(id)) {
      throw new NotFoundException(`Invalid ID: ${id}`);
    }

    const result = await this.productModel.findByIdAndDelete(id).exec();

    if (!result) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
  }

  async findByPriceRange(minPrice: number, maxPrice: number): Promise<Product[]> {
    return await this.productModel
      .find({
        price: { $gte: minPrice, $lte: maxPrice },
      })
      .sort({ price: 1 })
      .exec();
  }

  async searchByText(search: string): Promise<Product[]> {
    return await this.productModel
      .find({
        $or: [
          { name: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } },
        ],
      })
      .exec();
  }
}
