import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // Executa uma consulta leve no banco de dados para registrar atividade e evitar pausa no Supabase
    const { data, error } = await supabase
      .from('categories')
      .select('id')
      .limit(1);

    if (error) {
      console.warn('Keep-alive Supabase warning:', error.message);
      return NextResponse.json(
        {
          success: false,
          message: 'Falha ao consultar banco',
          error: error.message,
          timestamp: new Date().toISOString()
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Supabase mantido ativo com sucesso!',
      recordsChecked: data?.length ?? 0,
      timestamp: new Date().toISOString()
    });
  } catch (err: any) {
    return NextResponse.json(
      {
        success: false,
        error: err?.message || 'Erro interno no keep-alive',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}
