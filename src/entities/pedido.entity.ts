import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { PedidoProduto } from './pedido-produto.entity';

@Entity()
export class Pedido {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToMany(() => PedidoProduto, (pedidoProduto) => pedidoProduto.pedido, { cascade: true })
  produtos: PedidoProduto[]; // Lista de PedidoProduto / Pedido pode ter vários produtos (PedidoProduto)

  @Column('decimal', { precision: 10, scale: 2 })
  total_pedido : number;

  @Column()
  status: 'Pendente' | 'Concluído' | 'Cancelado';
}