import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RefuelingEntity } from './infrastructure/persistence/entities/refueling.entity';
import { VehicleEntity } from './infrastructure/persistence/entities/vehicle.entity';
import { RefuelingController } from './presentation/controllers/refueling.controller';
import { RegisterRefuelingUseCase } from './application/use-cases/register-refueling.use-case';
import { CalculateConsumptionListener } from './application/listeners/calculate-consumption.listener';
import { MaintenanceIntervalEntity } from './infrastructure/persistence/entities/maintenance-interval.entity';
import { MaintenanceHistoryEntity } from './infrastructure/persistence/entities/maintenance-history.entity';
import { RecordMaintenanceUseCase } from './application/use-cases/record-maintenance.use-case';
import { MaintenanceController } from './presentation/controllers/maintenance.controller';
import { VehicleController } from './presentation/controllers/vehicle.controller';
import { MaintenanceCheckJob } from './application/jobs/maintenance-check.job';
import { UpdateOdometerListener } from './application/listeners/update-odometer.listener';

@Module({
  imports: [TypeOrmModule.forFeature([RefuelingEntity, VehicleEntity, MaintenanceIntervalEntity, MaintenanceHistoryEntity])],
  controllers: [RefuelingController, MaintenanceController, VehicleController],
  providers: [RegisterRefuelingUseCase, CalculateConsumptionListener, RecordMaintenanceUseCase, MaintenanceCheckJob, UpdateOdometerListener],
})
export class RefuelingModule {}