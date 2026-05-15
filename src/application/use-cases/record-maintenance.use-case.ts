import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MaintenanceHistoryEntity } from '../../infrastructure/persistence/entities/maintenance-history.entity';
import { MaintenanceIntervalEntity } from '../../infrastructure/persistence/entities/maintenance-interval.entity';

@Injectable()
export class RecordMaintenanceUseCase {
  constructor(
    @InjectRepository(MaintenanceHistoryEntity)
    private readonly historyRepository: Repository<MaintenanceHistoryEntity>,
    @InjectRepository(MaintenanceIntervalEntity)
    private readonly intervalRepository: Repository<MaintenanceIntervalEntity>,
  ) {}

  async execute(data: { vehicleId: string; serviceName: string; currentOdometer: number }) {
    // Primeiro -  Valida se existe uma regra de referência para este serviço
    const intervalRule = await this.intervalRepository.findOne({
      where: { vehicleId: data.vehicleId, serviceName: data.serviceName }
    });

    if (!intervalRule) {
      throw new BadRequestException(
        `O serviço "${data.serviceName}" não possui um intervalo de referência cadastrado. Por favor, configure o intervalo primeiro.`
      );
    }

    // Segundo - Registra no Histórico
    const history = this.historyRepository.create({
      vehicleId: data.vehicleId,
      serviceName: data.serviceName,
      odometerAtService: data.currentOdometer
    });
    await this.historyRepository.save(history);

    // Terceiro - Atualiza a regra de referência (O "pulo do gato" para o Cron Job)
    intervalRule.lastPerformedAtOdometer = data.currentOdometer;
    await this.intervalRepository.save(intervalRule);

    return {
      message: 'Manutenção registrada e próximo ciclo recalculado com sucesso!',
      nextServiceAt: data.currentOdometer + intervalRule.intervalKm
    };
  }
}