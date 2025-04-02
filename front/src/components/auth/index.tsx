import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { Box } from "@mui/material";
import UserRegisterPage from "./registration/user";
import UsersLoginPage from "./login/users";
import VerificationPage from "./verify/verifyEmail";
import OrganizerRegisterPageBaseInfo from "./registration/organizer/base_info";
import OrganizerRegisterPageCorpInfo from "./registration/organizer/corp_info";
import AdminLoginPage from "./login/admin";
import PendingPage from "./verify/verifyCorpInfo";
import {useAppDispatch} from "../../utils/hook";
import {loginUserAction} from "../../store/slice/auth/user";
import {loginOrganizerAction} from "../../store/slice/auth/organizer";
import { registerUser, submitOrganizerCorpInfo, checkEmailVerification, loginUser, loginAdmin } from "../../utils/axios";
import "./style.scss";

const AuthRootComponent: React.FC = (): JSX.Element => {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [confirmPassword, setConfirmPassword] = useState<string>("");
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [corpName, setCorpName] = useState<string>("");
    const [phoneNumber, setPhoneNumber] = useState<string>("");
    const [isCheckingEmail, setIsCheckingEmail] = useState<boolean>(false);
    const [userRole, setUserRole] = useState<"USER" | "ORGANIZER" | null>(null);

    const emailRef = useRef<string>("");
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    const isValidPassword = (password: string) => password.length >= 8;

    useEffect(() => {
        const storedEmail = localStorage.getItem("pendingEmail");

        if (storedEmail) {
            console.log("✅ Загружаем email пользователя из localStorage...");
            setEmail(storedEmail);
            emailRef.current = storedEmail;
            setIsCheckingEmail(true);
        }
    }, [location.pathname]);

    useEffect(() => {
        if (location.pathname !== "/verify") return;
        console.log(localStorage.getItem("pendingEmail"));
        let storedEmail = localStorage.getItem("pendingEmail");
        let storedRole = localStorage.getItem("userRole");
        console.log(localStorage.getItem("pendingEmail"));

        if (!storedEmail || !storedRole) {
            console.warn("🔄 Повторное чтение localStorage...");
            storedEmail = localStorage.getItem("pendingEmail");
            storedRole = localStorage.getItem("userRole");
        }

        if (!storedEmail || !storedRole) {
            console.error("🚨 Нет email или роли в localStorage! Останавливаем проверку.");
            return;
        }

        console.log("⏳ Начало проверки email...");

        const interval = setInterval(async () => {
            try {
                console.log("🔍 Проверяем email:", storedEmail);
                const response = await checkEmailVerification(storedEmail);

                if (response?.status === 200 && response.data === "email провалидирован!") {
                    console.log("✅ Email подтвержден! Остановка проверки.");

                    clearInterval(interval);

                    setTimeout(() => {
                        navigate(storedRole === "ORGANIZER" ? "/organizer/register/corpInfo" : "/login/users");
                    }, 2000);
                }
            } catch (error) {
                console.error("⚠️ Ошибка при проверке email:", error);
            }
        }, 10000); // Проверка email каждые 10 секунд

        return () => {
            console.log("🛑 Очистка интервала проверки email.");
            clearInterval(interval);
        };
    }, [location.pathname]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            if (location.pathname === "/user/register" || location.pathname === "/organizer/register/baseInfo") {
                if (!email || !password || !confirmPassword) throw new Error("Заполните все поля");
                if (!isValidEmail(email)) throw new Error("Некорректный формат email");
                if (!isValidPassword(password)) throw new Error("Пароль должен содержать минимум 8 символов");
                if (password !== confirmPassword) throw new Error("Пароли не совпадают");

                const role = location.pathname === "/user/register" ? "USER" : "ORGANIZER";

                console.log("📩 Отправка запроса на регистрацию:", email, password, role);
                localStorage.setItem("pendingEmail", email);
                localStorage.setItem("userRole", role);
                console.log(localStorage.getItem("pendingEmail"));
                const response = await registerUser(email, password, role);

                if (response?.status !== 200) {
                    throw new Error("Ошибка регистрации. Попробуйте снова.");
                }
                console.log(localStorage.getItem("pendingEmail"));

                console.log("✅ Регистрация успешна! Сохранение данных в localStorage...");
                setIsCheckingEmail(true);

                console.log("🚀 Переход на страницу верификации...");
                setTimeout(() => {
                    console.log(localStorage.getItem("pendingEmail"));
                    navigate("/verify", { state: { fromUserRegister: role === "USER", fromBaseInfo: role === "ORGANIZER" } });
                }, 100);

            } else if (location.pathname === "/organizer/register/corpInfo") {
                console.log(localStorage.getItem("pendingEmail"));
                if (!corpName || !phoneNumber) throw new Error("Заполните все поля");
                const storageEmail = localStorage.getItem("pendingEmail");
                if (!storageEmail) throw new Error("Email не найден");

                console.log("📜 Отправка корпоративных данных...");
                const response = await submitOrganizerCorpInfo(storageEmail, corpName, phoneNumber);
                console.log("✅ Корпоративные данные успешно отправлены");
                console.log(response);
                localStorage.removeItem("pendingEmail");
                localStorage.removeItem("userRole");
                navigate("/pending");

            } else if (location.pathname === "/login/users" || location.pathname === "/login/admin") {
                if (!email || !password) throw new Error("Заполните все поля");

                console.log("🔑 Попытка входа...");
                if (location.pathname === "/login/admin") {
                    const response = await loginAdmin(email, password);
                    console.log("🎩 Администратор вошел:", response);
                } else {
                    const response = await loginUser(email, password);
                    if (response?.data.role === "user") {
                        console.log(response.data);
                        dispatch(loginUserAction(response.data));
                        navigate("/user/home");
                    } else if (response?.data.role === "organizer") {
                        console.log(response.data);
                        dispatch(loginOrganizerAction(response.data));
                        navigate("/organizer/home");
                    } else {
                        throw new Error("Неверные учетные данные");
                    }
                }

            } else if (location.pathname === "/verify") {
                navigate(location.state?.fromBaseInfo ? "/organizer/register/corpInfo" : "/login/users");
            }
        } catch (error: any) {
            console.error("❌ Ошибка:", error.message);
            setErrorMessage(error.message || "Ошибка обработки данных");
        }
    };

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
                                <VerificationPage />
                            ) : location.pathname === "/pending" ? (
                                <PendingPage/>
                            ): null}
                        </Box>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AuthRootComponent;