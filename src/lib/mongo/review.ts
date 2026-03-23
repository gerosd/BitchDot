import { getDb } from './client';
import { ObjectId } from 'mongodb';
import { Review } from '../types';

async function getCollection() {
    const db = await getDb();
    return db.collection<Review>('reviews');
}

export async function getReviews(
    query: Record<string, any> = {},
    options: { sort?: Record<string, 1 | -1>; skip?: number; limit?: number } = {}
) {
    const collection = await getCollection();
    let cursor = collection.find(query);

    if (options.sort) {
        cursor = cursor.sort(options.sort);
    } else {
        cursor = cursor.sort({ createdAt: -1 });
    }

    if (options.skip) cursor = cursor.skip(options.skip);
    if (options.limit) cursor = cursor.limit(options.limit);

    return await cursor.toArray();
}

export async function getReviewById(id: string) {
    const collection = await getCollection();
    let objectId;
    try {
        objectId = new ObjectId(id);
    } catch (e) {
        return null;
    }
    return await collection.findOne({ _id: objectId });
}

export async function createReview(data: Omit<Review, '_id' | 'createdAt' | 'updatedAt'>) {
    const collection = await getCollection();
    const result = await collection.insertOne({
        ...data,
        createdAt: new Date(),
        updatedAt: new Date()
    });
    return { ...data, _id: result.insertedId };
}

export async function updateReview(id: string, data: Partial<Review>) {
    const collection = await getCollection();
    let objectId;
    try {
        objectId = new ObjectId(id);
    } catch (e) {
        return false;
    }
    const result = await collection.updateOne(
        { _id: objectId },
        { 
            $set: { 
                ...data, 
                updatedAt: new Date() 
            } 
        }
    );
    return result.modifiedCount > 0;
}

export async function deleteReview(id: string) {
    const collection = await getCollection();
    let objectId;
    try {
        objectId = new ObjectId(id);
    } catch (e) {
        return false;
    }
    const result = await collection.deleteOne({ _id: objectId });
    return result.deletedCount > 0;
}
