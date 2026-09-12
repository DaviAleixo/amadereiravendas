import { formatCurrency } from './currency';
import type { Product } from '@/data/products';

export const DEFAULT_WHATSAPP_NUMBER = '5519984153232';
export const WHATSAPP_NUMBER = DEFAULT_WHATSAPP_NUMBER;

/**
 * Normalizes phone numbers to digits only and ensures country code 55.
 */
export function normalizeWhatsappNumber(rawNumber?: string): string {
  if (!rawNumber) return DEFAULT_WHATSAPP_NUMBER;
  const cleaned = rawNumber.replace(/\D/g, '');
  if (!cleaned) return DEFAULT_WHATSAPP_NUMBER;
  if (cleaned.length === 10 || cleaned.length === 11) {
    return `55${cleaned}`;
  }
  return cleaned;
}

/**
 * Dynamically retrieves the active WhatsApp number configured in the admin panel or defaults to the LP number.
 */
export function getActiveWhatsappNumber(): string {
  if (typeof window !== 'undefined') {
    try {
      const saved = localStorage.getItem('amadeireira_admin_settings_v1');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed?.whatsappNumber && parsed.whatsappNumber !== '5511999999999') {
          return normalizeWhatsappNumber(parsed.whatsappNumber);
        }
      }
    } catch (e) {
      // Fallback
    }
  }
  return DEFAULT_WHATSAPP_NUMBER;
}

export function productWhatsappUrl(product: Product, overrideNumber?: string) {
  const phone = overrideNumber ? normalizeWhatsappNumber(overrideNumber) : getActiveWhatsappNumber();
  const priceVal = product.livePrice?.price && product.livePrice.price > 0 ? product.livePrice.price : product.price;
  const installmentsVal = product.livePrice?.installments || product.installments;
  const message = `Olá! Tenho interesse no produto: ${product.name}. Preço à vista: ${formatCurrency(priceVal)} | Parcelado: ${installmentsVal}. Poderia me passar mais informações?`;
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

export function generalWhatsappUrl(overrideNumber?: string) {
  const phone = overrideNumber ? normalizeWhatsappNumber(overrideNumber) : getActiveWhatsappNumber();
  return `https://wa.me/${phone}?text=${encodeURIComponent('Olá! Vim pelo site da Amadeireira e gostaria de mais informações.')}`;
}
