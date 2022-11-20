import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Response } from 'express';

@Injectable()
export class CoffeeMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction): void {
    console.log('hekki');
    console.log(req.body);
    res.status(200).send('Done');
    // next();
  }
}
