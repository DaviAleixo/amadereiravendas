'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function UsersRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/admin/configuracoes?tab=usuarios');
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-2 border-amber-800 border-t-transparent rounded-none animate-spin" />
        <p className="text-xs text-stone-500 font-medium tracking-wide">Redirecionando para Usuários em Configurações...</p>
      </div>
    </div>
  );
}
