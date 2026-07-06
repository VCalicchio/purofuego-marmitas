-- ============================================================
-- SEED: categorias e produtos reais do cardápio Puro Fuego
-- Rode depois de schema.sql
-- ============================================================

insert into categorias (nome, ordem) values
  ('Carne', 1),
  ('Frango', 2),
  ('Suíno', 3),
  ('Massas', 4),
  ('Escondidinhos', 5),
  ('Tortas', 6),
  ('Sopas', 7),
  ('Oriental', 8)
on conflict (nome) do nothing;

-- CARNE
insert into produtos (nome, descricao, categoria_id, precos) values
('Carne de panela desfiada', 'Arroz, feijão', (select id from categorias where nome='Carne'), '{"300g":19.00,"450g":21.00}'),
('Carne de panela desfiada', 'Arroz, legumes', (select id from categorias where nome='Carne'), '{"300g":19.00,"450g":21.00}'),
('Almôndegas de carne', 'Molho de tomate, arroz', (select id from categorias where nome='Carne'), '{"300g":18.50,"450g":20.50}'),
('Carne moída temperada', 'Arroz, feijão', (select id from categorias where nome='Carne'), '{"300g":17.50,"450g":19.50}'),
('Carne moída temperada', 'Arroz, legumes', (select id from categorias where nome='Carne'), '{"300g":17.50,"450g":19.50}'),
('Estrogonofe de carne', 'Sem champignon', (select id from categorias where nome='Carne'), '{"300g":19.00,"450g":21.00}'),
('Picadinho de carne', 'Arroz, feijão, farofa', (select id from categorias where nome='Carne'), '{"300g":18.50,"450g":21.50}'),
('Picadinho de carne', 'Arroz, farofa, legumes', (select id from categorias where nome='Carne'), '{"300g":18.50,"450g":21.50}'),
('Bife à parmegiana', 'Arroz', (select id from categorias where nome='Carne'), '{"300g":20.50,"450g":22.50}'),
('Rocambole de carne', 'Molho chimichurri, arroz, feijão, legumes', (select id from categorias where nome='Carne'), '{"300g":18.50,"450g":21.50}'),
('Carne louca', 'Legumes, arroz', (select id from categorias where nome='Carne'), '{"300g":19.00,"450g":21.00}');

-- FRANGO
insert into produtos (nome, descricao, categoria_id, precos) values
('Filé de sobrecoxa', 'Arroz com lentilhas, purê de abóbora', (select id from categorias where nome='Frango'), '{"300g":18.50,"450g":20.50}'),
('Filé de sobrecoxa', 'Arroz colorido, feijão e farofa', (select id from categorias where nome='Frango'), '{"300g":18.50,"450g":20.50}'),
('Filé de sobrecoxa', 'Arroz com lentilhas, farofa, legumes', (select id from categorias where nome='Frango'), '{"300g":18.50,"450g":20.50}'),
('Estrogonofe de frango', 'Arroz', (select id from categorias where nome='Frango'), '{"300g":17.50,"450g":19.50}'),
('Filé de frango', 'Arroz, feijão', (select id from categorias where nome='Frango'), '{"300g":16.50,"450g":18.50}'),
('Filé de frango', 'Arroz, legumes', (select id from categorias where nome='Frango'), '{"300g":16.50,"450g":18.50}'),
('Filé de frango', 'Arroz, creme de milho, brócolis', (select id from categorias where nome='Frango'), '{"300g":17.50,"450g":19.50}'),
('Tiras de frango', 'Arroz, creme de espinafre, cenoura', (select id from categorias where nome='Frango'), '{"300g":17.50,"450g":19.50}'),
('Filé de frango à parmegiana', 'Arroz', (select id from categorias where nome='Frango'), '{"300g":19.00,"450g":21.00}'),
('Almôndegas de frango', 'Molho de tomate e purê de mandioquinha', (select id from categorias where nome='Frango'), '{"300g":18.50,"450g":21.50}'),
('Almôndegas de frango', 'Molho de tomate e purê de batata', (select id from categorias where nome='Frango'), '{"300g":18.50,"450g":21.50}'),
('Almôndegas de frango', 'Arroz, legumes', (select id from categorias where nome='Frango'), '{"300g":18.50,"450g":21.50}');

-- SUÍNO
insert into produtos (nome, descricao, categoria_id, precos) values
('Filé mignon suíno', 'Molho de mostarda, arroz de brócolis', (select id from categorias where nome='Suíno'), '{"300g":17.50,"450g":19.50}'),
('Picadinho de mignon suíno', 'Couve-flor com molho branco, arroz', (select id from categorias where nome='Suíno'), '{"300g":17.50,"450g":19.50}'),
('Lombo suíno assado', 'Arroz, couve', (select id from categorias where nome='Suíno'), '{"300g":17.50,"450g":19.50}'),
('Calabresa acebolada', 'Arroz, feijão', (select id from categorias where nome='Suíno'), '{"300g":17.50,"450g":19.50}'),
('Linguiça toscana', 'Arroz, feijão, brócolis', (select id from categorias where nome='Suíno'), '{"300g":17.50,"450g":19.50}'),
('Feijoada leve', 'Feijão preto, calabresa, lombo desfiado, arroz, couve', (select id from categorias where nome='Suíno'), '{"300g":18.50,"450g":20.50}');

-- MASSAS
insert into produtos (nome, descricao, categoria_id, precos) values
('Lasanha à bolonhesa', '', (select id from categorias where nome='Massas'), '{"300g":19.00,"450g":21.00}'),
('Lasanha de berinjela', 'Muçarela, molho de tomate', (select id from categorias where nome='Massas'), '{"300g":17.50,"450g":19.50}'),
('Lasanha de brócolis', 'Molho branco, muçarela', (select id from categorias where nome='Massas'), '{"300g":17.50,"450g":19.50}'),
('Espaguete alho e óleo', 'Almôndegas de carne ao sugo', (select id from categorias where nome='Massas'), '{"300g":17.50,"450g":19.50}'),
('Espaguete com molho de linguiça', '', (select id from categorias where nome='Massas'), '{"300g":16.50,"450g":18.50}'),
('Espaguete com molho branco', 'Frango, presunto', (select id from categorias where nome='Massas'), '{"300g":16.50,"450g":18.50}');

-- ESCONDIDINHOS
insert into produtos (nome, descricao, categoria_id, precos) values
('Escondidinho de carne', 'Purê de batata doce', (select id from categorias where nome='Escondidinhos'), '{"300g":18.50,"450g":20.50}'),
('Escondidinho de carne', 'Purê de batata', (select id from categorias where nome='Escondidinhos'), '{"300g":18.50,"450g":20.50}'),
('Escondidinho de calabresa', 'Purê de batata', (select id from categorias where nome='Escondidinhos'), '{"300g":18.50,"450g":20.50}'),
('Escondidinho de frango moído temperado', 'Purê de batata', (select id from categorias where nome='Escondidinhos'), '{"300g":18.50,"450g":20.50}');

-- TORTAS 300G (tamanho único)
insert into produtos (nome, descricao, categoria_id, precos) values
('Torta de frango', 'Molho branco, muçarela', (select id from categorias where nome='Tortas'), '{"300g":17.50}'),
('Torta de cebola', 'Milho, muçarela', (select id from categorias where nome='Tortas'), '{"300g":17.50}');

-- SOPAS 450G (tamanho único)
insert into produtos (nome, descricao, categoria_id, precos) values
('Canja de legumes', 'Lascas de frango, arroz', (select id from categorias where nome='Sopas'), '{"450g":17.00}'),
('Creme de abóbora', 'Frango desfiado', (select id from categorias where nome='Sopas'), '{"450g":17.00}'),
('Sopa de lentilha', 'Cenoura, cebola, alho e ervas aromáticas', (select id from categorias where nome='Sopas'), '{"450g":17.00}');

-- ORIENTAL
insert into produtos (nome, descricao, categoria_id, precos) values
('Frango xadrez', 'Cubos de frango temperado com alho, cebola, pimentões e molho à base de shoyu', (select id from categorias where nome='Oriental'), '{"300g":19.50,"450g":21.50}'),
('Yakissoba de carne com legumes', 'Macarrão oriental, tiras de carne, cebola, cenoura, brócolis, molho shoyu, óleo de gergelim', (select id from categorias where nome='Oriental'), '{"300g":19.50,"450g":21.50}'),
('Yakissoba de frango com legumes', 'Macarrão oriental, tiras de frango, cebola, cenoura, brócolis, molho shoyu, óleo de gergelim', (select id from categorias where nome='Oriental'), '{"300g":19.50,"450g":21.50}');
