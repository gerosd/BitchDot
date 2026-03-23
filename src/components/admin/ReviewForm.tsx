'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Review } from '@/lib/types';
import { createReviewAction, updateReviewAction, deleteReviewAction } from '@/lib/actions/review-actions';
import { uploadImageAction } from '@/lib/actions/upload-actions';
import Link from 'next/link';

export default function ReviewForm({ initialData }: { initialData?: Review }) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [videoUrl, setVideoUrl] = useState(initialData?.videoUrl || '');

    async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData(e.currentTarget);
        
        let finalVideoUrl = videoUrl;

        const videoFile = formData.get('videoFile') as File | null;
        if (videoFile && videoFile.size > 0) {
            const uploadData = new FormData();
            uploadData.append('file', videoFile);
            const uploadRes = await uploadImageAction(uploadData);
            if (uploadRes.success && uploadRes.url) {
                finalVideoUrl = uploadRes.url;
                setVideoUrl(finalVideoUrl);
            } else {
                alert(`Ошибка загрузки видео: ` + uploadRes.error);
                setLoading(false);
                return;
            }
        }

        if (!finalVideoUrl) {
            alert('Необходимо загрузить видео или указать URL.');
            setLoading(false);
            return;
        }

        const data = {
            title: formData.get('title') as string,
            text: formData.get('text') as string,
            videoUrl: finalVideoUrl
        };

        if (initialData?._id) {
            await updateReviewAction(initialData._id.toString(), data);
        } else {
            await createReviewAction(data);
        }

        router.push('/admin/reviews');
        router.refresh();
    }

    async function handleDelete() {
        if (!initialData?._id || !confirm('Удалить этот обзор навсегда?')) return;
        setLoading(true);
        await deleteReviewAction(initialData._id.toString());
        router.push('/admin/reviews');
        router.refresh();
    }

    return (
        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm text-gray-900 max-w-3xl">
            <div className="space-y-6 mb-8">
                <div>
                    <label className="block text-sm font-semibold mb-2">Название обзора</label>
                    <input 
                        name="title" 
                        required 
                        defaultValue={initialData?.title} 
                        className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" 
                        placeholder="Обзор линейки для лица" 
                    />
                </div>

                <div>
                    <label className="block text-sm font-semibold mb-2">Текст (необязательно)</label>
                    <textarea 
                        name="text" 
                        defaultValue={initialData?.text} 
                        rows={4} 
                        className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" 
                        placeholder="Короткое описание обзора"
                    ></textarea>
                </div>

                <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                    <label className="block text-sm font-semibold mb-2">Видеофайл</label>
                    <p className="text-sm text-gray-500 mb-4">Выберите файл видео (MP4 / WebM) для загрузки на сервер.</p>
                    <input 
                        name="videoFile" 
                        type="file" 
                        accept="video/*" 
                        className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-white mb-4 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" 
                    />
                    
                    {videoUrl && (
                        <div className="mt-4">
                            <p className="text-sm font-semibold mb-2">Текущее видео:</p>
                            <div className="relative rounded-xl overflow-hidden bg-black max-w-xs border border-gray-200">
                                <video src={videoUrl} controls className="w-full" />
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className="flex justify-between items-center pt-6 border-t border-gray-100">
                <Link href="/admin/reviews" className="px-5 py-2.5 text-gray-600 font-medium hover:bg-gray-50 rounded-xl transition-colors">
                    Отмена
                </Link>
                <div className="flex gap-3">
                    {initialData && (
                        <button type="button" onClick={handleDelete} disabled={loading} className="px-5 py-2.5 text-red-600 bg-red-50 hover:bg-red-100 rounded-xl font-medium transition-colors disabled:opacity-50">
                            Удалить
                        </button>
                    )}
                    <button type="submit" disabled={loading} className="px-8 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors disabled:opacity-50">
                        {loading ? 'Сохранение...' : 'Сохранить'}
                    </button>
                </div>
            </div>
        </form>
    );
}
