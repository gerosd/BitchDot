'use server';

import { revalidatePath } from 'next/cache';
import {
    getReviews,
    getReviewById,
    createReview,
    deleteReview,
    updateReview
} from '../mongo/review';
import { Review } from '../types';
import {devLog} from "@/lib/utils/devLog";

export async function getReviewsAction(params?: {
    limit?: number;
    skip?: number;
    sort?: Record<string, 1 | -1>;
}) {
    try {
        let query: Record<string, any> = {};

        const options = {
            sort: params?.sort,
            skip: params?.skip,
            limit: params?.limit
        };

        const reviews = await getReviews(query, options);
        return reviews.map((r: Review) => ({ ...r, _id: r._id?.toString() })) as Review[];
    } catch (e) {
        devLog.error('Ошибка при получении обзоров:', e);
        return [];
    }
}

export async function getReviewByIdAction(id: string) {
    try {
        const review = await getReviewById(id);
        if (!review) return null;
        return { ...review, _id: review._id?.toString() } as Review;
    } catch (e) {
        devLog.error(`Ошибка при получении обзора ${id}:`, e);
        return null;
    }
}

export async function createReviewAction(reviewData: Omit<Review, '_id' | 'createdAt' | 'updatedAt'>) {
    try {
        const newReview = await createReview(reviewData);
        revalidatePath('/admin/reviews');
        revalidatePath('/reviews');
        revalidatePath('/');
        return { success: true, id: newReview._id?.toString() };
    } catch (e) {
        devLog.error('Ошибка при создании обзора:', e);
        return { success: false, error: 'Ошибка при создании обзора' };
    }
}

export async function deleteReviewAction(id: string) {
    try {
        const success = await deleteReview(id);
        revalidatePath('/admin/reviews');
        revalidatePath('/reviews');
        revalidatePath('/');
        return { success };
    } catch (e) {
        devLog.error(`Ошибка при удалении обзора ${id}:`, e);
        return { success: false, error: 'Ошибка при удалении обзора' };
    }
}

export async function updateReviewAction(id: string, reviewData: Partial<Review>) {
    try {
        const success = await updateReview(id, reviewData);
        revalidatePath('/admin/reviews');
        revalidatePath(`/admin/reviews/${id}`);
        revalidatePath('/reviews');
        revalidatePath('/');
        return { success };
    } catch (e) {
        devLog.error(`Ошибка при обновлении обзора ${id}:`, e);
        return { success: false, error: 'Ошибка при обновлении обзора' };
    }
}
