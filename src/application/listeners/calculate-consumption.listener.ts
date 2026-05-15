import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RefuelingEntity } from '../../infrastructure/persistence/entities/refueling.entity';

@Injectable()
export class CalculateConsumptionListener {
  // O Logger é o padrão profissional do NestJS para printar no terminal
  private readonly logger = new Logger(CalculateConsumptionListener.name);

  constructor(
    @InjectRepository(RefuelingEntity)
    private readonly refuelingRepository: Repository<RefuelingEntity>,
  ) {}

  @OnEvent('refueling.registered')
  async handleRefuelingRegisteredEvent(payload: { vehicleId: string; liters: number; odometer: number }) {
    this.logger.log(`Iniciando cálculo de consumo em background para o veículo: ${payload.vehicleId}`);

    // Regra de Negócio: Busca os dois últimos abastecimentos do veículo, do odômetro maior para o menor.
    const lastRefuelings = await this.refuelingRepository.find({
      where: { vehicleId: payload.vehicleId },
      order: { odometerAtRefueling: 'DESC' },
      take: 2, // Traz apenas os 2 últimos registros
    });

    // Se a moto é nova ou o usuário acabou de baixar o app, não dá pra calcular a média só com 1 registro.
    if (lastRefuelings.length < 2) {
      this.logger.warn('Primeiro abastecimento do veículo. Aguardando o próximo abastecimento para gerar a primeira média (km/l).');
      return;
    }

    // Separação dos dados para o cálculo matemático
    const currentRefueling = lastRefuelings[0];
    const previousRefueling = lastRefuelings[1];

    const distance = currentRefueling.odometerAtRefueling - previousRefueling.odometerAtRefueling;
    
    // Evita o erro matemático clássico de divisão por zero
    if (currentRefueling.litersAmount <= 0) return;

    const consumption = distance / currentRefueling.litersAmount;

    this.logger.log('--- RESULTADO DA ANÁLISE ---');
    this.logger.log(`Distância percorrida desde o último posto: ${distance} km`);
    this.logger.log(`Média de Consumo: ${consumption.toFixed(2)} km/l`);
    this.logger.log('----------------------------');

    // OBS para o relatório: Em uma versão v2 (escalável), salvaríamos o valor de 'consumption' 
    // em uma tabela separada de 'DashboardAnalytics' para relatórios rápidos.
  }
}