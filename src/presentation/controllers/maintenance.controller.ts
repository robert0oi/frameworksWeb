import { Controller, Post, Body } from '@nestjs/common';
import { RecordMaintenanceUseCase } from '../../application/use-cases/record-maintenance.use-case';
import { CreateMaintenanceIntervalDto } from '../../application/dtos/create-maintenance-interval.dto';
import { RecordMaintenanceDto } from '../../application/dtos/record-maintenance.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MaintenanceIntervalEntity } from '../../infrastructure/persistence/entities/maintenance-interval.entity';

@Controller('maintenance')
export class MaintenanceController {
  constructor(
    private readonly recordMaintenanceUseCase: RecordMaintenanceUseCase,
    @InjectRepository(MaintenanceIntervalEntity)
    private readonly intervalRepository: Repository<MaintenanceIntervalEntity>,
  ) {}

  // Primeira Rota - Menu de Referência
  @Post('intervals')
  async createInterval(@Body() dto: CreateMaintenanceIntervalDto) {
    const interval = this.intervalRepository.create(dto);
    const savedInterval = await this.intervalRepository.save(interval);
    return `Regra cadastrada: A manutenção de "${savedInterval.serviceName}" deverá ser feita a cada ${savedInterval.intervalKm} km.
    `;
  }

  // Segunda Rota - Histórico
  @Post('records')
  async recordMaintenance(@Body() dto: RecordMaintenanceDto) {
    const result = await this.recordMaintenanceUseCase.execute(dto);
    return `Histórico atualizado! ${result.message} -> Próxima troca agendada para o km: ${result.nextServiceAt}.
    `;
  }
}