import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { ProdutosService } from './produtos.service';
import { Produto } from '../entities/produto.entity';

@Controller('produtos')
export class ProdutosController {
    constructor(private readonly produtosService: ProdutosService) {}

    @Get()
    listarProdutos(): Promise<Produto[]> {
        return this.produtosService.listarProdutos();
    }

    @Get(':id')
    buscarProdutoPorId(@Param('id') id: string): Promise<Produto> {
        return this.produtosService.buscarProdutoPorId(+id);
    }

    @Post()
    criarProduto(@Body() produtoData: Partial<Produto>): Promise<Produto> {
        return this.produtosService.criarProduto(produtoData);
    }

    @Put(':id')
    atualizarProduto(@Param('id') id: string, @Body() produtoData: Partial<Produto>): Promise<Produto> {
        return this.produtosService.atualizarProduto(+id, produtoData);
    }

    @Delete(':id')
    deletarProduto(@Param('id') id: string): Promise<void> {
        return this.produtosService.deletarProduto(+id);
    }
}