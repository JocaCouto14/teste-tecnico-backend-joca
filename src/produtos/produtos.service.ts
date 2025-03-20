import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Produto } from '../entities/produto.entity';

@Injectable()
export class ProdutosService {
    constructor(
        @InjectRepository(Produto)
        private produtosRepository: Repository<Produto>,
    ) {}
    
    async listarProdutos(): Promise<Produto[]> {
        return this.produtosRepository.find();
    }
    
    async buscarProdutoPorId(id: number): Promise<Produto> {
        const produto = await this.produtosRepository.findOneBy({ id });
        if(!produto) {
            throw new NotFoundException(`Produto com ID ${id} não encontrado`);
        }
        return produto;
    }

    async criarProduto(produtoData: Partial<Produto>): Promise<Produto> {
        const produto = this.produtosRepository.create(produtoData);
        return this.produtosRepository.save(produto);
    }
    
    async atualizarProduto(id: number, produtoData: Partial<Produto>): Promise<Produto> {
        const produto = await this.produtosRepository.findOneBy({ id });
        if (!produto) {
            throw new Error('Produto não encontrado');
        }
        Object.assign(produto, produtoData);
        return this.produtosRepository.save(produto);
    }
    
    async deletarProduto(id: number): Promise<void> {
        await this.produtosRepository.delete(id);
    }
    
}
