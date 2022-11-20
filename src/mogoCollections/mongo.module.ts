import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CatsService } from './cat.service';
import { CatController } from './catControler';
import { Cat, CatSchema } from './testMongo';

@Module({
  imports: [MongooseModule.forFeature([{ name: Cat.name, schema: CatSchema }])],
  controllers: [CatController],
  providers: [CatsService],
})
export class CatModule {}
