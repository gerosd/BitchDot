import Container from '@/components/ui/Container';
import { getAboutAction } from '@/lib/actions/about-actions';
import { AboutBrandData } from '@/lib/types';
import { getSettingsAction } from '@/lib/actions/settings-actions';
import { cookies } from 'next/headers';
import Image from 'next/image';
import Link from "next/link";

export default async function AboutPage() {
    const settings = await getSettingsAction();
    const cookieStore = await cookies();
    const isAdmin = cookieStore.has('admin_session');
    const isSiteON = settings?.isSiteEnabled ?? false;
    const shouldLoadFromDB = isSiteON || isAdmin;

    if (!shouldLoadFromDB) {
        return (
            <div className="py-24 text-center min-h-[50vh] flex flex-col items-center justify-center">
                <h1 className="text-4xl font-bold">Сайт находится на обслуживании</h1>
                <p className="text-gray-500 mt-4">Раздел информации о бренде временно недоступен.</p>
                <Link href="/" className="px-6 py-3 mt-8 bg-gray-900 text-white font-medium rounded hover:bg-gray-800 transition-colors">
                    На главную
                </Link>
            </div>
        );
    }

    const data = await getAboutAction();
    const about = data as AboutBrandData;

    if (!about) {
        return <div className="py-24 text-center">Данные не найдены</div>;
    }

    return (
        <div className="bg-base">
            <section className="relative h-screen flex items-center justify-center bg-surface">
                <Image
                    src={about.heroImage}
                    alt={about.title}
                    className="object-cover opacity-80 h-full absolute"
                    width={3840}
                    height={2160}
                />
                <div className="absolute h-full inset-0 bg-linear-to-t from-gray-900/60 to-transparent" />
                <Container className="relative z-10 text-center">
                    <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tight mb-6">
                        {about.title}
                    </h1>
                    <p className="text-xl text-white/90 max-w-2xl mx-auto font-medium">
                        {about.subtitle}
                    </p>
                </Container>
            </section>

            <section className="py-24">
                <Container>
                    <div className="max-w-3xl mx-auto">
                        <h2 className="text-3xl font-bold text-base-content mb-8">
                            Философия бренда
                        </h2>
                        <div className="prose prose-lg text-surface-content space-y-6">
                            {about.philosophyText?.map((paragraph, index) => (
                                <p key={index}>{paragraph}</p>
                            ))}
                        </div>
                    </div>
                </Container>
            </section>

            <section className="py-24 bg-surface">
                <Container>
                    <h2 className="text-3xl font-bold text-center text-base-content mb-16">
                        {about.valuesTitle}
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        {about.values?.map((item, i) => (
                            <div key={i} className="bg-base p-8 rounded-3xl shadow-sm border border-border text-center">
                                <h3 className="text-xl font-bold text-base-content mb-4">{item.title}</h3>
                                <p className="text-surface-content">{item.description}</p>
                            </div>
                        ))}
                    </div>
                </Container>
            </section>
        </div>
    );
}
