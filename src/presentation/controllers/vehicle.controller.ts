import { Controller, Post, Get, Delete, Param, Body } from '@nestjs/common'; // Adicione Delete e Param
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { VehicleEntity } from '../../infrastructure/persistence/entities/vehicle.entity';
import { CreateVehicleDto } from '../../application/dtos/create-vehicle.dto';

@Controller('vehicles')
export class VehicleController {
  constructor(
    @InjectRepository(VehicleEntity)
    private readonly vehicleRepository: Repository<VehicleEntity>,
  ) {}

  @Post()
  async create(@Body() dto: CreateVehicleDto) {
    const vehicle = this.vehicleRepository.create(dto);
    const savedVehicle = await this.vehicleRepository.save(vehicle);
    return `Veículo Cadastrado Com Sucesso! Este é o seu UUID, copie-o: ${savedVehicle.id}`;
  }

  @Get()
  async findAll() {
    return await this.vehicleRepository.find();
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const result = await this.vehicleRepository.delete(id);

    if (result.affected === 0) {
      return `Erro: O veículo com o UUID ${id} não foi encontrado no sistema.`;
    }

    return `Veículo removido com sucesso! O UUID ${id} não existe mais no banco de dados.`;
  }
}