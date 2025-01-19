import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schemas/user.schema';

@Injectable()
export class UserRepository {
  constructor(@InjectModel(User.name) private readonly userModel: Model<User>) {}

  async createUser(userData: Partial<User>): Promise<User> {
    try {
      const user = new this.userModel(userData);
      return await user.save();
    } catch (error) {
      if (error.code === 11000) {
        throw new ConflictException('Email is already taken.');
      }
      throw new BadRequestException('Failed to create user.');
    }
  }

  async findUserByEmail(email: string): Promise<User | null> {
    return await this.userModel.findOne({ email }).exec();
  }

  async findUserById(id: string): Promise<User | null> {
    return await this.userModel.findById(id).exec();
  }

  async findUserByName(name: string): Promise<User | null> {
    return await this.userModel.findOne({ name }).exec();
  }

  async isEmailTaken(email: string): Promise<boolean> {
    const user = await this.userModel.findOne({ email }).exec();
    return !!user;
  }

  async updateSolarInfo(
    userId: string,
    solarInfo: Partial<User['solarInfo']>,
  ): Promise<User['solarInfo'] | null> {
    const user = await this.userModel
      .findByIdAndUpdate(
        userId,
        {
          $set: {
            solarInfo,
            isSolarInfoComplete: true,
          },
        },
        { new: true },
      )
      .select('solarInfo')
      .exec();

    return user?.solarInfo || null;
  }

  async updateUser(userId: string, updates: Partial<User>): Promise<User | null> {
    return await this.userModel
      .findByIdAndUpdate(userId, { $set: updates }, { new: true })
      .exec();
  }

  async findAllUsers(): Promise<User[]> {
    return await this.userModel.find().select('name email phone blocked').exec();
  }

  async blockUser(userId: string): Promise<User | null> {
    const user = await this.userModel.findById(userId).exec();
    if (!user) {
      throw new NotFoundException('User not found.');
    }
    if (user.blocked) {
      throw new ConflictException('User is already blocked.');
    }
    user.blocked = true;
    return await user.save();
  }

  async unblockUser(userId: string): Promise<User | null> {
    const user = await this.userModel.findById(userId).exec();
    if (!user) {
      throw new NotFoundException('User not found.');
    }
    if (!user.blocked) {
      throw new ConflictException('User is already unblocked.');
    }
    user.blocked = false;
    return await user.save();
  }
}