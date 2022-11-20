import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { PaginationsQueryDto } from 'src/common/dto/paginations-query.dto/paginations-query.dto';
import { CoffeesService } from './coffees.service';
import { CreateCoffeeDto } from './dto/create_coffee.dto/create_coffee.dto';
import { UpdateCoffeeDto } from './dto/update_coffee.dto/update_coffee.dto';

@Controller('coffees')
export class CoffeesController {
  constructor(private readonly coffeeService: CoffeesService) {}

  @Get('flaver')
  findAllCoffees(@Query() paginationQuery: PaginationsQueryDto) {
    return this.coffeeService.findAll(paginationQuery);
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.coffeeService.findOne(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() CreateCoffeeDto: CreateCoffeeDto) {
    const coffee = this.coffeeService.create(CreateCoffeeDto);
    return coffee;
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() UpdateCoffeeDto: UpdateCoffeeDto) {
    return this.coffeeService.update(id, UpdateCoffeeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.coffeeService.remove(id);
    // return `This actions Remove #${id} coffe`;
  }
}
