import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, RelationId } from 'typeorm';
import { Slot } from '../slots/slot.entity';

@Entity()
export class Booking {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar' })
  studentName: string;

  @Column({ type: 'varchar' })
  studentEmail: string;

  @ManyToOne(() => Slot, { eager: true, cascade: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'slotId' })
  slot: Slot;

  @RelationId((booking: Booking) => booking.slot)
  slotId: string;
}
