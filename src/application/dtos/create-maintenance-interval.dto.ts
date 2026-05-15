import { IsUUID, IsString, IsNumber, IsPositive } from 'class-validator';

export class CreateMaintenanceIntervalDto {
  @IsUUID('4')
  vehicleId: string;

  @IsString()
  serviceName: string; // Exemplo "Troca de Óleo" ou "Kit Relação"

  @IsNumber()
  @IsPositive()
  intervalKm: number; // Ex: 3000 ou 15000
}