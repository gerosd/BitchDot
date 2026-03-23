export async function uploadImageAction(formData: FormData) {
    try {
        const response = await fetch('/api/upload', {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            return { success: false, error: 'Ошибка сервера при загрузке' };
        }

        const data = await response.json();
        return data as { success: boolean; url?: string; error?: string };
    } catch (e) {
        console.error('Ошибка при загрузке файла на клиенте:', e);
        return { success: false, error: 'Сетевая ошибка при загрузке' };
    }
}
