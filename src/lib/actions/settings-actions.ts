'use server';

import { findSettings, upsertSettings } from '../mongo/settings';
import { SiteSettings } from '../types';
import {devLog} from "@/lib/utils/devLog";

export async function getSettingsAction(): Promise<SiteSettings | null> {
    try {
        const settings = await findSettings();
        if (!settings) return null;
        return { ...settings, _id: settings._id?.toString() } as SiteSettings;
    } catch (e) {
        devLog.error('Ошибка при получении настроек: ' + e)
        return null;
    }
}

export async function updateSettingsAction(data: Omit<SiteSettings, '_id'>) {
    try {
        const result = await upsertSettings(data);
        if (result.success && result.data) {
            return { success: true, data: { ...result.data, _id: result.data._id?.toString() } };
        }
        return { success: false, error: 'Ошибка' };
    } catch (e) {
        devLog.error('Ошибка при обновлении настроек:' + e)
        return { success: false, error: 'Ошибка при обновлении настроек' };
    }
}
