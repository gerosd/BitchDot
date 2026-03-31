import { getSettingsAction } from '@/lib/actions/settings-actions';
import Container from '@/components/ui/Container';
import WBLogo from "@/components/ui/WBLogo";
import OZONLogo from "@/components/ui/OZONLogo";
import { cookies } from 'next/headers';
import Link from "next/link";

export default async function WhereToBuyPage() {
    const settings = await getSettingsAction();
    const cookieStore = await cookies();
    const isAdmin = cookieStore.has('admin_session');
    const isSiteON = settings?.isSiteEnabled ?? false;
    const shouldLoadFromDB = isSiteON || isAdmin;

    if (!shouldLoadFromDB) {
        return (
            <div className="py-24 text-center min-h-[50vh] flex flex-col items-center justify-center">
                <h1 className="text-4xl font-bold">Сайт находится на обслуживании</h1>
                <p className="text-gray-500 mt-4">Раздел магазинов временно недоступен.</p>
                <Link href="/" className="px-6 py-3 mt-8 bg-gray-900 text-white font-medium rounded hover:bg-gray-800 transition-colors">
                    На главную
                </Link>
            </div>
        );
    }

    const wbUrl = settings?.whereToBuy?.wildberriesUrl;
    const ozonUrl = settings?.whereToBuy?.ozonUrl;

    return (
        <Container className="py-24 max-w-5xl flex flex-col items-center">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900 mb-6 text-center">
                Где купить
            </h1>
            <p className="text-lg md:text-xl text-gray-500 mb-16 max-w-2xl text-center leading-relaxed">
                Официальная продукция BitchDot представлена на ведущих маркетплейсах. Выбирайте удобный для вас сервис и заказывайте с быстрой доставкой.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
                {wbUrl ? (
                    <a href={wbUrl} target="_blank" rel="noreferrer noopener" className="flex flex-col items-center justify-center bg-linear-to-br from-[#cb11ab] to-[#e61bca] text-white p-16 rounded-3xl hover:scale-105 hover:shadow-2xl hover:shadow-[#cb11ab]/30 transition-all duration-300">
                        <WBLogo/>
                        <span className="text-white/80 font-medium tracking-wide uppercase text-sm">Перейти в магазин &rarr;</span>
                    </a>
                ) : (
                    <div className="flex flex-col items-center justify-center bg-gray-50 text-gray-400 p-16 rounded-3xl border-2 border-dashed border-gray-200">
                        <WBLogo/>
                        <span className="text-sm">Ссылка будет добавлена позже</span>
                    </div>
                )}

                {ozonUrl ? (
                    <a href={ozonUrl} target="_blank" rel="noreferrer noopener" className="flex flex-col items-center justify-center bg-linear-to-br border-4 border-[#005BFF] text-[#005BFF] p-16 rounded-3xl hover:scale-105 hover:shadow-2xl hover:shadow-[#005bff]/30 transition-all duration-300">
                        <OZONLogo/>
                        <span className="font-medium tracking-wide uppercase text-sm">Перейти в магазин &rarr;</span>
                    </a>
                ) : (
                    <div className="flex flex-col items-center justify-center bg-gray-50 text-gray-400 p-16 rounded-3xl border-2 border-dashed border-gray-200">
                        <OZONLogo/>
                        <span className="text-sm">Ссылка будет добавлена позже</span>
                    </div>
                )}
            </div>
        </Container>
    );
}
