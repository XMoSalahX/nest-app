import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm/dist';
import { Coffee } from 'src/coffees/entities/coffee.entity';
import { EventEntity } from 'src/events/entities/event.entity/event.entity';
import { CoffeesController } from './coffees.controller';
import { CoffeesService } from './coffees.service';
import { FlavorEntity } from './entities/flavor.entity/flavor.entity';
import { CoffeeMiddleware } from '../middleware/hellocoffie';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forFeature([Coffee, FlavorEntity, EventEntity]),
    ConfigModule,
  ],
  controllers: [CoffeesController],
  providers: [CoffeesService],
  exports: [CoffeesService],
})
export class CoffeesModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer
      .apply(CoffeeMiddleware)
      .forRoutes({ path: 'coffees', method: RequestMethod.POST });
  }
}
