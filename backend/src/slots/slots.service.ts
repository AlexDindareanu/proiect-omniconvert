import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Slot } from './slot.entity';
import { CreateSlotDto } from './dto/create-slot.dto';

@Injectable()
export class SlotsService {
  constructor(
    @InjectRepository(Slot)
    private readonly slotsRepository: Repository<Slot>,
  ) {}

  findAll(): Promise<Slot[]> {
    return this.slotsRepository.find();
  }

  async findOne(id: string): Promise<Slot> {
    const slot = await this.slotsRepository.findOneBy({ id });
    if (!slot) throw new NotFoundException(`Slot ${id} not found`);
    return slot;
  }

  create(dto: CreateSlotDto): Promise<Slot> {
    const slot = this.slotsRepository.create(dto);
    return this.slotsRepository.save(slot);
  }

  async remove(id: string): Promise<void> {
    const slot = await this.findOne(id);
    await this.slotsRepository.remove(slot);
  }
}
