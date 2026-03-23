// Общие типы для MongoDB без зависимостей от библиотеки mongodb

/**
 * Общий тип для преобразования клиентских сущностей в MongoDB-документы
 * T - тип клиентской сущности
 */
export type MongoDocument<T> = Omit<T, 'id'> & {
	_id?: string | unknown
}
