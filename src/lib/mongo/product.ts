import { Collection, ObjectId } from 'mongodb'
import { MongoDocument } from '../types/mongodb'
import { Product } from '../types'
import { getCollection } from './client'
import { executeMongoOperation } from './utils'

export interface MongoProduct extends MongoDocument<Product> {
    _id?: ObjectId
}

let productsCollection: Collection<MongoProduct> | null = null

export const getProductsCollection = async (): Promise<Collection<MongoProduct>> => {
    if (!productsCollection) {
        const collection = await getCollection('products')
        productsCollection = collection as unknown as Collection<MongoProduct>
    }
    return productsCollection
}

export const getProducts = async (query: Record<string, any> = {}, options: { skip?: number; limit?: number; sort?: Record<string, 1 | -1> } = {}): Promise<MongoProduct[]> => {
    return executeMongoOperation(async () => {
        const collection = await getProductsCollection()
        let cursor = collection.find(query)
        if (options.sort) cursor = cursor.sort(options.sort)
        if (options.skip) cursor = cursor.skip(options.skip)
        if (options.limit) cursor = cursor.limit(options.limit)
        return await cursor.toArray()
    }, 'получении списка товаров')
}

export const getProductById = async (id: string): Promise<MongoProduct | null> => {
    return executeMongoOperation(async () => {
        const collection = await getProductsCollection()
        return await collection.findOne({ _id: new ObjectId(id) })
    }, 'получении товара по ID')
}

export const createProduct = async (productData: Omit<Product, '_id' | 'createdAt' | 'updatedAt'>): Promise<MongoProduct> => {
    return executeMongoOperation(async () => {
        const collection = await getProductsCollection()
        const date = new Date()
        const newProduct = { ...productData, createdAt: date, updatedAt: date }
        const result = await collection.insertOne(newProduct)
        return { ...newProduct, _id: result.insertedId }
    }, 'создании нового товара')
}

export const deleteProduct = async (id: string): Promise<boolean> => {
    return executeMongoOperation(async () => {
        const collection = await getProductsCollection()
        const result = await collection.deleteOne({ _id: new ObjectId(id) })
        return result.deletedCount > 0
    }, 'удалении товара')
}

export const updateProduct = async (id: string, productData: Partial<Product>): Promise<boolean> => {
    return executeMongoOperation(async () => {
        const collection = await getProductsCollection()
        const { _id, ...updateFields } = productData
        const result = await collection.updateOne(
            { _id: new ObjectId(id) },
            { $set: { ...updateFields, updatedAt: new Date() } }
        )
        return result.modifiedCount > 0
    }, 'обновлении товара')
}
