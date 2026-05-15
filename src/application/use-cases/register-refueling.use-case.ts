import { Injectable, BadRequestException } from '@nestjs/common'; // Adicione BadRequestException
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { RefuelingEntity } from '../../infrastructure/persistence/entities/refueling.entity';
import { VehicleEntity } from '../../infrastructure/persistence/entities/vehicle.entity'; // Importe a entidade do veículo
import { CreateRefuelingDto } from '../dtos/create-refueling.dto';

@Injectable()
export class RegisterRefuelingUseCase {
  constructor(
    @InjectRepository(RefuelingEntity)
    private readonly refuelingRepository: Repository<RefuelingEntity>,
    @InjectRepository(VehicleEntity)
    private readonly vehicleRepository: Repository<VehicleEntity>, // Injeção do repositório de veículos
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async execute(data: CreateRefuelingDto) {
    // busca os dados do veículo para saber a capacidade do tanque
    const vehicle = await this.vehicleRepository.findOne({ where: { id: data.vehicleId } });

    if (!vehicle) {
      throw new BadRequestException('Veículo não encontrado.');
    }

    // abastecimento não pode ser maior que o tanque
    if (data.litersAmount > vehicle.fuelTankCapacity) {
      throw new BadRequestException(
        `Capacidade excedida! O tanque da ${vehicle.modelName} suporta no máximo ${vehicle.fuelTankCapacity} litros, e você tentou registrar ${data.litersAmount}L.`
      );
    }

    // 3Se passou na regra, persiste a informação
    const refueling = this.refuelingRepository.create(data);
    const savedRefueling = await this.refuelingRepository.save(refueling);

    this.eventEmitter.emit('refueling.registered', {
      vehicleId: savedRefueling.vehicleId,
      liters: savedRefueling.litersAmount,
      odometer: savedRefueling.odometerAtRefueling,
    });

    return savedRefueling;
  }
}