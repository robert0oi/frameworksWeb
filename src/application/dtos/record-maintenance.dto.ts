import { IsUUID, IsString, IsNumber, Min } from 'class-validator';

export class RecordMaintenanceDto {
  @IsUUID('4')
  vehicleId: string;

  @IsString()
  serviceName: string;

  @IsNumber()
  @Min(0)
  currentOdometer: number; // Odômetro atual
}