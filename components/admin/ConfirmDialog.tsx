'use client';

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AlertTriangle, X } from 'lucide-react';

type ConfirmDialogProps = {
  isOpen: boolean;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'info';
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({
  isOpen,
  title,
  description,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  variant = 'danger',
  onConfirm,
  onCancel
}: ConfirmDialogProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9990] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-[#090604]/75 backdrop-blur-sm"
            onClick={onCancel}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10 bg-white rounded-none max-w-md w-full p-6 shadow-2xl border border-[#ded6c7] space-y-4"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className={`p-2.5 rounded-none ${
                  variant === 'danger' ? 'bg-rose-50 text-rose-700 border border-rose-200' : 'bg-amber-50 text-amber-800 border border-amber-200'
                }`}>
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-[#17100b] tracking-tight">{title}</h3>
                  <p className="text-xs text-[#736557] mt-0.5 leading-relaxed">{description}</p>
                </div>
              </div>
              <button
                onClick={onCancel}
                className="text-stone-400 hover:text-stone-700 p-1.5 rounded-none hover:bg-stone-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-[#f0e9dd]">
              <motion.button
                type="button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onCancel}
                className="px-4 py-2 text-xs font-bold text-[#5c4a3b] bg-[#f7f3eb] hover:bg-[#ede3d3] border border-[#ded6c7] rounded-none transition-colors uppercase tracking-wider"
              >
                {cancelText}
              </motion.button>
              <motion.button
                type="button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onConfirm}
                className={`px-5 py-2 text-xs font-bold text-white rounded-none shadow-sm transition-all uppercase tracking-wider ${
                  variant === 'danger'
                    ? 'bg-rose-700 hover:bg-rose-800 shadow-rose-900/20'
                    : 'bg-[#8c5b2b] hover:bg-[#a66d35] shadow-[#8c5b2b]/20'
                }`}
              >
                {confirmText}
              </motion.button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
