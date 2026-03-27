import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Slot {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'date' })
  date: string;

  @Column({ type: 'time' })
  startTime: string;

  @Column({ type: 'time' })
  endTime: string;

  @Column({ type: 'int', default: 4 })
  maxParticipants: number;

  @Column({ type: 'int', default: 0 })
  currentParticipants: number;
}
