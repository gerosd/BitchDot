import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';

export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const file = formData.get('file') as File | null;
        if (!file || file.size === 0) {
            return NextResponse.json({ success: false, error: 'Файл не предоставлен' }, { status: 400 });
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const uploadsDir = join(process.cwd(), 'public', 'uploads');
        try {
            await mkdir(uploadsDir, { recursive: true });
        } catch (e) {}

        const fileName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.\-_]/g, '_')}`;
        const filePath = join(uploadsDir, fileName);

        await writeFile(filePath, buffer);

        return NextResponse.json({ success: true, url: `/uploads/${fileName}` });
    } catch (e) {
        console.error('Ошибка при загрузке файла:', e);
        return NextResponse.json({ success: false, error: 'Ошибка сервера при сохранении' }, { status: 500 });
    }
}
