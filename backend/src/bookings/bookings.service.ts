import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { connect, ChannelModel, Channel } from 'amqplib';
import { Booking } from './booking.entity';
import { CreateBookingDto } from './dto/create-booking.dto';
import { Slot } from '../slots/slot.entity';

const AMQP_URL = 'amqp://tutoring:tutoring@localhost:5672';
const QUEUE = 'booking_created';

@Injectable()
export class BookingsService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(BookingsService.name);
  private connection: ChannelModel;
  private channel: Channel;

  constructor(
    @InjectRepository(Booking)
    private readonly bookingsRepository: Repository<Booking>,
    @InjectRepository(Slot)
    private readonly slotsRepository: Repository<Slot>,
  ) {}

  async onModuleInit() {
    this.connection = await connect(AMQP_URL);
    this.channel = await this.connection.createChannel();
    await this.channel.assertQueue(QUEUE, { durable: true });
  }

  async onModuleDestroy() {
    await this.channel?.close();
    await this.connection?.close();
  }

  findAll(): Promise<Booking[]> {
    return this.bookingsRepository.find();
  }

  async findOne(id: string): Promise<Booking> {
    const booking = await this.bookingsRepository.findOneBy({ id });
    if (!booking) throw new NotFoundException(`Booking ${id} not found`);
    return booking;
  }

  async create(dto: CreateBookingDto): Promise<Booking | null> {
    const slot = await this.slotsRepository.findOneBy({ id: dto.slotId });
    if (!slot) throw new NotFoundException(`Slot ${dto.slotId} not found`);
    if (slot.currentParticipants >= slot.maxParticipants) {
      throw new BadRequestException('Slot is fully booked');
    }

    const booking = new Booking();
    booking.studentName = dto.studentName;
    booking.studentEmail = dto.studentEmail;
    booking.slot = { id: slot.id } as Slot;
    await this.bookingsRepository.save(booking);

    await this.slotsRepository.increment({ id: slot.id }, 'currentParticipants', 1);

    const saved = await this.bookingsRepository.findOneBy({ id: booking.id });
    this.channel.sendToQueue(
      QUEUE,
      Buffer.from(JSON.stringify(saved)),
      { persistent: true },
    );
    this.logger.log(`Published booking_created for booking ${saved?.id}`);

    return saved;
  }

  async remove(id: string): Promise<void> {
    const booking = await this.findOne(id);
    await this.slotsRepository.decrement(
      { id: booking.slot.id },
      'currentParticipants',
      1,
    );
    await this.bookingsRepository.remove(booking);
  }
}
