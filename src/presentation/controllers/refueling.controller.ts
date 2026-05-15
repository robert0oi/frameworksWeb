import { Controller, Post, Body } from '@nestjs/common';
import { RegisterRefuelingUseCase } from '../../application/use-cases/register-refueling.use-case';
import { CreateRefuelingDto } from '../../application/dtos/create-refueling.dto';

@Controller('refuelings')
export class RefuelingController {
  constructor(private readonly registerRefuelingUseCase: RegisterRefuelingUseCase) {}

  @Post()
  async registerRefueling(@Body() createRefuelingDto: CreateRefuelingDto) {
    const result = await this.registerRefuelingUseCase.execute(createRefuelingDto);
    return result;
  }
}