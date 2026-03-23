import Link from 'next/link';
import Container from '@/components/ui/Container';

export default function NotFound() {
    return (
        <Container className="min-h-[70vh] flex flex-col items-center justify-center py-20 text-center">
            <h1 className="text-8xl md:text-9xl font-bold text-base-content/20 mb-4 select-none">
                404
            </h1>
            <h2 className="text-2xl md:text-3xl font-bold text-base-content mb-4 tracking-tight">
                Страница не найдена
            </h2>
            <p className="text-surface-content-muted max-w-md mb-8">
                Возможно, эта страница была удалена, переименована, или вы просто ошиблись адресом.
            </p>
            <Link
                href="/"
                className="inline-flex items-center justify-center px-8 py-3.5 bg-base-content text-base font-medium uppercase tracking-wider hover:bg-base-content/90 transition-colors rounded-lg"
            >
                На главную
            </Link>
        </Container>
    );
}