import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(req: NextRequest) {
  console.log('Recebido upload');
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json({ error: 'Arquivo não enviado' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const fileName = `${Date.now()}-${file.name.replace(/\s/g, '-')}`;
    
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
      return NextResponse.json({ error: 'Erro ao fazer upload' }, { status: 500 });
    }

    // Gerar URL pública da imagem
    const { data: urlData } = supabase.storage
      .from('product-images')
      .getPublicUrl(fileName);

    const url = urlData.publicUrl;
    
    console.log('Upload realizado com sucesso:', url);
    return NextResponse.json({ url });
  } catch (error) {
    console.error('Erro ao fazer upload:', error);
    return NextResponse.json({ error: 'Erro ao fazer upload' }, { status: 500 });
  }
} 