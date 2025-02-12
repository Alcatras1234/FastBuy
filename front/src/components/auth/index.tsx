import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { Box } from "@mui/material";
import UserRegisterPage from "./registration/user";
import UsersLoginPage from "./login/users";
import VerificationPage from "./verify";
import OrganizerRegisterPageBaseInfo from "./registration/organizer/base_info";
import OrganizerRegisterPageCorpInfo from "./registration/organizer/corp_info";
import AdminLoginPage from "./login/admin";
import { registerUser, submitOrganizerCorpInfo, checkEmailVerification } from "../../utils/axios";
import "./style.scss";

const AuthRootComponent: React.FC = (): JSX.Element => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [corpName, setCorpName] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");

    const location = useLocation();
    const navigate = useNavigate();

    // Функция проверки email
    const isValidEmail = (email: string) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    // Функция проверки пароля
    const isValidPassword = (password: string) => {
        return password.length >= 8;
    };

    useEffect(() => {
        if (email) {
            const interval = setInterval(async () => {
                try {
                    const isVerified = await checkEmailVerification(email);
                    console.log(isVerified.response);

                    if (isVerified.response.status === 200) {
                        console.log("✅ Email подтвержден!");
                        clearInterval(interval);
                        navigate("/login/users");
                    }
                } catch (error) {
                    console.error("Ошибка проверки email:", error);
                }
            }, 5000); // Проверка каждые 5 секунд

            return () => clearInterval(interval);
        }
    }, [navigate]);

    // Подключение к WebSocket
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
                    console.log(response.body);
                    navigate("/verify", { state: { fromUserRegister: true } });
                } else {
                    const response = await registerUser(email, password, "ORGANIZER");
                    console.log("Server response:", response);
                    navigate("/verify", { state: { fromBaseInfo: true } });
                }

            } else if (location.pathname === "/organizer/register/corpInfo") {
                if (!corpName || !phoneNumber) throw new Error("Заполните все поля");

                try {
                    await submitOrganizerCorpInfo(corpName, phoneNumber, email);
                    console.log("Корпоративные данные успешно отправлены");
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