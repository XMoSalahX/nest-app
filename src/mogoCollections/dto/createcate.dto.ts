import { IsArray, IsString } from 'class-validator';

class Age {
  @IsString()
  name: string;
  @IsString()
  age: number;
}

export class CreateCatDto {
  @IsString()
  name: string;

  @IsArray()
  age: Age;

  @IsString()
  breed: string;
}
