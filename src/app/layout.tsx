import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { getCategoriesAction } from "@/lib/actions/category-actions";
import { getSettingsAction } from "@/lib/actions/settings-actions";
import InjectScripts from "@/components/layout/InjectScripts";
import { cookies } from "next/headers";

const montserrat = Montserrat({
    variable: "--font-montserrat",
    subsets: ["latin", "cyrillic"],
});

export const metadata: Metadata = {
    title: "BITCHDOT",
};

export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const settings = await getSettingsAction().catch(() => null);
    
    const cookieStore = await cookies();
    const isAdmin = cookieStore.has('admin_session');
    const isSiteON = settings?.isSiteEnabled ?? false;
    const shouldLoadFromDB = isSiteON || isAdmin;

    const categories = shouldLoadFromDB 
        ? await getCategoriesAction().catch(() => []) 
        : [];

    const headScripts = settings?.analyticsScripts?.head;
    const bodyStartScripts = settings?.analyticsScripts?.bodyStart;
    const bodyEndScripts = settings?.analyticsScripts?.bodyEnd;

    return (
        <html lang="ru" suppressHydrationWarning>
            {headScripts ? (
                <head>
                    <InjectScripts html={headScripts} />
                </head>
            ) : null}
            <body
                className={`${montserrat.variable} font-montserrat antialiased min-h-screen flex flex-col`}
            >
                {bodyStartScripts && <InjectScripts html={bodyStartScripts} />}
                <Header categories={categories} shouldLoadFromDB={shouldLoadFromDB} />
                <main className="grow">
                    {children}
                </main>
                <Footer categories={categories} />
                {bodyEndScripts && <InjectScripts html={bodyEndScripts} />}
            </body>
        </html>
    );
}
