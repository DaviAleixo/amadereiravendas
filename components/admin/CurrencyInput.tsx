'use client';

import React, { useState, useEffect, useRef } from 'react';

/**
 * Funções de formatação embutidas para evitar problemas de HMR/Turbopack
 */
function formatNumberToBrl(value: number): string {
  if (value === undefined || value === null || isNaN(value)) {
    return '0,00';
  }
  return value.toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}

function formatCurrencyFull(value: number): string {
  if (value === undefined || value === null || isNaN(value)) {
    return 'R$ 0,00';
  }
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
}

function parseRawCurrency(value: string | number | undefined | null): number {
  if (value === undefined || value === null || value === '') return 0;
  if (typeof value === 'number') return isNaN(value) ? 0 : value;

  const clean = String(value).trim();
  if (clean.includes(',')) {
    const noDots = clean.replace(/[^\d,-]/g, '').replace(/\./g, '').replace(',', '.');
    const parsed = parseFloat(noDots);
    return isNaN(parsed) ? 0 : parsed;
  }

  const digitsOnly = clean.replace(/[^\d.-]/g, '');
  const parsed = parseFloat(digitsOnly);
  return isNaN(parsed) ? 0 : parsed;
}

export interface CurrencyInputProps {
  /** Valor numérico (ex: 7990 ou 7990.50) ou string formatada (ex: "R$ 7.990,00") */
  value?: number | string;
  /** Retorna o valor numérico em reais (float) */
  onChange?: (numericVal: number) => void;
  /** Retorna a string formatada no padrão brasileiro (ex: "R$ 7.990,00" ou undefined se vazio) */
  onChangeString?: (stringVal: string | undefined) => void;
  /** Se true, permite campo vazio/apagado sem forçar 0,00 */
  allowEmpty?: boolean;
  required?: boolean;
  placeholder?: string;
  className?: string;
  variant?: 'normal' | 'live';
  id?: string;
  name?: string;
  disabled?: boolean;
  showPrefix?: boolean;
}

export function CurrencyInput({
  value,
  onChange,
  onChangeString,
  allowEmpty = false,
  required = false,
  placeholder = '0,00',
  className = '',
  variant = 'normal',
  id,
  name,
  disabled = false,
  showPrefix = true
}: CurrencyInputProps) {
  const [displayValue, setDisplayValue] = useState<string>('');
  const isFocusedRef = useRef(false);

  // Sincroniza com valor inicial ou atualizações externas
  useEffect(() => {
    if (value === undefined || value === null || value === '' || (value === 0 && allowEmpty)) {
      if (!isFocusedRef.current) {
        setDisplayValue('');
      }
    } else if (typeof value === 'number') {
      const formatted = formatNumberToBrl(value);
      if (!isFocusedRef.current || displayValue === '') {
        setDisplayValue(formatted);
      }
    } else if (typeof value === 'string') {
      const num = parseRawCurrency(value);
      if (num === 0 && allowEmpty) {
        if (!isFocusedRef.current) {
          setDisplayValue('');
        }
      } else {
        const formatted = formatNumberToBrl(num);
        if (!isFocusedRef.current || displayValue === '') {
          setDisplayValue(formatted);
        }
      }
    }
  }, [value, allowEmpty]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    const digits = raw.replace(/\D/g, '');

    if (!digits) {
      if (allowEmpty) {
        setDisplayValue('');
        onChange?.(0);
        onChangeString?.(undefined);
      } else {
        setDisplayValue('0,00');
        onChange?.(0);
        onChangeString?.(undefined);
      }
      return;
    }

    const cents = parseInt(digits, 10);
    const floatVal = cents / 100;
    const formatted = formatNumberToBrl(floatVal);
    setDisplayValue(formatted);
    onChange?.(floatVal);
    onChangeString?.(formatCurrencyFull(floatVal));
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text');
    if (!pasted) return;

    const clean = pasted.trim();
    let floatVal = 0;

    // Se o valor colado já termina com 2 casas decimais (ex: 15990,00 ou 15990.00)
    if (/[.,]\d{2}$/.test(clean)) {
      const digits = clean.replace(/\D/g, '');
      floatVal = (parseInt(digits, 10) || 0) / 100;
    } else if (/^\d+$/.test(clean)) {
      // Se colou número inteiro sem vírgula (ex: 15990 -> 15990.00)
      floatVal = parseInt(clean, 10) || 0;
    } else {
      floatVal = parseRawCurrency(clean);
    }

    if (floatVal === 0 && allowEmpty) {
      setDisplayValue('');
      onChange?.(0);
      onChangeString?.(undefined);
    } else {
      const formatted = formatNumberToBrl(floatVal);
      setDisplayValue(formatted);
      onChange?.(floatVal);
      onChangeString?.(formatCurrencyFull(floatVal));
    }
  };

  const isLive = variant === 'live';

  return (
    <div className="relative w-full">
      {showPrefix && (
        <span
          className={`absolute left-3.5 top-2.5 text-sm font-bold select-none pointer-events-none transition-colors ${
            isLive ? 'text-rose-500' : 'text-stone-400'
          }`}
        >
          R$
        </span>
      )}
      <input
        type="text"
        inputMode="numeric"
        id={id}
        name={name}
        disabled={disabled}
        required={required}
        value={displayValue}
        placeholder={placeholder}
        onChange={handleChange}
        onPaste={handlePaste}
        onFocus={() => {
          isFocusedRef.current = true;
          if (displayValue === '' && !allowEmpty) {
            setDisplayValue('0,00');
          }
        }}
        onBlur={() => {
          isFocusedRef.current = false;
          if (displayValue === '' && !allowEmpty) {
            setDisplayValue('0,00');
            onChange?.(0);
          }
        }}
        className={`w-full py-2.5 text-sm rounded-none focus:outline-none font-bold transition-all ${
          showPrefix ? 'pl-10 pr-3.5' : 'px-3.5'
        } ${
          isLive
            ? 'bg-white border border-rose-300 focus:ring-1 focus:ring-rose-500 focus:border-rose-500 text-rose-950 placeholder:text-rose-300'
            : 'bg-white border border-[#ded6c7] focus:ring-1 focus:ring-[#8c5b2b] focus:border-[#8c5b2b] text-[#17100b] placeholder:text-stone-300'
        } ${className}`}
      />
    </div>
  );
}
