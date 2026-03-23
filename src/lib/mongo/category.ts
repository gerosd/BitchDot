import { getDb } from './client';
import { Category } from '../types';
import { ObjectId } from 'mongodb';

const COLLECTION_NAME = 'categories';

export async function getCategories(): Promise<Category[]> {
    const db = await getDb();
    return db.collection<Category>(COLLECTION_NAME).find().sort({ _id: 1 }).toArray();
}

export async function getCategoryById(id: string): Promise<Category | null> {
    const db = await getDb();
    return db.collection<Category>(COLLECTION_NAME).findOne({ _id: new ObjectId(id) });
}

export async function createCategory(categoryData: Omit<Category, '_id'>): Promise<Category> {
    const db = await getDb();

    const existing = await db.collection<Category>(COLLECTION_NAME).findOne({ name: categoryData.name });
    if (existing) {
        throw new Error('Категория с таким именем уже существует');
    }

    const doc = {
        ...categoryData,
        createdAt: new Date(),
        updatedAt: new Date()
    };

    const result = await db.collection(COLLECTION_NAME).insertOne(doc);
    return { ...doc, _id: result.insertedId } as unknown as Category;
}

export async function updateCategory(id: string, updateData: Partial<Category>): Promise<boolean> {
    const db = await getDb();

    const doc = {
        ...updateData,
        updatedAt: new Date()
    };
    delete doc._id;

    const result = await db.collection(COLLECTION_NAME).updateOne(
        { _id: new ObjectId(id) },
        { $set: doc }
    );

    return result.modifiedCount > 0;
}

export async function deleteCategory(id: string): Promise<boolean> {
    const db = await getDb();
    const result = await db.collection(COLLECTION_NAME).deleteOne({ _id: new ObjectId(id) });
    return result.deletedCount > 0;
}
