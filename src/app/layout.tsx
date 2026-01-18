import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const inter = Inter({
    subsets: ["latin"],
    variable: "--font-inter",
    display: "swap",
});

const outfit = Outfit({
    subsets: ["latin"],
    variable: "--font-outfit",
    display: "swap",
});

export const metadata: Metadata = {
    title: "Saladly - Fresh, Healthy Salads Delivered Daily",
    description:
        "Nutritious, hygienic & delicious salads made fresh every morning. Order now or subscribe for daily healthy meals delivered to your door.",
    keywords: [
        "salad delivery",
        "healthy food",
        "fresh salads",
        "meal subscription",
        "nutritious meals",
    ],
    openGraph: {
        title: "Saladly - Fresh, Healthy Salads Delivered Daily",
        description:
            "Nutritious, hygienic & delicious salads made fresh every morning.",
        type: "website",
        locale: "en_US",
    },
    twitter: {
        card: "summary_large_image",
        title: "Saladly - Fresh, Healthy Salads Delivered Daily",
        description:
            "Nutritious, hygienic & delicious salads made fresh every morning.",
    },
    robots: {
        index: true,
        follow: true,
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className={`${inter.variable} ${outfit.variable}`}>
            <body className="font-sans">
                <Header />
                <main>{children}</main>
                <Footer />
            </body>
        </html>
    );
}
