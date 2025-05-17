import { Auth } from "@/components/shared/auth";
import Image from "next/image";

export default function Home() { // Это главный компонент приложения, он отвевчает за отображение всего приложения
  return (
    <Auth /> // Мы сюда добалили компонент Auth
  );
}
