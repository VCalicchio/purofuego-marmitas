import { CartItem, CheckoutPayload } from './types';

export function formatBRL(value: number) {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

const FORMA_PAGAMENTO_LABEL: Record<string, string> = {
  pix: 'PIX',
  dinheiro: 'Dinheiro',
  debito: 'Cartão de Débito',
  credito: 'Cartão de Crédito',
};

export function buildWhatsAppMessage(params: {
  numeroPedido: string;
  payload: CheckoutPayload;
  subtotal: number;
  taxaEntrega: number;
  total: number;
}) {
  const { numeroPedido, payload, subtotal, taxaEntrega, total } = params;
  const { cliente, tipoEntrega, endereco, formaPagamento, precisaTroco, trocoPara, observacoes, itens } = payload;

  const linhas: string[] = [];
  linhas.push(`*Novo Pedido — Puro Fuego* 🔥`);
  linhas.push(`Pedido: *${numeroPedido}*`);
  linhas.push('');
  linhas.push(`*Cliente:* ${cliente.nome} ${cliente.sobrenome}`);
  linhas.push(`*Telefone:* ${cliente.telefone}`);
  if (cliente.email) linhas.push(`*E-mail:* ${cliente.email}`);
  linhas.push('');
  linhas.push(`*Entrega:* ${tipoEntrega === 'entrega' ? 'Entrega' : 'Retirada no local'}`);
  if (tipoEntrega === 'entrega' && endereco) {
    linhas.push(
      `*Endereço:* ${endereco.rua}, ${endereco.numero}${endereco.complemento ? ' - ' + endereco.complemento : ''}, ${endereco.bairro}, ${endereco.cidade}/${endereco.estado} - CEP ${endereco.cep}`
    );
  }
  linhas.push('');
  linhas.push('*Itens do pedido:*');
  itens.forEach((item: CartItem) => {
    linhas.push(
      `• ${item.quantidade}x ${item.nome} (${item.tamanho}) — ${formatBRL(item.valorUnitario * item.quantidade)}`
    );
  });
  linhas.push('');
  linhas.push(`Subtotal: ${formatBRL(subtotal)}`);
  if (taxaEntrega > 0) linhas.push(`Taxa de entrega: ${formatBRL(taxaEntrega)}`);
  linhas.push(`*Total: ${formatBRL(total)}*`);
  linhas.push('');
  linhas.push(`*Pagamento:* ${FORMA_PAGAMENTO_LABEL[formaPagamento]}`);
  if (formaPagamento === 'dinheiro') {
    linhas.push(precisaTroco ? `Troco para: ${formatBRL(trocoPara || 0)}` : 'Não precisa de troco');
  }
  if (observacoes) {
    linhas.push('');
    linhas.push(`*Observações:* ${observacoes}`);
  }

  return linhas.join('\n');
}

export function buildWhatsAppLink(whatsappNumber: string, message: string) {
  const digits = whatsappNumber.replace(/\D/g, '');
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}
