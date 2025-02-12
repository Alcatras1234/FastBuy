import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { Box } from "@mui/material";
import UserRegisterPage from "./registration/user";
import UsersLoginPage from "./login/users";
import VerificationPage from "./verify";
import OrganizerRegisterPageBaseInfo from "./registration/organizer/base_info";
import OrganizerRegisterPageCorpInfo from "./registration/organizer/corp_info";
import AdminLoginPage from "./login/admin";
import { registerUser, submitOrganizerCorpInfo } from "../../utils/axios";
import * as SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import "./style.scss";

const AuthRootComponent: React.FC = (): JSX.Element => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [corpName, setCorpName] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [userUUID, setUserUUID] = useState<string | null>(null);
    const [message, setMessage] = useState<string | null>(null);

    const location = useLocation();
    const navigate = useNavigate();
    const stompClientRef = useRef<Client | null>(null);

    // Функция проверки email
    const isValidEmail = (email: string) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    // Функция проверки пароля
    const isValidPassword = (password: string) => {
        return password.length >= 8;
    };

    // Подключение к WebSocket
    const connect = (uuid: string) => {
        if (stompClientRef.current) return;

        const socket = new SockJS("http://45.145.4.240:8080/ws");
        const stompClient = new Client({
            webSocketFactory: () => socket,
            reconnectDelay: 5000,

            onConnect: (frame) => {
                console.log("✅ WebSocket подключен:", frame);
                stompClient.subscribe(`/topic/message/${uuid}`, (response) => {
                    const receivedMessage = JSON.parse(response.body);
                    setMessage(receivedMessage);
                });
            },

            onStompError: (frame) => {
                console.error("❌ Ошибка STOMP:", frame);
            },
        });

        stompClient.activate();
        stompClientRef.current = stompClient;
    };

    // Обработчик отправки формы
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            if (location.pathname === "/user/register" || location.pathname === "/organizer/register/baseInfo") {
                if (!email || !password || !confirmPassword) throw new Error("Заполните все поля");
                if (!isValidEmail(email)) throw new Error("Некорректный формат email");
                if (!isValidPassword(password)) throw new Error("Пароль должен содержать минимум 8 символов");
                if (password !== confirmPassword) throw new Error("Пароли не совпадают");

                if (location.pathname === "/user/register") {
                    const response = await registerUser(email, password, "USER");
                    const userUUID = response.body;
                    setUserUUID(userUUID);
                    connect(userUUID);
                    navigate("/verify", { state: { fromUserRegister: true } });
                } else {
                    const response = await registerUser(email, password, "ORGANIZER");
                    const userUUID = response.body;
                    setUserUUID(userUUID);
                    connect(userUUID);
                    navigate("/verify", { state: { fromBaseInfo: true } });
                }

            } else if (location.pathname === "/organizer/register/corpInfo") {
                if (!corpName || !phoneNumber) throw new Error("Заполните все поля");

                try {
                    await submitOrganizerCorpInfo(corpName, phoneNumber, email);
                    console.log("✅ Корпоративные данные успешно отправлены");
                    navigate("/organizer/pending"); // Перенаправляем организатора на страницу ожидания
                } catch (error: any) {
                    setErrorMessage(error.message || "Ошибка отправки данных");
                }

            } else if (location.pathname === "/login/users" || location.pathname === "/login/admin") {
                if (!email || !password) throw new Error("Заполните все поля");
                navigate("/user/home");

            } else if (location.pathname === "/verify") {
                    if (location.state?.fromBaseInfo) navigate("/organizer/register/corpInfo");
                    else navigate("/login/users");
            }
        } catch (error: any) {
            setErrorMessage(error.message || "Ошибка обработки данных");
        }
    };

    // Проверяем WebSocket-сообщение
    useEffect(() => {
        if (message === "true") {
            console.log("✅ Email подтверждён! Перенаправление на страницу логина...");
            navigate("/login/users");
        }
    }, [message, navigate]);

    // Подключаем WebSocket при наличии UUID
    useEffect(() => {
        if (userUUID) {
            connect(userUUID);
        }
    }, [userUUID]);

    return (
        <div className="root">
            <div className="background-container">
                <div className="box">
                    <form className="form" onSubmit={handleSubmit}>
                        <Box
                            display="flex"
                            justifyContent="center"
                            alignItems="center"
                            flexDirection="column"
                            maxWidth={640}
                            margin="normal"
                            padding={5}
                            borderRadius={5}
                            boxShadow={"5px 5px 10px #ccc"}
                        >
                            {errorMessage && <p style={{ color: "red", marginBottom: "10px" }}>{errorMessage}</p>}

                            {location.pathname === "/user/register" ? (
                                <UserRegisterPage setEmail={setEmail} setPassword={setPassword} setConfirmPassword={setConfirmPassword} />
                            ) : location.pathname === "/organizer/register/baseInfo" ? (
                                <OrganizerRegisterPageBaseInfo setEmail={setEmail} setPassword={setPassword} setConfirmPassword={setConfirmPassword} />
                            ) : location.pathname === "/organizer/register/corpInfo" ? (
                                <OrganizerRegisterPageCorpInfo setPhoneNumber={setPhoneNumber} setCorpName={setCorpName} />
                            ) : location.pathname === "/login/users" ? (
                                <UsersLoginPage setEmail={setEmail} setPassword={setPassword} />
                            ) : location.pathname === "/login/admin" ? (
                                <AdminLoginPage setEmail={setEmail} setPassword={setPassword} />
                            ) : location.pathname === "/verify" ? (
                                <VerificationPage  />
                            ) : location.pathname === "/verify-email" ? (
                                <h2>📩 Подтвердите email! Проверьте почту и нажмите на ссылку.</h2>
                            ) : null}
                        </Box>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AuthRootComponent;