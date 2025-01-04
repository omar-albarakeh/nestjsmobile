import { Controller, Post, Get, Body, Param, Patch } from '@nestjs/common';
import { SolarInfoService } from './SolarService';
import { SolarInfo } from './SolarInfo';

@Controller('solar-info')
export class SolarInfoController {
  constructor(private readonly solarInfoService: SolarInfoService) {}

  @Post()
  async createSolarInfo(@Body() solarInfoData: Partial<SolarInfo>): Promise<SolarInfo> {
    return this.solarInfoService.createSolarInfo(solarInfoData);
  }

  @Get(':userId')
  async getSolarInfo(@Param('userId') userId: string): Promise<SolarInfo | null> {
    return this.solarInfoService.findSolarInfoByUserId(userId);
  }

  @Patch(':userId')
  async updateSolarInfo(
    @Param('userId') userId: string,
    @Body() updateData: Partial<SolarInfo>,
  ): Promise<SolarInfo> {
    return this.solarInfoService.updateSolarInfo(userId, updateData);
  }
}
