import { Entity, ManyToOne, PrimaryGeneratedColumn, Column } from 'typeorm';
import { Pedido } from './pedido.entity';
import { Produto } from './produto.entity';

@Entity()
export class PedidoProduto {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Pedido, (pedido) => pedido.produtos, { onDelete: 'CASCADE' })
    pedido: Pedido;

    @ManyToOne(() => Produto, (produto) => produto.pedidos, { onDelete: 'CASCADE' })
    produto: Produto;

    @Column()
    quantidade: number;
}