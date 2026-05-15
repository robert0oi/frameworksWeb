import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { VehicleEntity } from '../../infrastructure/persistence/entities/vehicle.entity';

@Injectable()
export class UpdateOdometerListener {
  constructor(
    @InjectRepository(VehicleEntity)
    private readonly vehicleRepository: Repository<VehicleEntity>,
  ) {}

  @OnEvent('refueling.registered')
  async handle(payload: { vehicleId: string; odometer: number }) {
    const vehicle = await this.vehicleRepository.findOne({ where: { id: payload.vehicleId } });
    
    // Só atualiza se o odômetro do abastecimento for maior que o do painel atual
    if (vehicle && payload.odometer > vehicle.currentOdometer) {
      vehicle.currentOdometer = payload.odometer;
      await this.vehicleRepository.save(vehicle);
    }
  }
}