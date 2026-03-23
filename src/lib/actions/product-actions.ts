'use server';

import { revalidatePath } from 'next/cache';
import {
    getProducts,
    getProductById,
    createProduct,
    deleteProduct,
    updateProduct
} from '../mongo/product';
import { Product } from '../types';
import {devLog} from "@/lib/utils/devLog";
import {matchesSearch} from "@/lib/utils/search";

export async function getProductsAction(params?: {
    category?: string | string[];
    subcategory?: string | string[];
    isBestseller?: boolean;
    q?: string;
    limit?: number;
    skip?: number;
    sort?: Record<string, 1 | -1>;
}) {
    try {
        const query: Record<string, any> = {};

        if (params?.category) {
            if (Array.isArray(params.category)) {
                if (params.category.length > 0) query.categories = { $in: params.category };
            } else {
                query.categories = params.category;
            }
        }

        if (params?.subcategory) {
            const subs = Array.isArray(params.subcategory) ? params.subcategory : [params.subcategory];
            if (subs.length > 0) {
                query.$or = [
                    { subcategories: { $in: subs } },
                    { subcategory: { $in: subs } }
                ];
            }
        }

        if (params?.isBestseller !== undefined) query.isBestseller = params.isBestseller;

        const options = {
            sort: params?.sort,
            skip: params?.q ? undefined : params?.skip,
            limit: params?.q ? undefined : params?.limit,
        };

        let products = await getProducts(query, options);

        if (params?.q) {
            products = products.filter(p => matchesSearch(p.title, params.q!));
            const skip = params.skip ?? 0;
            if (params.limit) {
                products = products.slice(skip, skip + params.limit);
            }
        }

        return products.map(p => ({ ...p, _id: p._id?.toString() })) as Product[];
    } catch (e) {
        devLog.error('Ошибка при получении товаров:', e);
        return [];
    }
}

export async function getProductByIdAction(id: string) {
    try {
        const product = await getProductById(id);
        if (!product) return null;
        return { ...product, _id: product._id?.toString() } as Product;
    } catch (e) {
        devLog.error(`Ошибка получения товара ${id}:`, e);
        return null;
    }
}

export async function createProductAction(productData: Omit<Product, '_id' | 'createdAt' | 'updatedAt'>) {
    try {
        const newProduct = await createProduct(productData);
        revalidatePath('/admin/products');
        revalidatePath('/catalog');
        return { success: true, id: newProduct._id?.toString() };
    } catch (e) {
        devLog.error('Ошибка при создании товара:', e);
        return { success: false, error: 'Ошибка при создании товара' };
    }
}

export async function deleteProductAction(id: string) {
    try {
        const success = await deleteProduct(id);
        revalidatePath('/admin/products');
        revalidatePath('/catalog');
        return { success };
    } catch (e) {
        devLog.error(`Ошибка при удалении товара ${id}:`, e);
        return { success: false, error: 'Ошибка при удалении товара' };
    }
}

export async function updateProductAction(id: string, productData: Partial<Product>) {
    try {
        const success = await updateProduct(id, productData);
        revalidatePath('/admin/products');
        revalidatePath(`/admin/products/${id}`);
        revalidatePath('/catalog');
        return { success };
    } catch (e) {
        devLog.error(`Ошибка при обновлении товара ${id}:`, e);
        return { success: false, error: 'Ошибка при обновлении товара' };
    }
}

