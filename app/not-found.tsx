import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { Button } from "@/components/ui/button";

export default async function NotFound() {
  const t = await getTranslations("NotFound");

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-card px-6 text-center">
      <h1 className="text-6xl font-bold text-primary">404</h1>
      <p className="text-lg font-semibold text-foreground">{t("title")}</p>
      <p className="max-w-sm text-sm text-muted-foreground">{t("description")}</p>

      <Link href="/">
        <Button className="mt-4 cursor-pointer bg-primary text-primary-foreground hover:bg-primary/90">{t("back")}</Button>
      </Link>
    </div>
  );
}
