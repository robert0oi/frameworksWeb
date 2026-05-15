import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('vehicles')
export class VehicleEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  modelName: string;

  @Column()
  licensePlate: string;

  @Column('float', { default: 0 })
  currentOdometer: number;

  @Column('float')
  fuelTankCapacity: number;
}