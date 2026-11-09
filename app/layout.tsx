import type { Metadata } from "next";
import localFont from "next/font/local";
import { NextIntlClientProvider } from "next-intl";
import { getLocale } from "next-intl/server";
import "./globals.css";
import Providers from "@/providers/Providers";

export const dynamic = "force-dynamic";

const googleSansFlex = localFont({
  src: [
    { path: "../public/fonts/GoogleSansFlex_24pt-Thin.ttf", weight: "100", style: "normal" },
    { path: "../public/fonts/GoogleSansFlex_24pt-ExtraLight.ttf", weight: "200", style: "normal" },
    { path: "../public/fonts/GoogleSansFlex_24pt-Light.ttf", weight: "300", style: "normal" },
    { path: "../public/fonts/GoogleSansFlex_24pt-Regular.ttf", weight: "400", style: "normal" },
    { path: "../public/fonts/GoogleSansFlex_24pt-Medium.ttf", weight: "500", style: "normal" },
    { path: "../public/fonts/GoogleSansFlex_24pt-SemiBold.ttf", weight: "600", style: "normal" },
    { path: "../public/fonts/GoogleSansFlex_24pt-Bold.ttf", weight: "700", style: "normal" },
    { path: "../public/fonts/GoogleSansFlex_24pt-ExtraBold.ttf", weight: "800", style: "normal" },
    { path: "../public/fonts/GoogleSansFlex_24pt-Black.ttf", weight: "900", style: "normal" },
  ],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Growth X Admin",
  description: "Staff portal for reviewing Growth X applications.",
  robots: { index: false, follow: false },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();

  return (
    <html lang={locale} suppressHydrationWarning className={`${googleSansFlex.variable}  antialiased`}>
      <body className="min-h-full flex flex-col">
        <NextIntlClientProvider>
          <Providers>{children}</Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
