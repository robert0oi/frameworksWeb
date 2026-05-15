import { IsString, IsNumber, IsPositive } from 'class-validator';

export class CreateVehicleDto {
  @IsString()
  modelName: string; // Modelo do veículo

  @IsString()
  licensePlate: string; // Placa

  @IsNumber()
  @IsPositive()
  currentOdometer: number; // Odometro atual

  @IsNumber()
  @IsPositive()
  fuelTankCapacity: number; // Capacidade do tanque
}