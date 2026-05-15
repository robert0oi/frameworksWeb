import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('maintenance_intervals')
export class MaintenanceIntervalEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // ID do veículo
  @Column()
  vehicleId: string; 

  // "Troca de Óleo", "Tensão da Corrente", etc
  @Column()
  serviceName: string; 

  // Quilometragem entre as trocas/reparos, ex 2500km
  @Column('float')
  intervalKm: number; 

  // quilometragem do painel quando o serviço foi feito pela última vez
  @Column('float', { default: 0 })
  lastPerformedAtOdometer: number; 
}