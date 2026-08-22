export type Product = {
  id: number
  slug: string
  name: string
  category: string
  categoryLabel: string
  dimensions: string
  wood: string
  price: number
  installments: string
  oldPrice?: string
  description: string
  images: string[]
}

const woodImages = [
  'https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&w=1000&q=85',
  'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1000&q=85',
  'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=1000&q=85',
]

export const products: Product[] = [
  // { id: 1, slug: 'mesa-prancha-resina-epoxi', name: 'Mesa Prancha com Resina Epóxi', category: 'resina-epoxi', categoryLabel: 'Resina Epóxi', dimensions: '247 x 90 cm', wood: 'Madeira e Resina', price: 7990, installments: '10x de R$ 899,00', description: 'Uma peça marcante que combina a beleza da madeira maciça com a elegância da resina epóxi.', images: [woodImages[0], woodImages[1]] },
  { id: 2, slug: 'mesa-cascata-angelim-500', name: 'Mesa Cascata', category: 'mesas-cascata', categoryLabel: 'Mesas Cascata', dimensions: '500 x 90 cm', wood: 'Angelim', price: 12990, installments: 'R$ 13.990,00 em 10x', description: 'Acomoda até 12 pessoas.', images: ['/mesacascatamadeiraangelim.jpeg', '/mesacascatamadeiraangelim1.jpeg', '/mesacascatamadeiraangelim2.jpeg'] },
  { id: 3, slug: 'mesa-madeira-pequia-390', name: 'Mesa Madeira Pequiá', category: 'mesas', categoryLabel: 'Mesas', dimensions: '390 x 124/140 cm', wood: 'Pequiá', price: 17000, installments: 'R$ 18.990,00 em 10x', oldPrice: 'R$ 24.990,00', description: 'Acomoda até 12 pessoas.', images: [woodImages[2], woodImages[0]] },
  { id: 5, slug: 'mesa-angelim-390', name: 'Mesa Madeira Angelim', category: 'mesas', categoryLabel: 'Mesas', dimensions: '390 x 90 cm', wood: 'Angelim', price: 12000, installments: 'R$ 12.990,00 em 10x', description: 'Acomoda até 10 pessoas.', images: [woodImages[1], woodImages[0]] },
  { id: 6, slug: 'aparador', name: 'Aparador', category: 'aparadores', categoryLabel: 'Aparadores', dimensions: '156 x 33 x 88 cm de altura', wood: 'Madeira maciça', price: 1240, installments: 'R$ 1.990,00 em 10x', description: 'Aparador elegante e funcional, perfeito para complementar salas e halls de entrada.', images: ['/aparador1.jpeg', '/aparador2.jpeg'] },
  { id: 8, slug: 'mesa-cascata-pequia-500', name: 'Mesa Cascata Pequiá', category: 'mesas-cascata', categoryLabel: 'Mesas Cascata', dimensions: '500 x 90 cm', wood: 'Pequiá', price: 12000, installments: '10x de R$ 1.399,00', oldPrice: 'R$ 17.990,00', description: 'Uma imponente mesa cascata em madeira Pequiá, com cinco metros de comprimento.', images: ['/mesacascatacadeirapequia5x0,90.PNG'] },
  { id: 9, slug: 'mesa-cascata-dupla-270', name: 'Mesa Cascata Dupla', category: 'mesas-cascata', categoryLabel: 'Mesas Cascata', dimensions: '270 x 124 cm', wood: 'Madeira maciça', price: 10000, installments: '10x de R$ 1.299,00', oldPrice: 'R$ 20.990,00', description: 'Design marcante com cascata dupla, unindo sofisticação e robustez.', images: ['/cascata-dupla.jpeg', '/cascata-dupla1.jpeg'] },
  // { id: 10, slug: 'mesa-bolacha-resina-epoxi', name: 'Mesa Bolacha com Resina Epóxi', category: 'resina-epoxi', categoryLabel: 'Resina Epóxi', dimensions: '130 x 116 cm de diâmetro', wood: 'Madeira e Resina', price: 5990, installments: '10x de R$ 690,00', oldPrice: 'R$ 9.990,00', description: 'Mesa orgânica em formato bolacha, realçada com os detalhes transparentes da resina epóxi.', images: [woodImages[1], woodImages[0]] },
  { id: 11, slug: 'base-raiz-aroeira', name: 'Base Raiz Aroeira', category: 'bases', categoryLabel: 'Bases', dimensions: 'Vidro de até 200 cm', wood: 'Aroeira', price: 15000, installments: '10x de R$ 1.699,00', oldPrice: 'R$ 19.990,00', description: 'Base orgânica esculpida pelas formas naturais da raiz de Aroeira. Ideal para tampos de vidro.', images: ['/baseraizaroeira.jpeg', '/baseraizaroeira1.jpeg', '/baseraizaroeira2.jpeg', '/baseraizaroeira3.jpeg', '/baseraizaroeira4.jpeg'] },
  // { id: 12, slug: 'base-raiz-organica', name: 'Base Raiz Orgânica', category: 'bases', categoryLabel: 'Bases', dimensions: 'Vidro bisotê 10 mm / 200 cm', wood: 'Madeira orgânica', price: 25000, installments: '10x de R$ 2.699,00', oldPrice: 'R$ 35.990,00', description: 'Escultura natural imponente, suportando um espaçoso tampo de vidro bisotê.', images: [woodImages[2], woodImages[1]] },
  { id: 13, slug: 'mesa-cascata-angelim-epoxi-240', name: 'Mesa Cascata Angelim com Resina Epóxi', category: 'resina-epoxi', categoryLabel: 'Resina Epóxi', dimensions: '240 x 105 cm', wood: 'Angelim e Resina', price: 15990, installments: 'R$ 16.990,00 em 10x', oldPrice: 'R$ 18.990,00', description: 'Mesa trabalhada em resina epóxi com a beleza do Angelim e formato cascata.', images: ['/mesacascataangelimresinaepoxi 240x105.jpeg', '/mesacascataangelim240x105resinaepoxi.jpeg', '/mesacascataangelim240x105resinaepoxi1.jpeg', '/mesacascataangelim240x105resinaepoxi2.jpeg', '/mesacascataangelim240x105resinaepoxi23.jpeg'] },
  { id: 14, slug: 'cadeira-italia', name: 'Cadeira Itália', category: 'cadeiras', categoryLabel: 'Cadeiras', dimensions: 'Padrão', wood: 'Madeira maciça', price: 1200, installments: 'R$ 1.290,00 em 10x', oldPrice: 'R$ 1.790,00', description: 'Design clássico e conforto. Cor a escolha do cliente.', images: ['/cadeiraitaliacores.jpeg'] },
  { id: 15, slug: 'base-raiz-teca', name: 'Base Raiz em Madeira Teca', category: 'bases', categoryLabel: 'Bases', dimensions: 'Vidro bisotê 10 mm e 2 metros de diâmetro', wood: 'Teca', price: 25000, installments: 'R$ 26.990,00 em 10x', oldPrice: 'R$ 29.990,00', description: 'A nobreza da madeira Teca modelada organicamente em uma base única.', images: ['/baseraizmadeiratecacomvidrobisote10mmx2m.jpeg', '/baseraizmadeiratecacomvidrobisote10mmx2m-foto2..jpeg', '/baseraizmadeiratecacomvidrobisote10mmx2m-foto3.jpeg'] },
  { id: 16, slug: 'mesa-base-cumaru', name: 'Mesa Base Cumaru', category: 'bases', categoryLabel: 'Bases', dimensions: '240 x 125 cm', wood: 'Cumaru', price: 7000, installments: 'R$ 7.990,00 em 10x', oldPrice: 'R$ 9.990,00', description: 'Mesa robusta e elegante com base em Cumaru.', images: ['/mesabasecumaru.jpeg', '/mesabasecuaru2.jpeg', '/mesabasecumaru3.jpeg'] },
  { id: 17, slug: 'cadeira-faby-com-braco', name: 'Cadeira Faby com Braço', category: 'cadeiras', categoryLabel: 'Cadeiras', dimensions: 'Padrão', wood: 'Madeira maciça', price: 1290, installments: 'R$ 1.390,00 em 10x', oldPrice: 'R$ 1.790,00', description: 'Cadeira de design confortável, com apoio para os braços.', images: ['/cadeirafabycombraco.jpeg'] },
  { id: 18, slug: 'cadeira-ester', name: 'Cadeira Ester', category: 'cadeiras', categoryLabel: 'Cadeiras', dimensions: 'Padrão', wood: 'Madeira maciça', price: 990, installments: 'R$ 1.190,00 em 10x', oldPrice: 'R$ 1.290,00', description: 'Cadeira minimalista e elegante para salas de jantar.', images: ['/cadeiraester.jpeg'] },
  { id: 19, slug: 'cadeira-faby-sem-braco', name: 'Cadeira Faby sem Braço', category: 'cadeiras', categoryLabel: 'Cadeiras', dimensions: 'Padrão', wood: 'Madeira maciça', price: 1190, installments: 'R$ 1.290,00 em 10x', oldPrice: 'R$ 1.590,00', description: 'Cadeira Faby, versão sem braços para maior versatilidade de espaço.', images: ['/cadeirafabysembraco.jpeg'] },
  { id: 20, slug: 'mesa-bolacha-pequia', name: 'Mesa Bolacha — Madeira Pequiá', category: 'mesas', categoryLabel: 'Mesas', dimensions: '1 metro de diâmetro', wood: 'Pequiá', price: 2990, installments: 'R$ 3.990,00 em 10x', description: 'Mesa bolacha em madeira Pequiá com pés de aço preto.', images: ['/mesabolachamadeirapequiapespreto.jpeg', '/mesabolachamadeirapequiapespreto1.jpeg'] },
  { id: 21, slug: 'mesa-prancha-pequia', name: 'Mesa Prancha', category: 'mesas', categoryLabel: 'Mesas', dimensions: '157 x 62', wood: 'Pequiá', price: 1990, installments: 'R$ 2.490 em 10x', description: 'Mesa prancha em madeira Pequiá.', images: ['/mesapranchamadeirapequia.jpeg'] },
  { id: 22, slug: 'mesa-bolacha-pequia-153', name: 'Mesa Bolacha — Madeira Pequiá', category: 'mesas', categoryLabel: 'Mesas', dimensions: '1,53 m de diâmetro', wood: 'Pequiá', price: 6990, installments: 'R$ 7.990,00 em 10x', description: 'Mesa bolacha em madeira Pequiá com pés de aço trabalhados pretos.', images: ['/mesabolachamadeirapequia.jpeg', '/mesabolachamadeirapequia2.jpeg'] },
  { id: 23, slug: 'mesa-de-centro-pequia', name: 'Mesa de Centro', category: 'mesas', categoryLabel: 'Mesas', dimensions: '107 x 78 cm', wood: 'Pequiá', price: 1490, installments: 'R$ 2.490,00 parcelado', description: 'Mesa de centro em madeira Pequiá com pés de aço preto.', images: ['/mesadecentropequia.jpeg'] },
]

export const categories = ['Todos', 'Mesas Cascata', 'Mesas', 'Resina Epóxi', 'Bases', 'Cadeiras', 'Aparadores']

export function formatCategory(category: string) {
  return category === 'Todos' ? 'todos' : category.toLowerCase().replaceAll(' ', '-').normalize("NFD").replace(/[\u0300-\u036f]/g, "")
}

