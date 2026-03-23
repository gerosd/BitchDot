import { Collection, ObjectId } from 'mongodb'
import { MongoDocument } from '../types/mongodb'
import { SiteSettings } from '../types'
import { getCollection } from './client'
import { executeMongoOperation } from './utils'

export interface MongoSiteSettings extends MongoDocument<SiteSettings> {
    _id?: ObjectId
}

let settingsCollection: Collection<MongoSiteSettings> | null = null

export const getSettingsCollection = async (): Promise<Collection<MongoSiteSettings>> => {
    if (!settingsCollection) {
        const collection = await getCollection('settings')
        settingsCollection = collection as unknown as Collection<MongoSiteSettings>
    }
    return settingsCollection
}

export const findSettings = async (): Promise<MongoSiteSettings | null> => {
    return executeMongoOperation(async () => {
        const collection = await getSettingsCollection()
        return await collection.findOne({})
    }, 'получении настроек сайта')
}

export const upsertSettings = async (data: Omit<SiteSettings, '_id'>): Promise<{ success: boolean; data?: MongoSiteSettings }> => {
    return executeMongoOperation(async () => {
        const collection = await getSettingsCollection()
        const result = await collection.findOneAndUpdate(
            {},
            { $set: data },
            { upsert: true, returnDocument: 'after' }
        )
        return { success: true, data: result as MongoSiteSettings }
    }, 'обновлении настроек сайта')
}
