import Container from '@/components/ui/Container';
import AboutForm from '@/components/admin/AboutForm';
import { getAboutAction } from '@/lib/actions/about-actions';
import Link from 'next/link';

export default async function AdminAboutPage() {
    const aboutData = await getAboutAction();

    return (
        <Container className="py-12 max-w-4xl">
            <Link href="/admin" className="text-gray-500 hover:text-gray-900 mb-6 inline-block">
                &larr; Назад в админку
            </Link>
            <h1 className="text-3xl font-bold mb-8 text-gray-900">Редактирование страницы &#34;О бренде&#34;</h1>
            <AboutForm initialData={aboutData} />
        </Container>
    );
}
