'use server';

import { findAboutData, upsertAboutData } from '../mongo/about';
import { AboutBrandData } from '../types';
import { devLog } from "@/lib/utils/devLog";

export async function getAboutAction(): Promise<AboutBrandData | null> {
    try {
        const about = await findAboutData();
        if (!about) return null;
        return { ...about, _id: about._id?.toString() } as unknown as AboutBrandData;
    } catch (e) {
        devLog.error('Ошибка при получении данных О бренде: ' + e);
        return null;
    }
}

export async function updateAboutAction(data: Omit<AboutBrandData, '_id'>) {
    try {
        const result = await upsertAboutData(data);
        if (result.success && result.data) {
            return { success: true, data: { ...result.data, _id: result.data._id?.toString() } };
        }
        return { success: false, error: 'Ошибка' };
    } catch (e) {
        devLog.error('Ошибка при обновлении данных О бренде:' + e);
        return { success: false, error: 'Ошибка при обновлении данных О бренде' };
    }
}
