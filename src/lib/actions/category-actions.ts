'use server';

import { revalidatePath } from 'next/cache';
import {
    getCategories,
    getCategoryById,
    createCategory,
    updateCategory,
    deleteCategory
} from '../mongo/category';
import { Category } from '../types';
import {devLog} from "@/lib/utils/devLog";

export async function getCategoriesAction() {
    try {
        const categories = await getCategories();
        return categories.map(c => ({ ...c, _id: c._id?.toString() })) as Category[];
    } catch (e) {
        devLog.error('Ошибка при получении категорий:', e);
        return [];
    }
}

export async function getCategoryByIdAction(id: string) {
    try {
        const category = await getCategoryById(id);
        if (!category) return null;
        return { ...category, _id: category._id?.toString() } as Category;
    } catch (e) {
        devLog.error(`Ошибка при получении категории ${id}:`, e);
        return null;
    }
}

export async function createCategoryActions(categoryData: Omit<Category, '_id'>) {
    try {
        await createCategory(categoryData);
        revalidatePath('/admin/categories');
        revalidatePath('/admin/products');
        revalidatePath('/catalog');
        revalidatePath('/', 'layout');
        return { success: true };
    } catch (e: any) {
        devLog.error('Ошибка при создании категории:', e);
        return { success: false, error: e.message || 'Ошибка при создании категории' };
    }
}

export async function updateCategoryAction(id: string, categoryData: Partial<Category>) {
    try {
        await updateCategory(id, categoryData);
        revalidatePath('/admin/categories');
        revalidatePath(`/admin/categories/${id}`);
        revalidatePath('/admin/products');
        revalidatePath('/catalog');
        revalidatePath('/', 'layout');
        return { success: true };
    } catch (e: any) {
        devLog.error(`Ошибка при обновлении категории ${id}:`, e);
        return { success: false, error: e.message || 'Ошибка при обновлении категории' };
    }
}

export async function deleteCategoryAction(id: string) {
    try {
        await deleteCategory(id);
        revalidatePath('/admin/categories');
        revalidatePath('/admin/products');
        revalidatePath('/catalog');
        revalidatePath('/', 'layout');
        return { success: true };
    } catch (e: any) {
        devLog.error(`Ошибка при удалении категории ${id}:`, e);
        return { success: false, error: e.message || 'Ошибка при удалении категории' };
    }
}
