import { Controller, Get, Post, Body, Patch, Param } from '@nestjs/common';
import { PedidosService } from './pedidos.service';
import { Pedido } from '../entities/pedido.entity';

@Controller('pedidos')
export class PedidosController {
    constructor(private readonly pedidosService: PedidosService) {}

    @Get()
    listarPedidos(): Promise<Pedido[]> {
        return this.pedidosService.listarPedidos();
    }

    @Post()
    criarPedido(
        @Body() pedidoData: { 
            produtos: { id: number; quantidade: number }[]; 
            status: 'Pendente' | 'Concluído' | 'Cancelado' 
        }
    ): Promise<Pedido> {
        return this.pedidosService.criarPedido(pedidoData);
    }

    @Patch(':id/status')
    atualizarStatusPedido(
        @Param('id') id: string,
        @Body('status') status: 'Pendente' | 'Concluído' | 'Cancelado',
    ): Promise<Pedido> {
        return this.pedidosService.atualizarStatusPedido(+id, status);
    }
}