import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { toast } from "sonner";
import { useRouter } from "next/navigation";


export function EmailConfirm() {
    const router = useRouter();
    const [error, setError] = useState<string | null>(null);

    const handleCheckEmail = async () => {
        try {
            const email = localStorage.getItem('email');
            const role = localStorage.getItem('role');
            const response = await fetch(`http://localhost:8080/api/auth_service/email?email=${email}`, {
                method: "GET",
                // credentials: "include", - указывать когда используем куки
                headers: {
                    "Content-Type": "application/json",
                }
            })

            
            if (!response.ok) {
                const errorMessage = await response.text();
                setError(errorMessage);
                throw new Error(errorMessage);
            }

            toast.success("Email подтвержден");
            localStorage.removeItem('email');
            setTimeout(() => {
                if (role === "USER") {
                    router.push('/auth');
                } else {    
                    router.push('/registration/organizer-confirm');
                }
            }, 2000);
        } catch (error: unknown) {
            if (error instanceof Error) {
                setError(error.message);
                console.log(error.message);
            }
        }


    }

    const handleSendEmail = async () => {
        try {
            const email = localStorage.getItem('email');
            const response = await fetch(`http://localhost:8080/api/auth_service/sender?email=${email}`, {
                method: "GET",
                // credentials: "include", - указывать когда используем куки
                headers: {
                    "Content-Type": "application/json",
                }
            })

            if (!response.ok) {
                const errorMessage = await response.text();
                setError(errorMessage);
                throw new Error(errorMessage);
            }

            toast.success("Email отправлен");
        } catch (error: unknown) {
            if (error instanceof Error) {
                setError(error.message);
            }
        }
    }
    
    useEffect(() => {
    const interval = setInterval(() => {
        handleCheckEmail();
    }, 10000); // 10000 мс = 10 секунд

    return () => clearInterval(interval); // очистка интервала при размонтировании
}, []);

    useEffect(() => {
        if (error) {
            toast.error(error);
        }
    }, [error]); // вот это фигня запускается каждый раз когда меняется ошибка

    return (
        <div className="flex justify-center items-center min-h-screen">
            <Card className="w-[350px] ">
                <CardHeader>
                    <CardTitle>Подтвердите свой email</CardTitle>
                    <CardDescription>В письме на почте кликните на ссылку</CardDescription>
                    <Button className="mt-4" onClick={handleSendEmail}>Отправить письмо повторно</Button>
                </CardHeader>
            </Card>
        </div>
    );
}