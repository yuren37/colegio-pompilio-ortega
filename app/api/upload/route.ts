// app/api/upload/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ 
        success: false,
        error: 'No se proporcionó ningún archivo' 
      }, { status: 400 });
    }

    // Validar tipo de archivo
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ 
        success: false,
        error: 'Tipo de archivo no permitido. Solo se permiten: JPEG, PNG, WEBP, GIF' 
      }, { status: 400 });
    }

    // Validar tamaño (max 5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json({ 
        success: false,
        error: 'Archivo demasiado grande. Tamaño máximo: 5MB' 
      }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Crear directorio si no existe
    const uploadsDir = join(process.cwd(), 'public/uploads');
    try {
      await mkdir(uploadsDir, { recursive: true });
    } catch (error) {
      console.log('El directorio uploads ya existe');
    }

    // Generar nombre único
    const fileExtension = file.name.split('.').pop();
    const fileName = `${uuidv4()}.${fileExtension}`;
    const filePath = join(uploadsDir, fileName);

    // Guardar archivo
    await writeFile(filePath, buffer);

    // Devolver URL pública
    const publicUrl = `/uploads/${fileName}`;

    return NextResponse.json({ 
      success: true, 
      url: publicUrl,
      fileName: file.name
    }, { status: 200 });

  } catch (error) {
    console.error('Error en upload:', error);
    return NextResponse.json({ 
      success: false,
      error: 'Error interno del servidor al subir el archivo' 
    }, { status: 500 });
  }
}