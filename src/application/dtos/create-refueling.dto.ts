import { IsUUID, IsNumber, IsPositive, Min } from 'class-validator';

export class CreateRefuelingDto {
  @IsUUID('4', { message: 'O ID do veículo deve ser um UUID válido.' })
  vehicleId: string;

  @IsNumber()
  @IsPositive({ message: 'A quantidade de litros deve ser maior que zero.' })
  litersAmount: number;

  @IsNumber()
  @Min(0, { message: 'O odômetro não pode ser negativo.' })
  odometerAtRefueling: number;
}