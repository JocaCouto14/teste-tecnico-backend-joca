import { Test, TestingModule } from '@nestjs/testing';
import { PedidosService } from './pedidos.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Pedido } from '../entities/pedido.entity';
import { Produto } from '../entities/produto.entity';
import { PedidoProduto } from '../entities/pedido-produto.entity';
import { ProdutosService } from '../produtos/produtos.service';

describe('PedidosService', () => {
  let service: PedidosService;
  let pedidoRepository: Repository<Pedido>;
  let produtoRepository: Repository<Produto>;
  let pedidoProdutoRepository: Repository<PedidoProduto>;
  let produtosService: ProdutosService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PedidosService,
        ProdutosService,
        {
          provide: getRepositoryToken(Pedido),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(Produto),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(PedidoProduto),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<PedidosService>(PedidosService);
    pedidoRepository = module.get<Repository<Pedido>>(getRepositoryToken(Pedido));
    produtoRepository = module.get<Repository<Produto>>(getRepositoryToken(Produto));
    pedidoProdutoRepository = module.get<Repository<PedidoProduto>>(getRepositoryToken(PedidoProduto));
    produtosService = module.get<ProdutosService>(ProdutosService);
  });

  /*it('deve criar um pedido com status "Pendente" sem alterar o estoque', async () => {
    const produto = new Produto();
    produto.id = 1;
    produto.nome = 'Bola';
    produto.preco = 19.99;
    produto.quantidade_estoque = 7; // Estoque inicial

    const pedidoProduto = new PedidoProduto();
    pedidoProduto.produto = produto;
    pedidoProduto.quantidade = 2; // Quantidade solicitada no pedido

    const pedidoData = {
      produtos: [{ id: 1, quantidade: 2 }],
      status: 'Pendente' as 'Pendente' | 'Concluído' | 'Cancelado',
    };

    // Mock do repositório de Produto
    jest.spyOn(produtoRepository, 'findOneBy').mockResolvedValue(produto);
    jest.spyOn(produtoRepository, 'save').mockResolvedValue(produto);

    // Mock do repositório de PedidoProduto
    jest.spyOn(pedidoProdutoRepository, 'create').mockImplementation((entity) => {
      return entity as PedidoProduto;
    });

    // Mock do repositório de Pedido
    const pedidoSalvo = new Pedido();
    pedidoSalvo.id = 1;
    pedidoSalvo.produtos = [pedidoProduto];
    pedidoSalvo.total_pedido = 39.98; // 2 * 19.99
    pedidoSalvo.status = 'Pendente';

    jest.spyOn(pedidoRepository, 'save').mockResolvedValue(pedidoSalvo);

    const resultado = await service.criarPedido(pedidoData);

    // Verificações
    expect(resultado).toEqual(pedidoSalvo); // O pedido foi criado corretamente
    expect(resultado.status).toEqual('Pendente'); // O status do pedido é "Pendente"
    expect(produto.quantidade_estoque).toEqual(7); // O estoque não foi alterado
    expect(produtoRepository.findOneBy).toHaveBeenCalledWith({ id: 1 }); // O produto foi buscado corretamente
    expect(pedidoProdutoRepository.create).toHaveBeenCalledWith({
      produto,
      quantidade: 2,
    }); // O PedidoProduto foi criado corretamente
    expect(pedidoRepository.save).toHaveBeenCalled(); // O pedido foi salvo corretamente
    expect(produtoRepository.save).not.toHaveBeenCalled(); // O estoque não foi alterado
  });*/

  it('deve atualizar o status do pedido para "Concluído" e diminuir o estoque dos produtos', async () => {
    const produto = new Produto();
    produto.id = 1;
    produto.nome = 'Bola';
    produto.preco = 19.99;
    produto.quantidade_estoque = 7; // Estoque inicial

    const pedidoProduto = new PedidoProduto();
    pedidoProduto.produto = produto;
    pedidoProduto.quantidade = 2; // Quantidade solicitada no pedido

    const pedido = new Pedido();
    pedido.id = 1;
    pedido.produtos = [pedidoProduto];
    pedido.total_pedido = 39.98;
    pedido.status = 'Pendente'; // Status inicial

    // Mock do repositório de Pedido
    jest.spyOn(pedidoRepository, 'findOne').mockResolvedValue(pedido);
    jest.spyOn(pedidoRepository, 'save').mockResolvedValue(pedido);

    // Mock do repositório de Produto
    jest.spyOn(produtoRepository, 'findOneBy').mockResolvedValue(produto);
    jest.spyOn(produtoRepository, 'save').mockResolvedValue(produto);

    // Atualiza o status para "Concluído"
    const resultado = await service.atualizarStatusPedido(1, 'Concluído');

    // Verificações
    expect(resultado.status).toEqual('Concluído'); // Status atualizado
    expect(produto.quantidade_estoque).toEqual(5); // Estoque diminuído (7 - 2)
    expect(pedidoRepository.findOne).toHaveBeenCalledWith({
      where: { id: 1 },
      relations: ['produtos', 'produtos.produto'],
    });
    expect(produtoRepository.save).toHaveBeenCalledWith(produto);
    expect(pedidoRepository.save).toHaveBeenCalledWith(pedido);
  });
});