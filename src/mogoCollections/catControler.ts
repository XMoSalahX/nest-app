import { Body, Controller, Post } from '@nestjs/common';
import { get } from 'http';
import { CatsService } from './cat.service';
import { CreateCatDto } from './dto/createcate.dto';

@Controller('cat')
export class CatController {
  constructor(private readonly catSevice: CatsService) {}

  @Post('/s')
  async create(@Body() input: CreateCatDto) {
    console.log(input);
    return this.catSevice.create(input);
  }
}
