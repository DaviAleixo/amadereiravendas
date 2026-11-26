/**
 * Utilitários de formatação e parsing de moedas no formato Real Brasileiro (BRL)
 */

export function formatCurrency(value: number): string {
  if (value === undefined || value === null || isNaN(value)) {
    return 'R$ 0,00';
  }
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
}

export function formatCurrencyNumber(value: number): string {
  if (value === undefined || value === null || isNaN(value)) {
    return '0,00';
  }
  return value.toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}

/**
 * Converte string digitada ou formatada para float numérico em Reais.
 * Ex: "R$ 7.990,00" -> 7990
 * Ex: "7.990,50" -> 7990.5
 * Ex: "7990" -> 7990
 */
export function parseCurrency(value: string | number | undefined | null): number {
  if (value === undefined || value === null || value === '') return 0;
  if (typeof value === 'number') return isNaN(value) ? 0 : value;

  const clean = value.trim();
  if (clean.includes(',')) {
    const noDots = clean.replace(/[^\d,-]/g, '').replace(/\./g, '').replace(',', '.');
    const parsed = parseFloat(noDots);
    return isNaN(parsed) ? 0 : parsed;
  }

  const digitsOnly = clean.replace(/[^\d.-]/g, '');
  const parsed = parseFloat(digitsOnly);
  return isNaN(parsed) ? 0 : parsed;
}
