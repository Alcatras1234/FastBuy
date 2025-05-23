"use client"

import { useRouter } from "next/navigation";

export default function Home() { // Это главный компонент приложения, он отвевчает за отображение всего приложения
  const remote = useRouter(); 
  remote.push('/auth');
  return (
    <>
      
    </>
  );
}
