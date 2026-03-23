import { Collection, ObjectId } from 'mongodb';
import { MongoDocument } from '../types/mongodb';
import {AboutBrandData} from '../types';
import { getCollection } from './client';
import { executeMongoOperation } from './utils';

export interface MongoAboutData extends MongoDocument<AboutBrandData> {
    _id?: ObjectId
}

let aboutCollection: Collection<MongoAboutData> | null = null;

export const getAboutCollection = async (): Promise<Collection<MongoAboutData>> => {
    if (!aboutCollection) {
        const collection = await getCollection('about');
        aboutCollection = collection as unknown as Collection<MongoAboutData>;
    }
    return aboutCollection;
};

const defaultAboutData: Omit<AboutBrandData, '_id'> = {
    heroImage: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?q=80&w=2600&auto=format&fit=crop",
    title: "О бренде BitchDot",
    subtitle: "Научный подход к красоте с 2022 года",
    philosophyText: [
        "Мы верим, что профессиональный уход должен быть доступен каждому. BitchDot сочетает в себе передовые технологии, высококачественное сырье из Европы и строгий контроль на каждом этапе производства.",
        "Наша миссия — создавать продукты, которые не только маскируют несовершенства, но и решают проблемы изнутри. Каждое средство проходит дерматологический контроль и тестирование эффективности.",
        "За долгие годы работы мы заслужили доверие миллионов покупателей и тысяч профессионалов в индустрии красоты. Мы гордимся тем, что производим косметику, которая действительно работает."
    ],
    valuesTitle: "Наши ценности",
    values: [
        { title: 'Научный подход', description: 'Собственная лаборатория и сотрудничество с ведущими европейскими институтами.' },
        { title: 'Эффективность', description: 'Рабочие концентрации активных компонентов в каждом флаконе.'},
        { title: 'Безопасность', description: 'Не тестируется на животных. Строгий контроль качества.' }
    ]
};

export const findAboutData = async (): Promise<MongoAboutData> => {
    return executeMongoOperation(async () => {
        const collection = await getAboutCollection();
        let data = await collection.findOne({});
        if (!data) {
            const result = await collection.insertOne(defaultAboutData);
            data = { ...defaultAboutData, _id: result.insertedId };
        }
        return data;
    }, 'получении данных страницы О бренде');
};

export const upsertAboutData = async (data: Omit<AboutBrandData, '_id'>): Promise<{ success: boolean; data?: MongoAboutData }> => {
    return executeMongoOperation(async () => {
        const collection = await getAboutCollection();
        const result = await collection.findOneAndUpdate(
            {},
            { $set: data },
            { upsert: true, returnDocument: 'after' }
        );
        return { success: true, data: result as MongoAboutData };
    }, 'обновлении данных страницы О бренде');
};
