# Puro Fuego Marmitas Congeladas — Sistema Completo

Aplicação Next.js 14 + TypeScript + Tailwind + Supabase: site institucional, cardápio dinâmico,
carrinho, checkout com integração WhatsApp e painel administrativo completo.

## O que está pronto e funcional

- **Site público**: Home, Cardápio (busca, filtro por categoria, mais vendidos, promoções),
  Como Funciona, Contato.
- **Cardápio real**: os 47 produtos do seu PDF já estão no `supabase/seed.sql`, prontos para
  importar — não é produto de exemplo, é o cardápio de vocês.
- **Carrinho**: persistido em localStorage, com tamanhos (300g/450g) e preços por tamanho.
- **Checkout completo**: dados do cliente, entrega ou retirada, endereço condicional, forma de
  pagamento (PIX/dinheiro/débito/crédito), troco condicional, observações, resumo do pedido.
- **Persistência real**: ao finalizar, a API (`/app/api/orders/route.ts`) salva cliente → pedido →
  endereço → itens, gera número único de pedido via função SQL, e só então abre o WhatsApp com a
  mensagem 100% pronta (nada para o cliente digitar).
- **Painel administrativo** (`/admin`, protegido por Supabase Auth):
  - Dashboard com KPIs (pedidos hoje/semana/mês, faturamento, ticket médio, clientes).
  - CRUD completo de produtos (nome, descrição, categoria, preços por tamanho, ativo/inativo,
    mais vendido, promoção).
  - Gestão de pedidos: filtros (data, cliente, status, forma de pagamento), busca, detalhes
    completos, alteração de status com histórico.
  - Configurações (WhatsApp, chave PIX, taxa de entrega).
  - Relatórios com gráficos (Recharts) e exportação em PDF e Excel.

## O que exige atenção antes de ir para produção

Fui direto sobre isso desde o início: eu não tenho como criar ou hospedar um projeto Supabase real
por vocês, nem fazer o deploy final. Faltam estes passos, que levam ~15–20 minutos:

1. **Criar o projeto no Supabase** (supabase.com) e copiar a URL + chaves em
   Project Settings → API.
2. **Rodar o schema**: abra o SQL Editor do Supabase e execute, nesta ordem:
   `supabase/schema.sql` e depois `supabase/seed.sql`.
3. **Criar o usuário administrador**: em Authentication → Users → Add user, crie o e-mail/senha
   que a equipe vai usar para logar em `/admin/login`.
4. **Preencher `.env.local`** com base em `.env.example`.
5. **Rodar localmente**: `npm install` e depois `npm run dev`.
6. **Deploy**: recomendo Vercel (import do repositório + colar as mesmas variáveis de ambiente).

## Estrutura de preços por tamanho

O documento original tinha uma coluna `preco` fixa por produto, mas o cardápio real tem dois
preços por prato (300g/450g). Resolvi isso com uma coluna `precos` (JSON) em vez de duplicar
produtos — está documentado em `supabase/schema.sql`.

## Áreas que ficaram como base sólida, não 100% polidas

- Upload de imagem de produto: o campo `imagem_url` existe e o cardápio já trata a ausência de
  imagem com um placeholder elegante, mas a tela de upload de arquivo (drag-and-drop) no painel
  não foi implementada — hoje a URL da imagem é colada manualmente. Posso adicionar isso a seguir.
  Faltou o campo/tela de upload de imagem no admin (é rápido de adicionar).
- Filtro de "clientes recorrentes" nos relatórios é calculado a partir dos próprios pedidos, sem
  uma tela dedicada de listagem de clientes — os números aparecem no gráfico, mas não há CRUD de
  clientes separado.

Se quiser, eu continuo e fecho esses dois pontos, ou ajusto qualquer parte do fluxo que não ficou
do jeito que vocês imaginavam.
