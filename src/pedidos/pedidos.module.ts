import { Module } from '@nestjs/common';
import { PedidosService } from './pedidos.service';
import { PedidosController } from './pedidos.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Pedido } from '../entities/pedido.entity';
import { Produto } from '../entities/produto.entity';
import { ProdutosModule } from '../produtos/produtos.module';
import { PedidoProduto } from '../entities/pedido-produto.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Pedido, PedidoProduto, Produto]),
    ProdutosModule,
  ],
  providers: [PedidosService],
  controllers: [PedidosController],
})
export class PedidosModule {}
