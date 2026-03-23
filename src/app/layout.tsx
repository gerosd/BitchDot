import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { getCategoriesAction } from "@/lib/actions/category-actions";
import {ThemeModeScript} from "flowbite-react";

const montserrat = Montserrat({
    variable: "--font-montserrat",
    subsets: ["latin", "cyrillic"],
});

export const metadata: Metadata = {
    title: "BitchDot",
};

export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="ru" suppressHydrationWarning>
            <body
                className={`${montserrat.variable} font-montserrat antialiased min-h-screen flex flex-col`}
            >
                <ThemeModeScript/>
                <Header categories={await getCategoriesAction().catch(() => [])} />
                <main className="grow">
                    {children}
                </main>
                <Footer />
            </body>
        </html>
    );
}
