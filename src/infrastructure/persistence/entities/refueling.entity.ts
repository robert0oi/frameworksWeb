import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('refuelings')
export class RefuelingEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  vehicleId: string;

  @Column('float')
  litersAmount: number;

  @Column('float')
  odometerAtRefueling: number;
}