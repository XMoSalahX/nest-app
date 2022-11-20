import { IsOptional, IsPositive } from 'class-validator';

export class PaginationsQueryDto {
  @IsOptional()
  @IsPositive()
  limit: number;

  @IsOptional()
  @IsPositive()
  offset: number;
}
