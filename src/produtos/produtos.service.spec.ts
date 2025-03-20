import { Test, TestingModule } from '@nestjs/testing';
import { ProdutosService } from './produtos.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Produto } from '../entities/produto.entity';

describe('ProdutosService', () => {
  let service: ProdutosService;
  let produtoRepository: Repository<Produto>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProdutosService,
        {
          provide: getRepositoryToken(Produto),
          useValue: {
            find: jest.fn(),
            findOneBy: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<ProdutosService>(ProdutosService);
    produtoRepository = module.get<Repository<Produto>>(getRepositoryToken(Produto));
  });

  it('deve criar um produto', async () => {
    const produtoData = {
      nome: 'Bola de Futebol',
      preco: 99.99,
      quantidade_estoque: 10,
    };

    const produtoSalvo = new Produto();
    produtoSalvo.id = 1;
    produtoSalvo.nome = produtoData.nome;
    produtoSalvo.preco = produtoData.preco;
    produtoSalvo.quantidade_estoque = produtoData.quantidade_estoque;

    // Mock do repositório de Produto
    jest.spyOn(produtoRepository, 'create').mockReturnValue(produtoSalvo);
    jest.spyOn(produtoRepository, 'save').mockResolvedValue(produtoSalvo);

    const resultado = await service.criarProduto(produtoData);

    // Verificações
    expect(resultado).toEqual(produtoSalvo); // O produto foi criado corretamente
    expect(produtoRepository.create).toHaveBeenCalledWith(produtoData); // O produto foi criado corretamente
    expect(produtoRepository.save).toHaveBeenCalledWith(produtoSalvo); // O produto foi salvo corretamente
  });

  it('deve editar um produto', async () => {
    const produtoExistente = new Produto();
    produtoExistente.id = 1;
    produtoExistente.nome = 'Bola de Futebol';
    produtoExistente.preco = 99.99;
    produtoExistente.quantidade_estoque = 10;

    const produtoAtualizado = new Produto();
    produtoAtualizado.id = 1;
    produtoAtualizado.nome = 'Bola de Basquete';
    produtoAtualizado.preco = 129.99;
    produtoAtualizado.quantidade_estoque = 15;

    // Mock do repositório de Produto
    jest.spyOn(produtoRepository, 'findOneBy').mockResolvedValue(produtoExistente);
    jest.spyOn(produtoRepository, 'save').mockResolvedValue(produtoAtualizado);

    const resultado = await service.atualizarProduto(1, {
      nome: 'Bola de Basquete',
      preco: 129.99,
      quantidade_estoque: 15,
    });

    // Verificações
    expect(resultado).toEqual(produtoAtualizado); // O produto foi atualizado corretamente
    expect(produtoRepository.findOneBy).toHaveBeenCalledWith({ id: 1 }); // O produto foi buscado corretamente
    expect(produtoRepository.save).toHaveBeenCalledWith(produtoAtualizado); // O produto foi salvo corretamente
  });

  it('deve deletar um produto', async () => {
    const produtoExistente = new Produto();
    produtoExistente.id = 1;
    produtoExistente.nome = 'Bola de Futebol';
    produtoExistente.preco = 99.99;
    produtoExistente.quantidade_estoque = 10;

    // Mock do repositório de Produto
    jest.spyOn(produtoRepository, 'findOneBy').mockResolvedValue(produtoExistente);
    jest.spyOn(produtoRepository, 'delete').mockResolvedValue({ affected: 1 } as any);

    await service.deletarProduto(1);

    // Verificações
    expect(produtoRepository.delete).toHaveBeenCalledWith(1); // O produto foi deletado corretamente
  });
});