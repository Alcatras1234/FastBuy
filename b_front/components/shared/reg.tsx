"use client";

import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function Registration() {
    const router = useRouter();
    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const handleLogin = async () => {
        setError(null);
        console.log(login, password);
        try {
            localStorage.setItem('email', login);
            const response = await fetch('http://localhost:8080/api/auth_service/registration', {
                method: "POST",
                // credentials: "include", - указывать когда используем куки
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: login,
                    password: password,
                    role: "USER"
                }),
            })

            if (!response.ok) {
                const errorMessage = await response.text();
                setError(errorMessage);
                throw new Error(errorMessage);
            }

            router.push('/registration/email-confirm');

        } catch (error: unknown) {
            if (error instanceof Error) {
                setError(error.message);
            }
        }
    };

    useEffect(() => {
        if (error) {
            toast.error(error);
        }
    }, [error]); // вот это фигня запускается каждый раз когда меняется ошибка

    const handleCheckPasswords = () => {
        if (confirmPassword !== password) {
            setError("Passwords do not match");
        } else {
            setError(null);
            handleLogin();
        }
    }

    return (
        <div className="flex min-h-screen">
            {/* Left Side - Login Form */}
            <div className="flex flex-col justify-center items-center w-1/2 p-10 bg-white">
                <h1 className="text-4xl font-bold mb-13 text-green-900 items-start">Sing in</h1>

                <div className="flex flex-col space-y-4 w-full max-w-sm">
                    <Input type="email" placeholder="Your email..." className="bg-gray-100" onChange={e => setLogin(e.target.value)} />
                    <Input type="password" placeholder="Password..." className="bg-gray-100" onChange={e => setPassword(e.target.value)} />
                    <Input type="password" placeholder="Password..." className="bg-gray-100" onChange={e => setConfirmPassword(e.target.value)} />

                    <div className="flex justify-between text-sm text-gray-400">
                        <span>Enter as admin</span>
                        <span>Forgot password?</span>
                    </div>

                    <Button className="bg-green-800 hover:bg-green-900 text-white font-bold py-2 mt-4" onClick={handleCheckPasswords}>
                        Sing in
                    </Button>

                    <p className="text-sm text-gray-500 text-center mt-4">
                        Registired? <span className="text-green-800 font-semibold cursor-pointer" onClick={() => router.push("/auth")}>Sign up!</span>
                    </p>
                </div>
            </div>

            {/* Right Side - Logo */}
            <div className="flex justify-center items-center w-1/2 bg-gray-50">
                <div className="flex items-center space-x-4">
                    <div className="text-green-800 text-5xl">⚽️</div>
                    <span className="text-green-800 text-5xl font-medium">FastBuy</span>
                </div>
            </div>
        </div>
    );
}