import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';
import { CheckoutPayload } from '@/lib/types';
import { buildWhatsAppLink, buildWhatsAppMessage } from '@/lib/whatsapp';

export async function POST(request: Request) {
  const payload = (await request.json()) as CheckoutPayload;

  // 1. Validar dados obrigatórios
  if (!payload?.cliente?.nome || !payload?.cliente?.sobrenome || !payload?.cliente?.telefone) {
    return NextResponse.json({ error: 'Nome, sobrenome e telefone são obrigatórios.' }, { status: 400 });
  }
  if (!payload.itens || payload.itens.length === 0) {
    return NextResponse.json({ error: 'O carrinho está vazio.' }, { status: 400 });
  }
  if (payload.tipoEntrega === 'entrega') {
    const e = payload.endereco;
    if (!e?.cep || !e?.rua || !e?.numero || !e?.bairro || !e?.cidade || !e?.estado) {
      return NextResponse.json({ error: 'Endereço incompleto para entrega.' }, { status: 400 });
    }
  }
  if (payload.formaPagamento === 'dinheiro' && payload.precisaTroco && !payload.trocoPara) {
    return NextResponse.json({ error: 'Informe o valor para troco.' }, { status: 400 });
  }

  const supabase = createAdminClient();

  // Configurações (taxa de entrega e whatsapp)
  const { data: config } = await supabase.from('configuracoes').select('*').eq('id', 1).single();
  const taxaEntrega = payload.tipoEntrega === 'entrega' ? Number(config?.taxa_entrega || 0) : 0;
  const whatsappNumero = config?.whatsapp || '5511956771182';

  const subtotal = payload.itens.reduce((sum, i) => sum + i.valorUnitario * i.quantidade, 0);
  const total = subtotal + taxaEntrega;

  // 2. Registrar cliente
  const { data: cliente, error: clienteError } = await supabase
    .from('clientes')
    .insert({
      nome: payload.cliente.nome,
      sobrenome: payload.cliente.sobrenome,
      telefone: payload.cliente.telefone,
      email: payload.cliente.email || null,
    })
    .select()
    .single();

  if (clienteError) {
    return NextResponse.json({ error: 'Erro ao salvar cliente: ' + clienteError.message }, { status: 500 });
  }

  // 3. Gerar número único de pedido
  const { data: numeroData, error: numeroError } = await supabase.rpc('gerar_numero_pedido');
  if (numeroError) {
    return NextResponse.json({ error: 'Erro ao gerar número do pedido: ' + numeroError.message }, { status: 500 });
  }
  const numeroPedido = numeroData as string;

  // 4. Salvar pedido (data/hora, forma de pagamento, observações, valor total)
  const { data: pedido, error: pedidoError } = await supabase
    .from('pedidos')
    .insert({
      numero_pedido: numeroPedido,
      cliente_id: cliente.id,
      tipo_entrega: payload.tipoEntrega,
      forma_pagamento: payload.formaPagamento,
      precisa_troco: !!payload.precisaTroco,
      troco_para: payload.trocoPara || null,
      valor_subtotal: subtotal,
      taxa_entrega: taxaEntrega,
      valor_total: total,
      status: 'novo',
      observacoes: payload.observacoes || '',
    })
    .select()
    .single();

  if (pedidoError) {
    return NextResponse.json({ error: 'Erro ao salvar pedido: ' + pedidoError.message }, { status: 500 });
  }

  // 5. Registrar endereço (se aplicável)
  if (payload.tipoEntrega === 'entrega' && payload.endereco) {
    const { error: enderecoError } = await supabase.from('enderecos').insert({
      pedido_id: pedido.id,
      cep: payload.endereco.cep,
      rua: payload.endereco.rua,
      numero: payload.endereco.numero,
      complemento: payload.endereco.complemento || '',
      bairro: payload.endereco.bairro,
      cidade: payload.endereco.cidade,
      estado: payload.endereco.estado,
    });
    if (enderecoError) {
      return NextResponse.json({ error: 'Erro ao salvar endereço: ' + enderecoError.message }, { status: 500 });
    }
  }

  // 6. Registrar itens do pedido
  const itensToInsert = payload.itens.map((item) => ({
    pedido_id: pedido.id,
    produto_id: item.produtoId,
    nome_produto: item.nome,
    quantidade: item.quantidade,
    tamanho: item.tamanho,
    valor_unitario: item.valorUnitario,
    valor_total: item.valorUnitario * item.quantidade,
  }));
  const { error: itensError } = await supabase.from('itens_pedido').insert(itensToInsert);
  if (itensError) {
    return NextResponse.json({ error: 'Erro ao salvar itens do pedido: ' + itensError.message }, { status: 500 });
  }

  // 7. Somente após concluir o salvamento: gerar link do WhatsApp
  const message = buildWhatsAppMessage({
    numeroPedido,
    payload,
    subtotal,
    taxaEntrega,
    total,
  });
  const whatsappLink = buildWhatsAppLink(whatsappNumero, message);

  return NextResponse.json({ numeroPedido, whatsappLink, total });
}
