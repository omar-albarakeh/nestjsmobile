import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SolarInfo, SolarInfoDocument } from './SolarInfo';

@Injectable()
export class SolarInfoService {
  constructor(
    @InjectModel(SolarInfo.name) private solarInfoModel: Model<SolarInfoDocument>,
  ) {}

  async createSolarInfo(data: Partial<SolarInfo>): Promise<SolarInfo> {
    const newSolarInfo = new this.solarInfoModel(data);
    return newSolarInfo.save();
  }

  async findSolarInfoByUserId(userId: string): Promise<SolarInfo | null> {
    return this.solarInfoModel.findOne({ userId }).exec();
  }

  async updateSolarInfo(
    userId: string,
    updateData: Partial<SolarInfo>,
  ): Promise<SolarInfo> {
    return this.solarInfoModel
      .findOneAndUpdate({ userId }, updateData, { new: true, upsert: true })
      .exec();
  }
}
