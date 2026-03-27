import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookingsController } from './bookings.controller';
import { BookingsService } from './bookings.service';
import { Booking } from './booking.entity';
import { Slot } from '../slots/slot.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Booking, Slot])],
  controllers: [BookingsController],
  providers: [BookingsService],
})
export class BookingsModule {}
