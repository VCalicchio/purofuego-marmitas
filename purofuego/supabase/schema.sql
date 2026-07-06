-- ============================================================
-- PURO FUEGO MARMITAS CONGELADAS — SCHEMA COMPLETO
-- Rode este arquivo no SQL Editor do seu projeto Supabase.
-- ============================================================

create extension if not exists "pgcrypto";

-- ---------- CLIENTES ----------
create table if not exists clientes (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  sobrenome text not null,
  telefone text not null,
  email text,
  data_cadastro timestamptz not null default now()
);
create index if not exists idx_clientes_telefone on clientes (telefone);

-- ---------- CATEGORIAS ----------
create table if not exists categorias (
  id uuid primary key default gen_random_uuid(),
  nome text not null unique,
  ordem int not null default 0
);

-- ---------- PRODUTOS ----------
-- `precos` guarda o preço por tamanho, ex: {"300g": 19.00, "450g": 21.00}
-- Isso permite tamanhos distintos por produto sem tabelas extras.
create table if not exists produtos (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  descricao text default '',
  categoria_id uuid references categorias(id) on delete set null,
  precos jsonb not null default '{}'::jsonb,
  imagem_url text,
  mais_vendido boolean not null default false,
  promocao boolean not null default false,
  ativo boolean not null default true,
  created_at timestamptz not null default now()
);
create index if not exists idx_produtos_categoria on produtos (categoria_id);
create index if not exists idx_produtos_ativo on produtos (ativo);

-- ---------- CONFIGURACOES (linha única) ----------
create table if not exists configuracoes (
  id int primary key default 1,
  whatsapp text not null default '5511956771182',
  chave_pix text default '',
  taxa_entrega numeric(10,2) not null default 0,
  constraint singleton check (id = 1)
);
insert into configuracoes (id, whatsapp, taxa_entrega)
  values (1, '5511956771182', 0)
  on conflict (id) do nothing;

-- ---------- PEDIDOS ----------
create table if not exists pedidos (
  id uuid primary key default gen_random_uuid(),
  numero_pedido text not null unique,
  cliente_id uuid references clientes(id) on delete set null,
  tipo_entrega text not null check (tipo_entrega in ('entrega','retirada')),
  forma_pagamento text not null check (forma_pagamento in ('pix','dinheiro','debito','credito')),
  precisa_troco boolean not null default false,
  troco_para numeric(10,2),
  valor_subtotal numeric(10,2) not null default 0,
  taxa_entrega numeric(10,2) not null default 0,
  valor_total numeric(10,2) not null default 0,
  status text not null default 'novo' check (status in ('novo','em_preparo','finalizado','entregue','cancelado')),
  observacoes text default '',
  created_at timestamptz not null default now()
);
create index if not exists idx_pedidos_status on pedidos (status);
create index if not exists idx_pedidos_created on pedidos (created_at);

-- ---------- ENDERECOS ----------
create table if not exists enderecos (
  id uuid primary key default gen_random_uuid(),
  pedido_id uuid references pedidos(id) on delete cascade,
  cep text,
  rua text,
  numero text,
  complemento text,
  bairro text,
  cidade text,
  estado text
);

-- ---------- ITENS DO PEDIDO ----------
create table if not exists itens_pedido (
  id uuid primary key default gen_random_uuid(),
  pedido_id uuid references pedidos(id) on delete cascade,
  produto_id uuid references produtos(id) on delete set null,
  nome_produto text not null,
  quantidade int not null check (quantidade > 0),
  tamanho text not null,
  valor_unitario numeric(10,2) not null,
  valor_total numeric(10,2) not null
);

-- ---------- HISTORICO DE STATUS ----------
create table if not exists historico_status (
  id uuid primary key default gen_random_uuid(),
  pedido_id uuid references pedidos(id) on delete cascade,
  status_anterior text,
  status_novo text not null,
  alterado_em timestamptz not null default now()
);

-- ============================================================
-- FUNÇÃO: gerar número de pedido sequencial e amigável
-- ============================================================
create sequence if not exists pedido_seq start 1;

create or replace function gerar_numero_pedido()
returns text language sql as $$
  select 'PF' || to_char(now(), 'YYMMDD') || lpad(nextval('pedido_seq')::text, 4, '0');
$$;

-- Trigger para registrar histórico de status automaticamente
create or replace function trg_historico_status()
returns trigger language plpgsql as $$
begin
  if (tg_op = 'INSERT') then
    insert into historico_status (pedido_id, status_anterior, status_novo)
      values (new.id, null, new.status);
  elsif (tg_op = 'UPDATE' and old.status is distinct from new.status) then
    insert into historico_status (pedido_id, status_anterior, status_novo)
      values (new.id, old.status, new.status);
  end if;
  return new;
end;
$$;

drop trigger if exists pedidos_historico on pedidos;
create trigger pedidos_historico
  after insert or update on pedidos
  for each row execute function trg_historico_status();

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================
alter table clientes enable row level security;
alter table categorias enable row level security;
alter table produtos enable row level security;
alter table configuracoes enable row level security;
alter table pedidos enable row level security;
alter table enderecos enable row level security;
alter table itens_pedido enable row level security;
alter table historico_status enable row level security;

-- Leitura pública do cardápio (site institucional)
create policy "categorias_leitura_publica" on categorias for select using (true);
create policy "produtos_leitura_publica" on produtos for select using (ativo = true);
create policy "configuracoes_leitura_publica" on configuracoes for select using (true);

-- Clientes e pedidos: qualquer visitante pode CRIAR (checkout do site),
-- mas leitura/edição fica restrita a usuários autenticados (admin).
create policy "clientes_insert_publico" on clientes for insert with check (true);
create policy "pedidos_insert_publico" on pedidos for insert with check (true);
create policy "enderecos_insert_publico" on enderecos for insert with check (true);
create policy "itens_pedido_insert_publico" on itens_pedido for insert with check (true);

create policy "admin_full_clientes" on clientes for all using (auth.role() = 'authenticated');
create policy "admin_full_pedidos_select" on pedidos for select using (auth.role() = 'authenticated');
create policy "admin_full_pedidos_update" on pedidos for update using (auth.role() = 'authenticated');
create policy "admin_full_enderecos_select" on enderecos for select using (auth.role() = 'authenticated');
create policy "admin_full_itens_select" on itens_pedido for select using (auth.role() = 'authenticated');
create policy "admin_full_historico" on historico_status for select using (auth.role() = 'authenticated');

create policy "admin_full_categorias" on categorias for all using (auth.role() = 'authenticated');
create policy "admin_full_produtos" on produtos for all using (auth.role() = 'authenticated');
create policy "admin_full_configuracoes" on configuracoes for all using (auth.role() = 'authenticated');
