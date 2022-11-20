import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type CatDocument = HydratedDocument<Cat>;

class Age {
  @Prop()
  name: string;
  @Prop()
  age: number;
}

@Schema()
export class Cat {
  @Prop()
  name: string;

  @Prop()
  age: [Age];

  @Prop()
  breed: string;
}

export const CatSchema = SchemaFactory.createForClass(Cat);
