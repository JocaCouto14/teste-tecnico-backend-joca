import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggingMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    // Log da requisição
    console.log('Requisição recebida:');
    console.log(`Método: ${req.method}`);
    console.log(`URL: ${req.originalUrl}`);
    if (req.body && Object.keys(req.body).length > 0) {
      console.log('Corpo da requisição:', req.body);
    }

    // Chama o próximo middleware ou o controlador
    next();
  }
}