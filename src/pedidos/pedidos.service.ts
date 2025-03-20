import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Pedido } from '../entities/pedido.entity';
import { Produto } from '../entities/produto.entity';
import { ProdutosService } from '../produtos/produtos.service';
import { PedidoProduto } from '../entities/pedido-produto.entity';

@Injectable()
export class PedidosService {
    constructor(
        @InjectRepository(Pedido)
        private pedidosRepository: Repository<Pedido>,
        @InjectRepository(Produto)
        private produtosRepository: Repository<Produto>,
        @InjectRepository(PedidoProduto)
        private pedidoProdutoRepository: Repository<PedidoProduto>,
        private produtosService: ProdutosService,
    ) {}
    
    async criarPedido(pedidoData: {
        produtos: { id: number; quantidade: number }[];
        status: 'Pendente' | 'Concluído' | 'Cancelado';
    }): Promise<Pedido> {
        const { produtos, status } = pedidoData;

        let totalPedido = 0;
        const produtosDoPedido: PedidoProduto[] = [];

        // Verifica se os produtos existem e se há estoque suficiente
        for (const item of produtos) {
            const produto = await this.produtosRepository.findOneBy({ id: item.id });
            if (!produto) {
                throw new NotFoundException(`Produto com ID ${item.id} não encontrado`);
            }

            if (produto.quantidade_estoque < item.quantidade) {
                throw new NotFoundException(`Estoque insuficiente para o produto ${produto.nome}`);
            }

            // Cria uma instância de PedidoProduto
            const pedidoProduto = this.pedidoProdutoRepository.create({
                produto,
                quantidade: item.quantidade,
            });

            produtosDoPedido.push(pedidoProduto);

            // Adiciona ao total do pedido
            totalPedido += produto.preco * item.quantidade;
        }

        // Cria o pedido
        const novoPedido = this.pedidosRepository.create({
            produtos: produtosDoPedido,
            total_pedido: totalPedido,
            status,
        });

        // Salva o pedido
        const pedidoSalvo = await this.pedidosRepository.save(novoPedido);

        // Atualiza o estoque dos produtos se o pedido for concluído
        if (status === 'Concluído') {
            for (const item of produtos) {
                const produto = await this.produtosService.buscarProdutoPorId(item.id);
                produto.quantidade_estoque -= item.quantidade;
                await this.produtosRepository.save(produto);
            }
        }

        return pedidoSalvo;
    }

    // Método para atualizar o status do pedido
    async atualizarStatusPedido(
        id: number, 
        novoStatus: 'Pendente' | 'Concluído' | 'Cancelado'
    ): Promise<Pedido> {
        // Busca o pedido pelo ID
        const pedido = await this.pedidosRepository.findOne({
            where: { id },
            relations: ['produtos', 'produtos.produto'], // Carrega os produtos relacionados
        });

        if (!pedido) {
            throw new NotFoundException(`Pedido com ID ${id} não encontrado`);
        }

        // Verifica se o status está sendo alterado para "Concluído"
        if (novoStatus === 'Concluído' && pedido.status !== 'Concluído') {
            // Atualiza o estoque dos produtos
            for (const pedidoProduto of pedido.produtos) {
                const produto = pedidoProduto.produto;
                // Verifica se há estoque suficiente
                if (produto.quantidade_estoque < pedidoProduto.quantidade) {
                    throw new NotFoundException(`Estoque insuficiente para o produto ${produto.nome}`);
                }

                // Atualiza o estoque
                produto.quantidade_estoque -= pedidoProduto.quantidade;
                await this.produtosRepository.save(produto);
            }
        }

        // Verifica se o status está sendo alterado de "Concluído" para outro status
        if (pedido.status === 'Concluído' && novoStatus !== 'Concluído') {
            // Reverte o estoque dos produtos
            for (const pedidoProduto of pedido.produtos) {
                const produto = pedidoProduto.produto;
                produto.quantidade_estoque += pedidoProduto.quantidade;
                await this.produtosRepository.save(produto);
            }
        }

        // Atualiza o status do pedido
        pedido.status = novoStatus;
        return this.pedidosRepository.save(pedido);
    }

    async listarPedidos(): Promise<Pedido[]> {
        return this.pedidosRepository.find({ relations: ['produtos', 'produtos.produto'] });
    }
}