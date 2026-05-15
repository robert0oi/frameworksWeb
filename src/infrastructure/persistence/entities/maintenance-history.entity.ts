import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity('maintenance_history')
export class MaintenanceHistoryEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  vehicleId: string;

  @Column()
  serviceName: string; // Nome do componente, ex: líquido de arrefecimento

  @Column('float')
  odometerAtService: number; // O km que estava no painel na hora da troca

  @CreateDateColumn()
  performedAt: Date; // Data do registro
}