'use client';

import { useActionState } from 'react';
import { loginAction } from '@/lib/actions/auth-actions';
import Button from '@/components/ui/Button';
import Container from '@/components/ui/Container';

export default function LoginPage() {
    const [state, formAction, isPending] = useActionState(loginAction, null);

    return (
        <Container className="min-h-[80vh] flex items-center justify-center">
            <div className="w-full max-w-md bg-white p-8 rounded-2xl border border-gray-200 shadow-xl">
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold text-gray-900">Вход в админ-панель</h1>
                    <p className="text-gray-500 mt-2">Введите ваши данные для доступа</p>
                </div>

                <form action={formAction} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Логин
                        </label>
                        <input
                            type="text"
                            name="login"
                            required
                            className="w-full h-11 px-4 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
                            placeholder="admin"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Пароль
                        </label>
                        <input
                            type="password"
                            name="password"
                            required
                            className="w-full h-11 px-4 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
                            placeholder="••••••••"
                        />
                    </div>

                    {state?.error && (
                        <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">
                            {state.error}
                        </div>
                    )}

                    <Button
                        type="submit"
                        className="w-full h-11"
                        disabled={isPending}
                    >
                        {isPending ? 'Вход...' : 'Войти'}
                    </Button>
                </form>
            </div>
        </Container>
    );
}
