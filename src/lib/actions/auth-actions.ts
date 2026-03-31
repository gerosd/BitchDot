'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function loginAction(state: any, formData: FormData) {
    const login = formData.get('login') as string;
    const password = formData.get('password') as string;

    const adminUser = process.env.ADMIN_USER || 'admin';
    const adminPass = process.env.ADMIN_PASS || 'admin123';
    const sessionSecret = process.env.SESSION_SECRET || 'secret';

    if (login === adminUser && password === adminPass) {
        const cookieStore = await cookies();
        cookieStore.set('admin_session', sessionSecret, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 * 7, // 1 week
            path: '/',
        });
        
        redirect('/admin');
    }

    return { error: 'Неверный логин или пароль' };
}

export async function logoutAction() {
    const cookieStore = await cookies();
    cookieStore.delete('admin_session');
    redirect('/admin/login');
}
