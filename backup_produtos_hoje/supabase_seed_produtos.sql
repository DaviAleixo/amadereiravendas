-- ========================================================
-- SCRIPT DE CRIAÇÃO E CARGA DE DADOS DO SUPABASE
-- Data de Exportação: 2026-09-10T12:28:52.252Z
-- Total de Produtos: 25
-- ========================================================

-- 1. Criar a tabela 'products' caso não exista
CREATE TABLE IF NOT EXISTS public.products (
  id BIGINT PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  category_label TEXT NOT NULL,
  dimensions TEXT NOT NULL,
  wood TEXT NOT NULL,
  price NUMERIC(10, 2) NOT NULL,
  installments TEXT NOT NULL,
  old_price TEXT,
  description TEXT NOT NULL,
  images TEXT[] NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Habilitar RLS (Row Level Security) e liberar leitura pública
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Permitir leitura pública dos produtos" ON public.products
  FOR SELECT USING (true);

-- 2. Inserir todos os produtos salvos hoje
INSERT INTO public.products (id, slug, name, category, category_label, dimensions, wood, price, installments, old_price, description, images)
VALUES (
  1,
  'mesa-prancha-resina-epoxi',
  'Mesa Prancha com Resina Epóxi',
  'pranchas',
  'Pranchas',
  '247 x 90 cm',
  'Madeira e Resina',
  7990,
  '10x de R$ 899,00',
  NULL,
  'Uma peça marcante que combina a beleza da madeira maciça com a elegância da resina epóxi.',
  ARRAY['/prancharesina.jpeg']
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  price = EXCLUDED.price,
  dimensions = EXCLUDED.dimensions,
  wood = EXCLUDED.wood,
  description = EXCLUDED.description,
  images = EXCLUDED.images;

INSERT INTO public.products (id, slug, name, category, category_label, dimensions, wood, price, installments, old_price, description, images)
VALUES (
  2,
  'mesa-cascata-angelim-500',
  'Mesa Cascata Angelim',
  'mesas-cascata',
  'Mesas Cascata',
  '500 x 90 cm',
  'Angelim',
  12990,
  'R$ 13.990,00 em 10x',
  NULL,
  'Acomoda até 12 pessoas.',
  ARRAY['/mesacascatamadeiraangelim.jpeg', '/mesacascatamadeiraangelim1.jpeg', '/mesacascatamadeiraangelim2.jpeg']
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  price = EXCLUDED.price,
  dimensions = EXCLUDED.dimensions,
  wood = EXCLUDED.wood,
  description = EXCLUDED.description,
  images = EXCLUDED.images;

INSERT INTO public.products (id, slug, name, category, category_label, dimensions, wood, price, installments, old_price, description, images)
VALUES (
  3,
  'mesa-cascata-pequia-340',
  'Mesa Cascata Pequiá',
  'mesas-cascata',
  'Mesas Cascata',
  '340 x 122 cm',
  'Pequiá',
  15990,
  'R$ 16.990,00 parcelado',
  NULL,
  'Mesa cascata em madeira Pequiá.',
  ARRAY['/mesacascatapequia.jpeg']
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  price = EXCLUDED.price,
  dimensions = EXCLUDED.dimensions,
  wood = EXCLUDED.wood,
  description = EXCLUDED.description,
  images = EXCLUDED.images;

INSERT INTO public.products (id, slug, name, category, category_label, dimensions, wood, price, installments, old_price, description, images)
VALUES (
  5,
  'mesa-angelim-390',
  'Mesa Madeira Angelim',
  'mesas',
  'Mesas',
  '390 x 90 cm',
  'Angelim',
  12000,
  'R$ 12.990,00 em 10x',
  NULL,
  'Acomoda até 10 pessoas.',
  ARRAY['/mesamadeiraangelim1.jpeg']
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  price = EXCLUDED.price,
  dimensions = EXCLUDED.dimensions,
  wood = EXCLUDED.wood,
  description = EXCLUDED.description,
  images = EXCLUDED.images;

INSERT INTO public.products (id, slug, name, category, category_label, dimensions, wood, price, installments, old_price, description, images)
VALUES (
  6,
  'aparador',
  'Aparador',
  'aparadores',
  'Aparadores',
  '156 x 33 x 88 cm de altura',
  'Madeira maciça',
  1240,
  'R$ 1.990,00 em 10x',
  NULL,
  'Aparador elegante e funcional, perfeito para complementar salas e halls de entrada.',
  ARRAY['/aparador1.jpeg', '/aparador2.jpeg']
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  price = EXCLUDED.price,
  dimensions = EXCLUDED.dimensions,
  wood = EXCLUDED.wood,
  description = EXCLUDED.description,
  images = EXCLUDED.images;

INSERT INTO public.products (id, slug, name, category, category_label, dimensions, wood, price, installments, old_price, description, images)
VALUES (
  8,
  'mesa-cascata-pequia-390',
  'Mesa Cascata Pequiá',
  'mesas-cascata',
  'Mesas Cascata',
  '390 x 124/140 cm',
  'Pequiá',
  12000,
  'R$ 12.990,00 em 10x',
  'R$ 24.990,00',
  'Acomoda até 12 pessoas.',
  ARRAY['/mesacascatacadeirapequia5x0,90.PNG']
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  price = EXCLUDED.price,
  dimensions = EXCLUDED.dimensions,
  wood = EXCLUDED.wood,
  description = EXCLUDED.description,
  images = EXCLUDED.images;

INSERT INTO public.products (id, slug, name, category, category_label, dimensions, wood, price, installments, old_price, description, images)
VALUES (
  9,
  'mesa-cascata-dupla-270',
  'Mesa Cascata Dupla',
  'mesas-cascata',
  'Mesas Cascata',
  '270 x 124 cm',
  'Madeira maciça',
  10000,
  '10x de R$ 1.299,00',
  'R$ 20.990,00',
  'Design marcante com cascata dupla, unindo sofisticação e robustez.',
  ARRAY['/cascata-dupla.jpeg', '/cascata-dupla1.jpeg']
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  price = EXCLUDED.price,
  dimensions = EXCLUDED.dimensions,
  wood = EXCLUDED.wood,
  description = EXCLUDED.description,
  images = EXCLUDED.images;

INSERT INTO public.products (id, slug, name, category, category_label, dimensions, wood, price, installments, old_price, description, images)
VALUES (
  10,
  'mesa-bolacha-resina-epoxi',
  'Mesa Bolacha com Resina Epóxi',
  'resina-epoxi',
  'Resina Epóxi',
  '130 x 116 cm de diâmetro',
  'Madeira e Resina',
  5990,
  '10x de R$ 690,00',
  'R$ 9.990,00',
  'Mesa orgânica em formato bolacha, realçada com os detalhes transparentes da resina epóxi.',
  ARRAY['/mesabolacharesinaepoxi.jpeg', '/mesabolacharesinaepoxi1.jpeg', '/mesabolacharesinaepoxi2.jpeg']
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  price = EXCLUDED.price,
  dimensions = EXCLUDED.dimensions,
  wood = EXCLUDED.wood,
  description = EXCLUDED.description,
  images = EXCLUDED.images;

INSERT INTO public.products (id, slug, name, category, category_label, dimensions, wood, price, installments, old_price, description, images)
VALUES (
  11,
  'base-raiz-aroeira',
  'Base Raiz Aroeira',
  'bases',
  'Bases',
  'Vidro de até 200 cm',
  'Aroeira',
  15000,
  '10x de R$ 1.699,00',
  'R$ 19.990,00',
  'Base orgânica esculpida pelas formas naturais da raiz de Aroeira. Ideal para tampos de vidro.',
  ARRAY['/baseraizaroeira.jpeg', '/baseraizaroeira1.jpeg', '/baseraizaroeira2.jpeg', '/baseraizaroeira3.jpeg', '/baseraizaroeira4.jpeg']
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  price = EXCLUDED.price,
  dimensions = EXCLUDED.dimensions,
  wood = EXCLUDED.wood,
  description = EXCLUDED.description,
  images = EXCLUDED.images;

INSERT INTO public.products (id, slug, name, category, category_label, dimensions, wood, price, installments, old_price, description, images)
VALUES (
  13,
  'mesa-cascata-angelim-epoxi-320',
  'Mesa Cascata Angelim com Resina Epóxi',
  'resina-epoxi',
  'Resina Epóxi',
  '320 x 105 cm',
  'Angelim e Resina',
  15000,
  'R$ 15.990,00 em 10x',
  'R$ 18.990,00',
  'Mesa trabalhada em resina epóxi com a beleza do Angelim e formato cascata.',
  ARRAY['/mesacascataangelimresinaepoxi 240x105.jpeg', '/mesacascataangelim240x105resinaepoxi.jpeg', '/mesacascataangelim240x105resinaepoxi1.jpeg', '/mesacascataangelim240x105resinaepoxi2.jpeg']
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  price = EXCLUDED.price,
  dimensions = EXCLUDED.dimensions,
  wood = EXCLUDED.wood,
  description = EXCLUDED.description,
  images = EXCLUDED.images;

INSERT INTO public.products (id, slug, name, category, category_label, dimensions, wood, price, installments, old_price, description, images)
VALUES (
  14,
  'cadeira-italia',
  'Cadeira Itália (Cor à escolha)',
  'cadeiras',
  'Cadeiras',
  'Padrão',
  'Madeira maciça',
  1200,
  'R$ 1.290,00 em 10x',
  'R$ 1.790,00',
  'Design clássico e conforto. IMPORTANTE: A COR É FEITA SOB ENCOMENDA, À ESCOLHA DO CLIENTE.',
  ARRAY['/cadeiraitaliacores.jpeg']
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  price = EXCLUDED.price,
  dimensions = EXCLUDED.dimensions,
  wood = EXCLUDED.wood,
  description = EXCLUDED.description,
  images = EXCLUDED.images;

INSERT INTO public.products (id, slug, name, category, category_label, dimensions, wood, price, installments, old_price, description, images)
VALUES (
  15,
  'base-raiz-teca',
  'Base Raiz em Madeira Teca',
  'bases',
  'Bases',
  'Vidro bisotê 10 mm e 2 metros de diâmetro',
  'Teca',
  25000,
  'R$ 26.990,00 em 10x',
  'R$ 29.990,00',
  'A nobreza da madeira Teca modelada organicamente em uma base única.',
  ARRAY['/baseraizmadeiratecacomvidrobisote10mmx2m.jpeg', '/baseraizmadeiratecacomvidrobisote10mmx2m-foto2..jpeg', '/baseraizmadeiratecacomvidrobisote10mmx2m-foto3.jpeg']
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  price = EXCLUDED.price,
  dimensions = EXCLUDED.dimensions,
  wood = EXCLUDED.wood,
  description = EXCLUDED.description,
  images = EXCLUDED.images;

INSERT INTO public.products (id, slug, name, category, category_label, dimensions, wood, price, installments, old_price, description, images)
VALUES (
  16,
  'mesa-base-cumaru',
  'Mesa Base Cumaru',
  'bases',
  'Bases',
  '240 x 125 cm',
  'Cumaru',
  7000,
  'R$ 7.990,00 em 10x',
  'R$ 9.990,00',
  'Mesa robusta e elegante com base em Cumaru.',
  ARRAY['/mesabasecumaru.jpeg', '/mesabasecuaru2.jpeg', '/mesabasecumaru3.jpeg']
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  price = EXCLUDED.price,
  dimensions = EXCLUDED.dimensions,
  wood = EXCLUDED.wood,
  description = EXCLUDED.description,
  images = EXCLUDED.images;

INSERT INTO public.products (id, slug, name, category, category_label, dimensions, wood, price, installments, old_price, description, images)
VALUES (
  17,
  'cadeira-faby-com-braco',
  'Cadeira Faby com Braço',
  'cadeiras',
  'Cadeiras',
  'Padrão',
  'Madeira maciça',
  1290,
  'R$ 1.390,00 em 10x',
  'R$ 1.790,00',
  'Cadeira de design confortável, com apoio para os braços.',
  ARRAY['/cadeirafabycombraco.jpeg']
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  price = EXCLUDED.price,
  dimensions = EXCLUDED.dimensions,
  wood = EXCLUDED.wood,
  description = EXCLUDED.description,
  images = EXCLUDED.images;

INSERT INTO public.products (id, slug, name, category, category_label, dimensions, wood, price, installments, old_price, description, images)
VALUES (
  18,
  'cadeira-ester',
  'Cadeira Ester',
  'cadeiras',
  'Cadeiras',
  'Padrão',
  'Madeira maciça',
  990,
  'R$ 1.190,00 em 10x',
  'R$ 1.290,00',
  'Cadeira minimalista e elegante para salas de jantar.',
  ARRAY['/cadeiraester.jpeg']
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  price = EXCLUDED.price,
  dimensions = EXCLUDED.dimensions,
  wood = EXCLUDED.wood,
  description = EXCLUDED.description,
  images = EXCLUDED.images;

INSERT INTO public.products (id, slug, name, category, category_label, dimensions, wood, price, installments, old_price, description, images)
VALUES (
  19,
  'cadeira-faby-sem-braco',
  'Cadeira Faby sem Braço',
  'cadeiras',
  'Cadeiras',
  'Padrão',
  'Madeira maciça',
  1190,
  'R$ 1.290,00 em 10x',
  'R$ 1.590,00',
  'Cadeira Faby, versão sem braços para maior versatilidade de espaço.',
  ARRAY['/cadeirafabysembraco.jpeg']
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  price = EXCLUDED.price,
  dimensions = EXCLUDED.dimensions,
  wood = EXCLUDED.wood,
  description = EXCLUDED.description,
  images = EXCLUDED.images;

INSERT INTO public.products (id, slug, name, category, category_label, dimensions, wood, price, installments, old_price, description, images)
VALUES (
  20,
  'mesa-bolacha-pequia',
  'Mesa Bolacha — Madeira Pequiá',
  'mesas',
  'Mesas',
  '1 metro de diâmetro',
  'Pequiá',
  2990,
  'R$ 3.990,00 em 10x',
  NULL,
  'Mesa bolacha em madeira Pequiá com pés de aço preto.',
  ARRAY['/mesabolachamadeirapequiapespreto.jpeg', '/mesabolachamadeirapequiapespreto1.jpeg']
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  price = EXCLUDED.price,
  dimensions = EXCLUDED.dimensions,
  wood = EXCLUDED.wood,
  description = EXCLUDED.description,
  images = EXCLUDED.images;

INSERT INTO public.products (id, slug, name, category, category_label, dimensions, wood, price, installments, old_price, description, images)
VALUES (
  21,
  'mesa-prancha-pequia',
  'Mesa Prancha',
  'pranchas',
  'Pranchas',
  '157 x 62',
  'Pequiá',
  1990,
  'R$ 2.490 em 10x',
  NULL,
  'Mesa prancha em madeira Pequiá.',
  ARRAY['/mesapranchamadeirapequia.jpeg']
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  price = EXCLUDED.price,
  dimensions = EXCLUDED.dimensions,
  wood = EXCLUDED.wood,
  description = EXCLUDED.description,
  images = EXCLUDED.images;

INSERT INTO public.products (id, slug, name, category, category_label, dimensions, wood, price, installments, old_price, description, images)
VALUES (
  22,
  'mesa-bolacha-pequia-153',
  'Mesa Bolacha — Madeira Pequiá',
  'mesas',
  'Mesas',
  '1,53 m de diâmetro',
  'Pequiá',
  6990,
  'R$ 7.990,00 em 10x',
  NULL,
  'Mesa bolacha em madeira Pequiá com pés de aço trabalhados pretos.',
  ARRAY['/mesabolachamadeirapequia-em-pe.jpeg', '/mesabolachamadeirapequia2.jpeg']
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  price = EXCLUDED.price,
  dimensions = EXCLUDED.dimensions,
  wood = EXCLUDED.wood,
  description = EXCLUDED.description,
  images = EXCLUDED.images;

INSERT INTO public.products (id, slug, name, category, category_label, dimensions, wood, price, installments, old_price, description, images)
VALUES (
  23,
  'mesa-de-centro-pequia',
  'Mesa de Centro',
  'mesas',
  'Mesas',
  '107 x 78 cm',
  'Pequiá',
  1490,
  'R$ 2.490,00 parcelado',
  NULL,
  'Mesa de centro em madeira Pequiá com pés de aço preto.',
  ARRAY['/mesadecentropequia.jpeg']
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  price = EXCLUDED.price,
  dimensions = EXCLUDED.dimensions,
  wood = EXCLUDED.wood,
  description = EXCLUDED.description,
  images = EXCLUDED.images;

INSERT INTO public.products (id, slug, name, category, category_label, dimensions, wood, price, installments, old_price, description, images)
VALUES (
  24,
  'mesa-cascata-angelim-310',
  'Mesa Cascata Angelim',
  'resina-epoxi',
  'Resina Epóxi',
  '310 x 105 cm',
  'Angelim',
  15990,
  'R$ 16.990,00 em 10x',
  'R$ 18.990,00',
  'Mesa cascata em madeira Angelim trabalhada em resina epóxi.',
  ARRAY['/mesacascataangelim310X105.jpeg', '/mesacascataangelim 310X105foto-2.jpeg', '/mesacascataangelim 310X105foto3.jpeg']
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  price = EXCLUDED.price,
  dimensions = EXCLUDED.dimensions,
  wood = EXCLUDED.wood,
  description = EXCLUDED.description,
  images = EXCLUDED.images;

INSERT INTO public.products (id, slug, name, category, category_label, dimensions, wood, price, installments, old_price, description, images)
VALUES (
  25,
  'mesa-pequia-preto',
  'Mesa Cascata Pequiá Preto',
  'mesas-cascata',
  'Mesas Cascata',
  '360 x 87/84 cm',
  'Pequiá Preto',
  12000,
  '10x de R$ 1.299,00',
  NULL,
  'Acomoda até 8 pessoas. Madeira de tonalidade marcante e alta durabilidade.',
  ARRAY['/pequiapreto.jpeg']
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  price = EXCLUDED.price,
  dimensions = EXCLUDED.dimensions,
  wood = EXCLUDED.wood,
  description = EXCLUDED.description,
  images = EXCLUDED.images;

INSERT INTO public.products (id, slug, name, category, category_label, dimensions, wood, price, installments, old_price, description, images)
VALUES (
  26,
  'aparador-142',
  'Aparador',
  'aparadores',
  'Aparadores',
  '142 x 60 x 89 cm de altura',
  'Madeira maciça',
  2450,
  'R$ 2.990,00 em 10x',
  NULL,
  'Aparador elegante em madeira maciça.',
  ARRAY['/aparador142x60x89.jpeg', '/aparador142x60x89foto2.jpeg', '/aparador142x60x89foto3.jpeg']
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  price = EXCLUDED.price,
  dimensions = EXCLUDED.dimensions,
  wood = EXCLUDED.wood,
  description = EXCLUDED.description,
  images = EXCLUDED.images;

INSERT INTO public.products (id, slug, name, category, category_label, dimensions, wood, price, installments, old_price, description, images)
VALUES (
  27,
  'aparador-organico',
  'Aparador Orgânico',
  'aparadores',
  'Aparadores',
  '200 x 80 cm',
  'Madeira maciça',
  18000,
  'R$ 18.990,00 em 10x',
  'R$ 24.990,00',
  'Aparador orgânico com design elegante.',
  ARRAY['/aparadororganico.jpeg']
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  price = EXCLUDED.price,
  dimensions = EXCLUDED.dimensions,
  wood = EXCLUDED.wood,
  description = EXCLUDED.description,
  images = EXCLUDED.images;

INSERT INTO public.products (id, slug, name, category, category_label, dimensions, wood, price, installments, old_price, description, images)
VALUES (
  28,
  'mesa-cascata-angelim-320-nova',
  'Mesa Cascata Angelim com Resina Epóxi',
  'resina-epoxi',
  'Resina Epóxi',
  '320 x 105 cm',
  'Angelim e Resina',
  15990,
  'R$ 16.990,00 em 10x',
  'R$ 18.990,00',
  'Mesa trabalhada em resina epóxi.',
  ARRAY['/fotoproduto.jpeg']
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  price = EXCLUDED.price,
  dimensions = EXCLUDED.dimensions,
  wood = EXCLUDED.wood,
  description = EXCLUDED.description,
  images = EXCLUDED.images;

