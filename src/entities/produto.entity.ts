import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { PedidoProduto } from './pedido-produto.entity';

@Entity()
export class Produto {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nome: string;

  @Column()
  categoria: string;

  @Column()
  descricao: string;

  @Column('decimal', { precision: 10, scale: 2 })
  preco: number;

  @Column()
  quantidade_estoque: number;

  @OneToMany(() => PedidoProduto, (pedidoProduto) => pedidoProduto.produto)
  pedidos: PedidoProduto[]; // Produto pode estar em vários pedidos (PedidoProduto)
}