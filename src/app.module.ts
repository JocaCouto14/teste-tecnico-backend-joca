import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Produto } from './entities/produto.entity';
import { Pedido } from './entities/pedido.entity';
import { ProdutosModule } from './produtos/produtos.module';
import { PedidosModule } from './pedidos/pedidos.module';
import { PedidoProduto } from './entities/pedido-produto.entity';
import { LoggingMiddleware } from './middleware/logging.middleware';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'admin',
      database: 'teste_tecnico_backend',
      entities: [Produto, Pedido, PedidoProduto],
      synchronize: true, // Apenas para desenvolvimento
    }),
    ProdutosModule,
    PedidosModule,
    // Outros módulos
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // Aplica o middleware a todas as rotas
    consumer.apply(LoggingMiddleware).forRoutes('*');
  }
}
