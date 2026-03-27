import { Body, Controller, Delete, Get, HttpCode, Param, Post } from '@nestjs/common';
import { SlotsService } from './slots.service';
import { CreateSlotDto } from './dto/create-slot.dto';
import { Slot } from './slot.entity';

@Controller('slots')
export class SlotsController {
  constructor(private readonly slotsService: SlotsService) {}

  @Get()
  findAll(): Promise<Slot[]> {
    return this.slotsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Slot> {
    return this.slotsService.findOne(id);
  }

  @Post()
  create(@Body() dto: CreateSlotDto): Promise<Slot> {
    return this.slotsService.create(dto);
  }

  @Delete(':id')
  @HttpCode(204)
  remove(@Param('id') id: string): Promise<void> {
    return this.slotsService.remove(id);
  }
}
