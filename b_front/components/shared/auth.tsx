"use client"

import { Label } from "@radix-ui/react-label";
import { Tabs, TabsContent } from "@radix-ui/react-tabs";
import { useState } from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";

export const Auth = () => {
    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);

    const handleLogin = async () => {
        setError(null);
        console.log(login, password);
        try {
            const response = await fetch('http://127.0.0.1/api/auth/admin', {
                method: "GET",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                    "Login": login,
                    "Password": password
                },
            });

            if (!response.ok) {
                const errorMessage = await response.text();
                setError(errorMessage);
                throw new Error(errorMessage);
            }

            // Перевести на стрницу с матчами
            // router.push('/dashboard');

        } catch (error: unknown) {
            if (error instanceof Error) {
                setError(error.message);
            }
        }
    };

    return (
        <Tabs defaultValue="account" className="flex items-center justify-center h-screen w-screen ">
            <TabsContent value="account">
                <Card className="w-[400px]">
                    <CardHeader>
                        <CardTitle>Вход в систему</CardTitle>
                        <CardDescription>
                            Введите логин и пароль для входа в систему
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <div className="space-y-1">
                            <Label htmlFor="login">Login</Label>
                            <Input id="login" value={login} onChange={(e) => setLogin(e.target.value)} />
                        </div>
                        <div className="space-y-1">
                            <Label htmlFor="password">Password</Label>
                            <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                        </div>
                        {error && <p className="text-red-500">{error}</p>}
                    </CardContent>
                    <CardFooter>
                        <Button onClick={handleLogin}>Log in</Button>
                    </CardFooter>
                </Card>
            </TabsContent>
        </Tabs>
    );
}