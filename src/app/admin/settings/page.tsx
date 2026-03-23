import Container from '@/components/ui/Container';
import SettingsForm from '@/components/admin/SettingsForm';
import { getSettingsAction } from '@/lib/actions/settings-actions';
import Link from 'next/link';

export default async function AdminSettingsPage() {
    const settings = await getSettingsAction();

    return (
        <Container className="py-12 max-w-4xl">
            <Link href="/admin" className="text-gray-500 hover:text-gray-900 mb-6 inline-block">
                &larr; Назад в админку
            </Link>
            <h1 className="text-3xl font-bold mb-8 text-gray-900">Настройки сайта</h1>
            <SettingsForm initialData={settings} />
        </Container>
    );
}
