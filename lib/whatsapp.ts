import { formatCurrency } from './currency'
import type { Product } from '@/data/products'

export const WHATSAPP_NUMBER = '5551999999999'

export function productWhatsappUrl(product: Product) {
  const message = `Olá! Vi a ${product.name} ${product.dimensions.split(' × ')[0]} — ${formatCurrency(product.price)} no site da Amadeireira e gostaria de saber mais.`
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`
}

export function generalWhatsappUrl() {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent('Olá! Vim pelo site da Amadeireira e gostaria de mais informações.')}`
}
