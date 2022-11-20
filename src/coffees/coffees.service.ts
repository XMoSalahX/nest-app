import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm/dist/common';
import { PaginationsQueryDto } from 'src/common/dto/paginations-query.dto/paginations-query.dto';
import { Coffee } from 'src/coffees/entities/coffee.entity';
import { DataSource, Repository } from 'typeorm';
import { CreateCoffeeDto } from './dto/create_coffee.dto/create_coffee.dto';
import { UpdateCoffeeDto } from './dto/update_coffee.dto/update_coffee.dto';
import { FlavorEntity } from './entities/flavor.entity/flavor.entity';
import { EventEntity } from 'src/events/entities/event.entity/event.entity';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CoffeesService {
  [x: string]: any;
  constructor(
    @InjectRepository(Coffee)
    private readonly coffeeRepository: Repository<Coffee>,
    @InjectRepository(FlavorEntity)
    private readonly flavorRepository: Repository<FlavorEntity>,
    private readonly connection: DataSource,
    private readonly configService: ConfigService,
  ) {
    const databaseHost = this.configService.get<string>('DATABASE_HOST');
    console.log(databaseHost);
  }

  async findAll(paginationQuery: PaginationsQueryDto) {
    const { limit, offset } = paginationQuery;
    return this.coffeeRepository.find({
      relations: ['flavors'],
      skip: offset,
      take: limit,
    });
  }

  async findOne(id: number) {
    const coffee = await this.coffeeRepository.findOne({
      where: { id },
      relations: ['flavors'],
    });

    if (!coffee) {
      throw new HttpException(`Coffee #${id} not found,`, HttpStatus.NOT_FOUND);
    }
    return coffee;
  }

  async create(createCoffeeDto: CreateCoffeeDto) {
    const flavors = await Promise.all(
      createCoffeeDto.flavors.map((name) => this.preloadFlavorByName(name)),
    );

    const coffee = this.coffeeRepository.create({
      ...createCoffeeDto,
      flavors,
    });
    return this.coffeeRepository.save(coffee);
  }

  async update(id: number, updateCoffeeDto: UpdateCoffeeDto) {
    const flavors =
      updateCoffeeDto.flavors &&
      (await Promise.all(
        updateCoffeeDto.flavors.map((name) => this.preloadFlavorByName(name)),
      ));

    const coffee = await this.coffeeRepository.preload({
      id: +id,
      ...updateCoffeeDto,
      flavors,
    });

    if (!coffee) {
      throw new NotFoundException(`Coffee #${id} not found,`);
    }
    return this.coffeeRepository.save(coffee);
  }

  async remove(id: number) {
    const coffee = await this.findOne(id);
    return this.coffeeRepository.remove(coffee);
  }

  async recommendCoffee(coffee: Coffee) {
    const queryRunner = this.connection.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      coffee.recommendations++;

      const recommentEvent = new EventEntity();
      recommentEvent.name = 'recommend_coffee';
      recommentEvent.type = 'coffee';
      recommentEvent.payload = { coffeeId: coffee.id };

      await queryRunner.manager.save(coffee);
      await queryRunner.manager.save(recommentEvent);

      await queryRunner.commitTransaction();
    } catch (e) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }

  private async preloadFlavorByName(name: string): Promise<FlavorEntity> {
    const existingFlavor = await this.flavorRepository.findOne({
      where: { name },
    });

    if (existingFlavor) {
      return existingFlavor;
    }
    return this.flavorRepository.create({ name });
  }
}
