export type Categoria = {
  id: string;
  nome: string;
  ordem: number;
};

export type Produto = {
  id: string;
  nome: string;
  descricao: string;
  categoria_id: string | null;
  precos: Record<string, number>; // ex: { "300g": 19.0, "450g": 21.0 }
  imagem_url: string | null;
  mais_vendido: boolean;
  promocao: boolean;
  ativo: boolean;
  created_at: string;
};

export type Configuracoes = {
  id: number;
  whatsapp: string;
  chave_pix: string;
  taxa_entrega: number;
};

export type CartItem = {
  produtoId: string;
  nome: string;
  tamanho: string;
  valorUnitario: number;
  quantidade: number;
};

export type TipoEntrega = 'entrega' | 'retirada';
export type FormaPagamento = 'pix' | 'dinheiro' | 'debito' | 'credito';

export type StatusPedido = 'novo' | 'em_preparo' | 'finalizado' | 'entregue' | 'cancelado';

export type Endereco = {
  cep: string;
  rua: string;
  numero: string;
  complemento: string;
  bairro: string;
  cidade: string;
  estado: string;
};

export type CheckoutPayload = {
  cliente: {
    nome: string;
    sobrenome: string;
    telefone: string;
    email?: string;
  };
  tipoEntrega: TipoEntrega;
  endereco?: Endereco;
  formaPagamento: FormaPagamento;
  precisaTroco?: boolean;
  trocoPara?: number;
  observacoes?: string;
  itens: CartItem[];
};

export type Pedido = {
  id: string;
  numero_pedido: string;
  cliente_id: string | null;
  tipo_entrega: TipoEntrega;
  forma_pagamento: FormaPagamento;
  precisa_troco: boolean;
  troco_para: number | null;
  valor_subtotal: number;
  taxa_entrega: number;
  valor_total: number;
  status: StatusPedido;
  observacoes: string;
  created_at: string;
};
