import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { VehicleEntity } from '../../infrastructure/persistence/entities/vehicle.entity';
import { MaintenanceIntervalEntity } from '../../infrastructure/persistence/entities/maintenance-interval.entity';

@Injectable()
export class MaintenanceCheckJob {
  private readonly logger = new Logger(MaintenanceCheckJob.name);

  constructor(
    @InjectRepository(VehicleEntity)
    private readonly vehicleRepository: Repository<VehicleEntity>,
    @InjectRepository(MaintenanceIntervalEntity)
    private readonly intervalRepository: Repository<MaintenanceIntervalEntity>,
  ) {}

  @Cron(CronExpression.EVERY_10_SECONDS) // EVERY_DAY_AT_MIDNIGHT - modificar
  async handleCron() {
    const vehicles = await this.vehicleRepository.find();

    for (const vehicle of vehicles) {
      const intervals = await this.intervalRepository.find({
        where: { vehicleId: vehicle.id }
      });

      for (const interval of intervals) {
        const nextServiceAt = interval.lastPerformedAtOdometer + interval.intervalKm;
        const remainingKm = nextServiceAt - vehicle.currentOdometer;
        
        if (remainingKm <= 0) {
          this.logger.error(
            `[ALERTA DE MANUTENÇÃO] Veículo ${vehicle.modelName} (${vehicle.licensePlate}): A "${interval.serviceName}" está VENCIDA! Passou ${Math.abs(remainingKm)} km do limite.`
          );
        } else if (remainingKm <= 300) {
          this.logger.warn(
            `[AVISO PRÉVIO] Veículo ${vehicle.modelName}: Prepare-se para a "${interval.serviceName}" em ${remainingKm} km.`
          );
        }
      }
    }
  }
}