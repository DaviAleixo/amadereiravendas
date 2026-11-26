import { formatCurrency } from './currency';

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
 * Formata número de WhatsApp no padrão visual brasileiro com máscara (+55 (DDD) 9XXXX-XXXX)
 */
export function formatWhatsappDisplay(val?: string): string {
  if (!val) return '';
  let digits = val.replace(/\D/g, '');
  if (!digits) return '';

  // Remove o DDI 55 se o usuário digitar ou se vier do banco com 55
  if (digits.startsWith('55') && digits.length > 2) {
    digits = digits.slice(2);
  }

  // Limita a no máximo 11 dígitos (DDD + 9 dígitos)
  digits = digits.slice(0, 11);

  if (digits.length === 0) return '';
  if (digits.length <= 2) {
    return `+55 (${digits}`;
  }
  if (digits.length <= 6) {
    return `+55 (${digits.slice(0, 2)}) ${digits.slice(2)}`;
  }
  if (digits.length <= 10) {
    const isLandline = digits[2] !== '9';
    if (isLandline && digits.length === 10) {
      return `+55 (${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
    }
    return `+55 (${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
  }
  return `+55 (${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7, 11)}`;
}

/**
 * Limpa e garante formato canônico apenas dígitos com DDI 55 para salvar no banco
 */
export function cleanWhatsappDigits(val?: string): string {
  if (!val) return '';
  const digits = val.replace(/\D/g, '');
  if (!digits) return '';
  if (digits.length === 10 || digits.length === 11) {
    return `55${digits}`;
  }
  return digits;
}

/**
 * Dynamically retrieves the active WhatsApp number configured in the admin panel or defaults to the LP number.
 */
export function getActiveWhatsappNumber(): string {
  if (typeof window !== 'undefined') {
    try {
      const saved = localStorage.getItem('amadeireira_admin_settings_v1') || localStorage.getItem('amadeireira_admin_settings_v2');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed?.whatsappNumber) {
          return normalizeWhatsappNumber(parsed.whatsappNumber);
        }
      }
    } catch (e) {
      // Fallback
    }
  }
  return DEFAULT_WHATSAPP_NUMBER;
}

export function productWhatsappUrl(product: any, overrideNumber?: string, isLiveMode?: boolean) {
  if (!product) return generalWhatsappUrl(overrideNumber);

  const phone = overrideNumber ? normalizeWhatsappNumber(overrideNumber) : getActiveWhatsappNumber();
  
  // Resolve active price group whether liveMode is on or product has normalPrice/livePrice
  const hasLivePrice = Boolean(product.livePrice && product.livePrice.price && Number(product.livePrice.price) > 0);
  const useLive = isLiveMode !== undefined ? (isLiveMode && hasLivePrice) : hasLivePrice;
  const priceGroup = useLive ? product.livePrice : (product.normalPrice || product);

  let rawPrice = priceGroup?.price ?? product?.price ?? product?.normalPrice?.price ?? 0;
  let numPrice = 0;
  if (typeof rawPrice === 'number') {
    numPrice = isNaN(rawPrice) ? 0 : rawPrice;
  } else if (typeof rawPrice === 'string') {
    const parsed = parseFloat(rawPrice.replace(/[^\d.-]/g, ''));
    numPrice = isNaN(parsed) ? 0 : parsed;
  }

  const installmentsVal = (priceGroup?.installments || product?.installments || product?.normalPrice?.installments || '').trim();
  const priceFormatted = numPrice > 0 ? formatCurrency(numPrice) : '';

  // Compose clean price info without NaN
  let priceDetails = '';
  if (priceFormatted && installmentsVal) {
    priceDetails = `Preço à vista: ${priceFormatted} | Parcelado: ${installmentsVal}`;
  } else if (priceFormatted) {
    priceDetails = `Preço à vista: ${priceFormatted}`;
  } else if (installmentsVal) {
    priceDetails = `Condições: ${installmentsVal}`;
  }

  let message = `Olá! Tenho interesse no produto: *${product.name || 'Móvel Amadeireira'}*`;
  if (priceDetails) {
    message += `\n${priceDetails}`;
  }
  if (product.wood) {
    message += `\nMadeira: ${product.wood}`;
  }
  if (product.dimensions) {
    message += `\nMedidas: ${product.dimensions}`;
  }
  message += `\n\nPoderia me passar mais informações?`;

  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

export function generalWhatsappUrl(overrideNumber?: string) {
  const phone = overrideNumber ? normalizeWhatsappNumber(overrideNumber) : getActiveWhatsappNumber();
  return `https://wa.me/${phone}?text=${encodeURIComponent('Olá! Vim pelo site da Amadeireira e gostaria de mais informações.')}`;
}
