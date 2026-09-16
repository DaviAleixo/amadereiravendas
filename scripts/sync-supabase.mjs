import { createClient } from '@supabase/supabase-js';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const supabaseUrl = 'https://mbpkdmswzhyibmrlhadi.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1icGtkbXN3emh5aWJtcmxoYWRpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODk1MDkxMTEsImV4cCI6MjEwNTA4NTExMX0.tYmZ-lWFjpoIeuNCFVjw51PgIxwBaTh_5WadiyfjlT0';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function run() {
  console.log('--- Ingressando dados no Supabase de Vitor ---');

  // 1. Upload public images to storage bucket 'products'
  const publicDir = path.join(rootDir, 'public');
  const files = await fs.readdir(publicDir);
  const imageFiles = files.filter(f => /\.(jpe?g|png|webp|gif)$/i.test(f));

  console.log(`Encontradas ${imageFiles.length} imagens em public/. Iniciando upload para storage 'products'...`);

  const urlMap = {};

  for (const filename of imageFiles) {
    try {
      const filePath = path.join(publicDir, filename);
      const fileBuffer = await fs.readFile(filePath);
      
      const ext = path.extname(filename).toLowerCase();
      let contentType = 'image/jpeg';
      if (ext === '.png') contentType = 'image/png';
      else if (ext === '.webp') contentType = 'image/webp';
      else if (ext === '.gif') contentType = 'image/gif';

      const sanitizedFilename = filename.trim().replace(/\s+/g, '_');
      
      const { data, error } = await supabase.storage
        .from('products')
        .upload(sanitizedFilename, fileBuffer, {
          contentType,
          upsert: true
        });

      if (error) {
        console.warn(`Aviso ao enviar ${filename}:`, error.message);
      } else {
        const { data: publicUrlData } = supabase.storage
          .from('products')
          .getPublicUrl(sanitizedFilename);

        urlMap[filename] = publicUrlData.publicUrl;
        urlMap['/' + filename] = publicUrlData.publicUrl;
      }
    } catch (err) {
      console.error(`Erro ao processar imagem ${filename}:`, err);
    }
  }

  console.log('Upload de imagens concluído. Mapeamento pronto.');

  // 2. Import initial categories, products, settings, users
  const mockDataFile = await fs.readFile(path.join(rootDir, 'data', 'mockAdminData.ts'), 'utf-8');
  
  // Extract categories
  const categories = [
    { id: 'mesas-cascata', name: 'Mesas Cascata', description: 'Mesas exclusivas com efeito de cascata contínua', active: true, order: 1 },
    { id: 'mesas', name: 'Mesas', description: 'Mesas maciças retangulares e orgânicas', active: true, order: 2 },
    { id: 'pranchas', name: 'Pranchas', description: 'Tampos em prancha única de madeira maciça', active: true, order: 3 },
    { id: 'resina-epoxi', name: 'Resina Epóxi', description: 'Peças exclusivas combinando madeira e resina epóxi cristalina', active: true, order: 4 },
    { id: 'bases', name: 'Bases', description: 'Bases esculpidas e raízes ornamentais', active: true, order: 5 },
    { id: 'cadeiras', name: 'Cadeiras', description: 'Cadeiras de jantar em madeira nobre e design ergonômico', active: true, order: 6 },
    { id: 'aparadores', name: 'Aparadores', description: 'Aparadores sofisticados para hall e salas', active: true, order: 7 }
  ];

  console.log('Inserindo categorias...');
  const { error: catErr } = await supabase.from('categories').upsert(categories);
  if (catErr) console.error('Erro categorias:', catErr);
  else console.log('Categorias inseridas com sucesso!');

  // Extract products
  const products = [
    {
      id: 1,
      slug: 'mesa-prancha-resina-epoxi',
      name: 'Mesa Prancha com Resina Epóxi',
      category: 'pranchas',
      category_label: 'Pranchas',
      dimensions: '247 x 90 cm',
      wood: 'Madeira e Resina',
      description: 'Uma peça marcante que combina a beleza da madeira maciça com a elegância da resina epóxi.',
      images: ['/prancharesina.jpeg'],
      active: true,
      normal_price: { price: 7990, installments: '10x de R$ 899,00' },
      live_price: { price: 6990, installments: '10x de R$ 799,00', oldPrice: 'R$ 7.990,00' }
    },
    {
      id: 2,
      slug: 'mesa-cascata-angelim-500',
      name: 'Mesa Cascata Angelim',
      category: 'mesas-cascata',
      category_label: 'Mesas Cascata',
      dimensions: '500 x 90 cm',
      wood: 'Angelim',
      description: 'Acomoda até 12 pessoas.',
      images: ['/mesacascatamadeiraangelim.jpeg', '/mesacascatamadeiraangelim1.jpeg', '/mesacascatamadeiraangelim2.jpeg'],
      active: true,
      normal_price: { price: 12990, installments: 'R$ 13.990,00 em 10x' },
      live_price: { price: 11490, installments: '10x de R$ 1.249,00', oldPrice: 'R$ 12.990,00' }
    },
    {
      id: 3,
      slug: 'mesa-cascata-pequia-340',
      name: 'Mesa Cascata Pequiá',
      category: 'mesas-cascata',
      category_label: 'Mesas Cascata',
      dimensions: '340 x 122 cm',
      wood: 'Pequiá',
      description: 'Mesa cascata em madeira Pequiá.',
      images: ['/mesacascatapequia.jpeg'],
      active: true,
      normal_price: { price: 15990, installments: 'R$ 16.990,00 parcelado' }
    },
    {
      id: 5,
      slug: 'mesa-angelim-390',
      name: 'Mesa Madeira Angelim',
      category: 'mesas',
      category_label: 'Mesas',
      dimensions: '390 x 90 cm',
      wood: 'Angelim',
      description: 'Acomoda até 10 pessoas.',
      images: ['/mesamadeiraangelim1.jpeg'],
      active: true,
      normal_price: { price: 12000, installments: 'R$ 12.990,00 em 10x' }
    },
    {
      id: 6,
      slug: 'aparador',
      name: 'Aparador',
      category: 'aparadores',
      category_label: 'Aparadores',
      dimensions: '156 x 33 x 88 cm de altura',
      wood: 'Madeira maciça',
      description: 'Aparador elegante e funcional, perfeito para complementar salas e halls de entrada.',
      images: ['/aparador1.jpeg', '/aparador2.jpeg'],
      active: true,
      normal_price: { price: 1240, installments: 'R$ 1.990,00 em 10x' }
    },
    {
      id: 8,
      slug: 'mesa-cascata-pequia-390',
      name: 'Mesa Cascata Pequiá',
      category: 'mesas-cascata',
      category_label: 'Mesas Cascata',
      dimensions: '390 x 124/140 cm',
      wood: 'Pequiá',
      description: 'Acomoda até 12 pessoas.',
      images: ['/mesacascatacadeirapequia5x0,90.PNG'],
      active: true,
      normal_price: { price: 12000, installments: 'R$ 12.990,00 em 10x', oldPrice: 'R$ 24.990,00' },
      live_price: { price: 9990, installments: '10x de R$ 1.099,00', oldPrice: 'R$ 12.000,00' }
    },
    {
      id: 9,
      slug: 'mesa-cascata-dupla-270',
      name: 'Mesa Cascata Dupla',
      category: 'mesas-cascata',
      category_label: 'Mesas Cascata',
      dimensions: '270 x 124 cm',
      wood: 'Madeira maciça',
      description: 'Design marcante com cascata dupla, unindo sofisticação e robustez.',
      images: ['/cascata-dupla.jpeg', '/cascata-dupla1.jpeg'],
      active: true,
      normal_price: { price: 10000, installments: '10x de R$ 1.299,00', oldPrice: 'R$ 20.990,00' }
    },
    {
      id: 10,
      slug: 'mesa-bolacha-resina-epoxi',
      name: 'Mesa Bolacha com Resina Epóxi',
      category: 'resina-epoxi',
      category_label: 'Resina Epóxi',
      dimensions: '130 x 116 cm de diâmetro',
      wood: 'Madeira e Resina',
      description: 'Mesa orgânica em formato bolacha, realçada com os detalhes transparentes da resina epóxi.',
      images: ['/mesabolacharesinaepoxi.jpeg', '/mesabolacharesinaepoxi1.jpeg', '/mesabolacharesinaepoxi2.jpeg'],
      active: true,
      normal_price: { price: 5990, installments: '10x de R$ 690,00', oldPrice: 'R$ 9.990,00' }
    },
    {
      id: 11,
      slug: 'base-raiz-aroeira',
      name: 'Base Raiz Aroeira',
      category: 'bases',
      category_label: 'Bases',
      dimensions: 'Vidro de até 200 cm',
      wood: 'Aroeira',
      description: 'Base orgânica esculpida pelas formas naturais da raiz de Aroeira. Ideal para tampos de vidro.',
      images: ['/baseraizaroeira.jpeg', '/baseraizaroeira1.jpeg', '/baseraizaroeira2.jpeg', '/baseraizaroeira3.jpeg', '/baseraizaroeira4.jpeg'],
      active: true,
      normal_price: { price: 15000, installments: '10x de R$ 1.699,00', oldPrice: 'R$ 19.990,00' }
    },
    {
      id: 13,
      slug: 'mesa-cascata-angelim-epoxi-320',
      name: 'Mesa Cascata Angelim com Resina Epóxi',
      category: 'resina-epoxi',
      category_label: 'Resina Epóxi',
      dimensions: '320 x 105 cm',
      wood: 'Angelim e Resina',
      description: 'Mesa trabalhada em resina epóxi com a beleza do Angelim e formato cascata.',
      images: ['/mesacascataangelimresinaepoxi 240x105.jpeg', '/mesacascataangelim240x105resinaepoxi.jpeg', '/mesacascataangelim240x105resinaepoxi1.jpeg', '/mesacascataangelim240x105resinaepoxi2.jpeg'],
      active: true,
      normal_price: { price: 15000, installments: 'R$ 15.990,00 em 10x', oldPrice: 'R$ 18.990,00' }
    },
    {
      id: 14,
      slug: 'cadeira-italia',
      name: 'Cadeira Itália (Cor à escolha)',
      category: 'cadeiras',
      category_label: 'Cadeiras',
      dimensions: 'Padrão',
      wood: 'Madeira maciça',
      description: 'Design clássico e conforto. IMPORTANTE: A COR É FEITA SOB ENCOMENDA, À ESCOLHA DO CLIENTE.',
      images: ['/cadeiraitaliacores.jpeg'],
      active: true,
      normal_price: { price: 1200, installments: 'R$ 1.290,00 em 10x', oldPrice: 'R$ 1.790,00' }
    },
    {
      id: 15,
      slug: 'base-raiz-teca',
      name: 'Base Raiz em Madeira Teca',
      category: 'bases',
      category_label: 'Bases',
      dimensions: 'Vidro bisotê 10 mm e 2 metros de diâmetro',
      wood: 'Teca',
      description: 'A nobreza da madeira Teca modelada organicamente em uma base única.',
      images: ['/baseraizmadeiratecacomvidrobisote10mmx2m.jpeg', '/baseraizmadeiratecacomvidrobisote10mmx2m-foto2..jpeg', '/baseraizmadeiratecacomvidrobisote10mmx2m-foto3.jpeg'],
      active: true,
      normal_price: { price: 25000, installments: 'R$ 26.990,00 em 10x', oldPrice: 'R$ 29.990,00' }
    },
    {
      id: 16,
      slug: 'mesa-base-cumaru',
      name: 'Mesa Base Cumaru',
      category: 'bases',
      category_label: 'Bases',
      dimensions: '240 x 125 cm',
      wood: 'Cumaru',
      description: 'Mesa robusta e elegante com base em Cumaru.',
      images: ['/mesabasecumaru.jpeg', '/mesabasecuaru2.jpeg', '/mesabasecumaru3.jpeg'],
      active: true,
      normal_price: { price: 7000, installments: 'R$ 7.990,00 em 10x', oldPrice: 'R$ 9.990,00' }
    },
    {
      id: 17,
      slug: 'cadeira-faby-com-braco',
      name: 'Cadeira Faby com Braço',
      category: 'cadeiras',
      category_label: 'Cadeiras',
      dimensions: 'Padrão',
      wood: 'Madeira maciça',
      description: 'Cadeira de design confortável, com apoio para os braços.',
      images: ['/cadeirafabycombraco.jpeg'],
      active: true,
      normal_price: { price: 1290, installments: 'R$ 1.390,00 em 10x', oldPrice: 'R$ 1.790,00' }
    },
    {
      id: 18,
      slug: 'cadeira-ester',
      name: 'Cadeira Ester',
      category: 'cadeiras',
      category_label: 'Cadeiras',
      dimensions: 'Padrão',
      wood: 'Madeira maciça',
      description: 'Cadeira minimalista e elegante para salas de jantar.',
      images: ['/cadeiraester.jpeg'],
      active: true,
      normal_price: { price: 990, installments: 'R$ 1.190,00 em 10x', oldPrice: 'R$ 1.290,00' }
    },
    {
      id: 19,
      slug: 'cadeira-faby-sem-braco',
      name: 'Cadeira Faby sem Braço',
      category: 'cadeiras',
      category_label: 'Cadeiras',
      dimensions: 'Padrão',
      wood: 'Madeira maciça',
      description: 'Cadeira Faby, versão sem braços para maior versatilidade de espaço.',
      images: ['/cadeirafabysembraco.jpeg'],
      active: true,
      normal_price: { price: 1190, installments: 'R$ 1.290,00 em 10x', oldPrice: 'R$ 1.590,00' }
    },
    {
      id: 20,
      slug: 'mesa-bolacha-pequia',
      name: 'Mesa Bolacha — Madeira Pequiá',
      category: 'mesas',
      category_label: 'Mesas',
      dimensions: '1 metro de diâmetro',
      wood: 'Pequiá',
      description: 'Mesa bolacha em madeira Pequiá com pés de aço preto.',
      images: ['/mesabolachamadeirapequiapespreto.jpeg', '/mesabolachamadeirapequiapespreto1.jpeg'],
      active: true,
      normal_price: { price: 2990, installments: 'R$ 3.990,00 em 10x' }
    },
    {
      id: 21,
      slug: 'mesa-prancha-pequia',
      name: 'Mesa Prancha',
      category: 'pranchas',
      category_label: 'Pranchas',
      dimensions: '157 x 62',
      wood: 'Pequiá',
      description: 'Mesa prancha em madeira Pequiá.',
      images: ['/mesapranchamadeirapequia.jpeg'],
      active: true,
      normal_price: { price: 1990, installments: 'R$ 2.490 em 10x' }
    },
    {
      id: 22,
      slug: 'mesa-bolacha-pequia-153',
      name: 'Mesa Bolacha — Madeira Pequiá',
      category: 'mesas',
      category_label: 'Mesas',
      dimensions: '1,53 m de diâmetro',
      wood: 'Pequiá',
      description: 'Mesa bolacha em madeira Pequiá com pés de aço trabalhados pretos.',
      images: ['/mesabolachamadeirapequia-em-pe.jpeg', '/mesabolachamadeirapequia2.jpeg'],
      active: true,
      normal_price: { price: 6990, installments: 'R$ 7.990,00 em 10x' }
    },
    {
      id: 23,
      slug: 'mesa-de-centro-pequia',
      name: 'Mesa de Centro',
      category: 'mesas',
      category_label: 'Mesas',
      dimensions: '107 x 78 cm',
      wood: 'Pequiá',
      description: 'Mesa de centro em madeira Pequiá com pés de aço preto.',
      images: ['/mesadecentropequia.jpeg'],
      active: true,
      normal_price: { price: 1490, installments: 'R$ 2.490,00 parcelado' }
    },
    {
      id: 24,
      slug: 'mesa-cascata-angelim-310',
      name: 'Mesa Cascata Angelim',
      category: 'resina-epoxi',
      category_label: 'Resina Epóxi',
      dimensions: '310 x 105 cm',
      wood: 'Angelim',
      description: 'Mesa cascata em madeira Angelim trabalhada em resina epóxi.',
      images: ['/mesacascataangelim310X105.jpeg', '/mesacascataangelim 310X105foto-2.jpeg', '/mesacascataangelim 310X105foto3.jpeg'],
      active: true,
      normal_price: { price: 15990, installments: 'R$ 16.990,00 em 10x', oldPrice: 'R$ 18.990,00' }
    },
    {
      id: 25,
      slug: 'mesa-pequia-preto',
      name: 'Mesa Cascata Pequiá Preto',
      category: 'mesas-cascata',
      category_label: 'Mesas Cascata',
      dimensions: '360 x 87/84 cm',
      wood: 'Pequiá Preto',
      description: 'Acomoda até 8 pessoas. Madeira de tonalidade marcante e alta durabilidade.',
      images: ['/pequiapreto.jpeg'],
      active: true,
      normal_price: { price: 12000, installments: '10x de R$ 1.299,00' }
    },
    {
      id: 26,
      slug: 'aparador-142',
      name: 'Aparador',
      category: 'aparadores',
      category_label: 'Aparadores',
      dimensions: '142 x 60 x 89 cm de altura',
      wood: 'Madeira maciça',
      description: 'Aparador elegante em madeira maciça.',
      images: ['/aparador142x60x89.jpeg', '/aparador142x60x89foto2.jpeg', '/aparador142x60x89foto3.jpeg'],
      active: true,
      normal_price: { price: 2450, installments: 'R$ 2.990,00 em 10x' }
    },
    {
      id: 27,
      slug: 'aparador-organico',
      name: 'Aparador Orgânico',
      category: 'aparadores',
      category_label: 'Aparadores',
      dimensions: '200 x 80 cm',
      wood: 'Madeira maciça',
      description: 'Aparador orgânico com design elegante.',
      images: ['/aparadororganico.jpeg'],
      active: true,
      normal_price: { price: 18000, installments: 'R$ 18.990,00 em 10x', oldPrice: 'R$ 24.990,00' }
    },
    {
      id: 28,
      slug: 'mesa-cascata-angelim-320-nova',
      name: 'Mesa Cascata Angelim com Resina Epóxi',
      category: 'resina-epoxi',
      category_label: 'Resina Epóxi',
      dimensions: '320 x 105 cm',
      wood: 'Angelim e Resina',
      description: 'Mesa trabalhada em resina epóxi.',
      images: ['/fotoproduto.jpeg'],
      active: true,
      normal_price: { price: 15990, installments: 'R$ 16.990,00 em 10x', oldPrice: 'R$ 18.990,00' }
    }
  ];

  // Map image URLs to Supabase public storage URLs if present
  const mappedProducts = products.map(p => ({
    ...p,
    images: p.images.map(img => urlMap[img] || urlMap[img.replace(/^\//, '')] || img)
  }));

  console.log(`Inserindo ${mappedProducts.length} produtos com referências para o Storage...`);
  const { error: prodErr } = await supabase.from('products').upsert(mappedProducts);
  if (prodErr) console.error('Erro produtos:', prodErr);
  else console.log('Produtos inseridos com sucesso!');

  // Settings
  const settings = {
    id: 'catalog_settings',
    live_mode: false,
    show_promotion_banner: true,
    promotion_banner_text: '🔴 Catálogo Especial — Live Shop 22/Ago',
    promotion_button_text: 'Ver Peças em Destaque',
    promotion_link: '#produtos',
    catalog_title: 'Amadeireira — Painel de Gestão',
    whatsapp_number: '5519984153232'
  };

  console.log('Inserindo configurações...');
  const { error: setErr } = await supabase.from('settings').upsert(settings);
  if (setErr) console.error('Erro configurações:', setErr);
  else console.log('Configurações inseridas com sucesso!');

  // Users
  const users = [
    {
      id: 'usr-1',
      name: 'Administrador Amadeireira',
      email: 'admin@amadeireira.com.br',
      role: 'ADMINISTRADOR',
      active: true,
      allowed_tabs: ['dashboard', 'produtos', 'categorias', 'live', 'usuarios', 'configuracoes'],
      last_activity: 'Agora mesmo',
      created_at: new Date().toISOString()
    },
    {
      id: 'usr-2',
      name: 'Editor Catálogo',
      email: 'editor@amadeireira.com.br',
      role: 'EDITOR',
      active: true,
      allowed_tabs: ['dashboard', 'produtos', 'categorias'],
      last_activity: 'Há 2 horas',
      created_at: new Date().toISOString()
    }
  ];

  console.log('Inserindo usuários...');
  const { error: usrErr } = await supabase.from('admin_users').upsert(users);
  if (usrErr) console.error('Erro usuários:', usrErr);
  else console.log('Usuários inseridos com sucesso!');

  console.log('--- Processo finalizado com sucesso no Supabase do Vitor! ---');
}

run().catch(console.error);
