import { Collection, Db, MongoClient } from "mongodb"
import {devLog} from "@/lib/utils/devLog";

/**
 * Извлекает имя базы данных из MongoDB URI
 */
const extractDatabaseName = (uri: string): string => {
    try {
        // Для MongoDB URI формата: mongodb://user:pass@host:port/dbname?options
        const match = uri.match(/\/([^/?]+)(\?.*)?$/)
        if (!match || !match[1]) {
            throw new Error('Не удалось найти имя базы данных в URI')
        }
        return match[1]
    } catch (error) {
        throw new Error(`❌ Неверный формат DATABASE_URL: ${error}`)
    }
}

let client: MongoClient | null = null
let db: Db | null = null

/**
 * Подключение к MongoDB с кешированием соединения
 */
const connectToDatabase = async (): Promise<{ client: MongoClient; db: Db }> => {
    // Возвращаем существующее соединение если оно есть
    if (client && db) {
        return { client, db }
    }

    // Проверяем наличие DATABASE_URL при первом подключении
    const MONGODB_URI = process.env.DATABASE_URL
    if (!MONGODB_URI) {
        throw new Error('❌ DATABASE_URL не задана в переменных окружения')
    }

    const DATABASE_NAME = extractDatabaseName(MONGODB_URI)

    try {
        // Создаём новое соединение
        client = new MongoClient(MONGODB_URI, {
            maxPoolSize: 10,
            serverSelectionTimeoutMS: 3000,
            retryWrites: true,
            writeConcern: { w: 'majority' },
            readPreference: 'secondary'
        })

        await client.connect()
        db = client.db(DATABASE_NAME)

        devLog.log(`✅ Подключение к MongoDB успешно: ${DATABASE_NAME}`)

        return { client, db }
    } catch (error) {
        devLog.error('❌ Ошибка подключения к MongoDB:', error)
        throw error
    }
}

/**
 * Получение базы данных MongoDB
 * @returns База данных MongoDB
 */
export const getDb = async (): Promise<Db> => {
    if (!db) {
        const connection = await connectToDatabase()
        return connection.db
    }
    return db
}

/**
 * Получение коллекции MongoDB
 * @param collectionName Имя коллекции
 * @returns Коллекция MongoDB
 */
export const getCollection = async (collectionName: string): Promise<Collection> => {
    const database = await getDb()
    return database.collection(collectionName)
}

/**
 * Закрытие соединения с базой данных
 */
export const closeConnection = async (): Promise<void> => {
    if (client) {
        await client.close()
        client = null
        db = null
        devLog.log('🔒 Соединение с MongoDB закрыто')
    }
}
