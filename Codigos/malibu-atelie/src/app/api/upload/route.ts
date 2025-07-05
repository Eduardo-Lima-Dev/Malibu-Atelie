import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(req: NextRequest) {
  console.log('=== INÍCIO DO UPLOAD ===');
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    
    console.log('Arquivo recebido:', file?.name, file?.size, file?.type);
    
    if (!file) {
      console.log('Erro: Arquivo não enviado');
      return NextResponse.json({ error: 'Arquivo não enviado' }, { status: 400 });
    }

    console.log('Verificando variáveis de ambiente...');
    console.log('SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL ? 'Definida' : 'NÃO DEFINIDA');
    console.log('SUPABASE_ANON_KEY:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Definida' : 'NÃO DEFINIDA');

    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      console.log('Erro: Variáveis de ambiente do Supabase não configuradas');
      return NextResponse.json({ error: 'Configuração do Supabase não encontrada' }, { status: 500 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const fileName = `${Date.now()}-${file.name.replace(/\s/g, '-')}`;
    
    console.log('Fazendo upload para Supabase...');
    console.log('Nome do arquivo:', fileName);
    console.log('Tamanho do buffer:', buffer.length);
    
    // Upload para o Supabase Storage
    const { data, error } = await supabase.storage
      .from('product-images')
      .upload(fileName, buffer, {
        contentType: file.type,
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      console.error('Erro no upload do Supabase:', error);
      return NextResponse.json({ 
        error: 'Erro ao fazer upload',
        details: error.message 
      }, { status: 500 });
    }

    console.log('Upload realizado com sucesso, gerando URL pública...');

    // Gerar URL pública da imagem
    const { data: urlData } = supabase.storage
      .from('product-images')
      .getPublicUrl(fileName);

    const url = urlData.publicUrl;
    
    console.log('URL pública gerada:', url);
    console.log('=== FIM DO UPLOAD (SUCESSO) ===');
    
    return NextResponse.json({ url });
  } catch (error) {
    console.error('=== ERRO NO UPLOAD ===');
    console.error('Tipo do erro:', typeof error);
    console.error('Erro completo:', error);
    console.error('Mensagem do erro:', error instanceof Error ? error.message : 'Erro sem mensagem');
    console.error('Stack trace:', error instanceof Error ? error.stack : 'Sem stack trace');
    console.error('=== FIM DO UPLOAD (ERRO) ===');
    
    return NextResponse.json({ 
      error: 'Erro ao fazer upload',
      details: error instanceof Error ? error.message : 'Erro desconhecido'
    }, { status: 500 });
  }
} 