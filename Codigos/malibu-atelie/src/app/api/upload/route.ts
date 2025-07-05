import { NextRequest, NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import path from 'path';

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
    const filePath = path.join(process.cwd(), 'public', 'uploads', fileName);
    await writeFile(filePath, buffer);
    const url = `/uploads/${fileName}`;
    return NextResponse.json({ url });
  } catch (error) {
    console.error('Erro ao fazer upload:', error);
    return NextResponse.json({ error: 'Erro ao fazer upload' }, { status: 500 });
  }
} 