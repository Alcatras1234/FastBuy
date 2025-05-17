"use client";

import { Header } from "@/components/shared/header";
import { usePathname } from "next/navigation";

export function ClientHeader() {
  const pathname = usePathname();

  // Массив путей, где хедер не должен отображаться
  const hiddenHeaderPaths = ["/", "/dashboard"];
  const shouldHideHeader = hiddenHeaderPaths.some((path) =>
    pathname.startsWith(path)
  );

  return !shouldHideHeader ? <Header /> : null;
}