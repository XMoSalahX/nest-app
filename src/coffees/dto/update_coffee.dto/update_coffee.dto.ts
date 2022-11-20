import { PartialType } from '@nestjs/swagger';
import { CreateCoffeeDto } from '../create_coffee.dto/create_coffee.dto';

export class UpdateCoffeeDto extends PartialType(CreateCoffeeDto) {}
