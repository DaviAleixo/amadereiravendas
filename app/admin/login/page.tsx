'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, Mail, Eye, EyeOff, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react';
import { authService } from '@/services/userService';
import { useToast } from '@/components/admin/ToastContainer';

export default function LoginPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const [email, setEmail] = useState('admin@amadeireira.com.br');
  const [password, setPassword] = useState('admin123');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setLoading(true);

    setTimeout(() => {
      const res = authService.login(email, password);
      setLoading(false);

      if (res.success && res.user) {
        showToast('Login bem-sucedido', `Bem-vindo de volta, ${res.user.name}!`, 'success');
        router.push('/admin/dashboard');
      } else {
        setErrorMsg(res.error || 'Credenciais inválidas. Tente novamente.');
      }
    }, 800);
  };

  return (
    <div className="w-full max-w-md animate-fadeIn my-auto">
      {/* Brand Header */}
      <div className="text-center mb-8 space-y-3">
        <div className="w-16 h-16 bg-[#25170f] border border-[#c8a97e]/40 rounded-2xl mx-auto p-3 shadow-2xl flex items-center justify-center">
          <img src="/logo1.webp" alt="Amadeireira Logo" className="w-full h-auto object-contain" />
        </div>
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">Amadeireira</h1>
          <p className="text-xs text-[#c8a97e] font-bold uppercase tracking-widest mt-1">Painel Administrativo</p>
        </div>
      </div>

      {/* Login Card */}
      <div className="bg-[#18100a] border border-[#362215] rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
        <div className="border-b border-[#2d1c11] pb-4">
          <h2 className="text-lg font-extrabold text-white">Acesse sua conta</h2>
          <p className="text-xs text-[#a69685] mt-1">Informe suas credenciais para gerenciar o catálogo.</p>
        </div>

        {errorMsg && (
          <div className="p-3.5 bg-rose-950/80 border border-rose-700/60 rounded-xl text-rose-200 text-xs flex items-center gap-2.5 animate-shake">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#dcd1c4] mb-1.5">E-mail corporativo:</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#7a6a59] absolute left-3.5 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="admin@amadeireira.com.br"
                className="w-full pl-10 pr-4 py-2.5 bg-[#0f0905] border border-[#382417] rounded-xl text-sm text-stone-100 placeholder-[#5e5043] focus:ring-2 focus:ring-[#c8a97e] focus:border-[#c8a97e] focus:outline-none transition-all font-medium"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#dcd1c4] mb-1.5">Senha de acesso:</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#7a6a59] absolute left-3.5 top-3" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-10 py-2.5 bg-[#0f0905] border border-[#382417] rounded-xl text-sm text-stone-100 placeholder-[#5e5043] focus:ring-2 focus:ring-[#c8a97e] focus:border-[#c8a97e] focus:outline-none transition-all font-medium"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-[#7a6a59] hover:text-stone-200 p-1"
                aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 bg-gradient-to-r from-[#8c5b2b] to-[#a66d35] hover:from-[#754a21] hover:to-[#915e2b] text-white font-bold text-sm rounded-xl shadow-lg shadow-[#8c5b2b]/30 flex items-center justify-center gap-2 transition-all transform active:scale-[0.99] disabled:opacity-50 border border-[#c8a97e]/40"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Autenticando...</span>
              </>
            ) : (
              <>
                <span>Entrar no Painel</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Access Hint */}
        <div className="pt-2 border-t border-[#2d1c11] text-center text-[#8c7d6e] text-[11px] space-y-1">
          <p className="flex items-center justify-center gap-1.5 text-[#c8a97e]">
            <ShieldCheck className="w-3.5 h-3.5 text-[#c8a97e]" /> Acesso exclusivo para administradores Amadeireira
          </p>
        </div>
      </div>
    </div>
  );
}
