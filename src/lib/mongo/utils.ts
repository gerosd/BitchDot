/**
 * Утилита для выполнения операций MongoDB с централизованной обработкой ошибок.
 * @param operation Асинхронная функция, выполняющая операцию с MongoDB.
 * @param errorMessageContext Контекстное сообщение для логирования ошибки (например, "создании пользователя").
 * @returns Результат выполнения операции или значение по умолчанию в случае ошибки.
 */
export async function executeMongoOperation<T>(operation: () => Promise<T>, errorMessageContext: string): Promise<T> {
    try {
        return await operation();
    } catch (error: unknown) {
        // Логируем более подробную информацию об ошибке
        const message = error instanceof Error ? error.message : String(error);
        console.error(`Ошибка при ${errorMessageContext}: ${message}`, error);
        throw error;
    }
}
