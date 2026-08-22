import { formatCurrency } from './currency'
import type { Product } from '@/data/products'

export const WHATSAPP_NUMBER = '5519984153232'

export function productWhatsappUrl(product: Product) {
  const message = `Olá! Tenho interesse no produto: ${product.name}. Preço à vista: ${formatCurrency(product.price)} | Parcelado: ${product.installments}. Poderia me passar mais informações?`
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`
}

export function generalWhatsappUrl() {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent('Olá! Vim pelo site da Amadeireira e gostaria de mais informações.')}`
}
