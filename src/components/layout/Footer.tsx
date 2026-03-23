import Link from 'next/link';
import Container from '../ui/Container';

export default function Footer() {
    return (
        <footer className="bg-surface pt-16 pb-8 border-t border-border mt-auto">
            <Container>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
                    <div className="col-span-1 md:col-span-1">
                        <Link href="/" className="text-2xl font-serif block mb-6 text-base-content tracking-[0.2em]">
                            BitchDot
                        </Link>
                        <p className="text-surface-content-muted text-sm leading-relaxed mb-6">
                            Профессиональная косметика для ухода за кожей и волосами. Создана с любовью и заботой о вас.
                        </p>
                    </div>

                    <div>
                        <h4 className="font-semibold text-base-content mb-6">Каталог</h4>
                        <ul className="space-y-4">
                            <li><Link href="/catalog?category=face" className="text-surface-content hover:text-base-content text-sm transition-colors">Для лица</Link></li>
                            <li><Link href="/catalog?category=body" className="text-surface-content hover:text-base-content text-sm transition-colors">Для тела</Link></li>
                            <li><Link href="/catalog?category=hair" className="text-surface-content hover:text-base-content text-sm transition-colors">Для волос</Link></li>
                            <li><Link href="/catalog" className="text-surface-content hover:text-base-content text-sm transition-colors mt-2 font-medium">Смотреть все</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-semibold text-base-content mb-6">О компании</h4>
                        <ul className="space-y-4">
                            <li><Link href="/about" className="text-surface-content hover:text-base-content text-sm transition-colors">О бренде</Link></li>
                            <li><Link href="/where-to-buy" className="text-surface-content hover:text-base-content text-sm transition-colors">Где купить</Link></li>
                        </ul>
                    </div>

                </div>

                <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-border">
                    <p className="text-surface-content-muted/70 text-sm mb-4 md:mb-0">
                        &copy; {new Date().getFullYear()} BitchDot. Все права защищены.
                    </p>
                </div>
            </Container>
        </footer>
    );
}
