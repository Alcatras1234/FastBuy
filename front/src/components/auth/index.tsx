import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Box } from "@mui/material";
import UserRegisterPage from "./registration/user";
import UsersLoginPage from "./login/users";
import VerificationPage from "./verify";
import OrganizerRegisterPageBaseInfo from "./registration/organizer/base_info";
import OrganizerRegisterPageCorpInfo from "./registration/organizer/corp_info";
import "./style.scss";
import AdminLoginPage from "./login/admin";
import {registerUser} from "../../utils/axios";

const AuthRootComponent: React.FC = (): JSX.Element => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [corpName, setCorpName] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [verificationCode, setVerificationCode] = useState("");

    const location = useLocation();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            // Регистрация Покупателя
            if (location.pathname === "/user/register") {
                if (!email || !password || !confirmPassword) {
                    throw new Error("Заполните все поля");
                }
                if (password === confirmPassword) {
                    const userRegistrationData = {
                        email,
                        password };
                        // ТУТ Я ПОМЕНЯЛ, ДОБАВИЛ ОТПРАВКУ ПАРОЛЯ И РОЛИ
                    registerUser(userRegistrationData.email, userRegistrationData.password, "USER"); 
                    navigate("/verify", { state: { fromUserRegister: true } });
                    //console.log("Регистрация пользователя: ", userRegistrationData);// После регистрации переход на логин
                } else {
                    throw new Error("Пароли не совпадают");
                }
            }
            // Регистрация Организатора первая
            else if (location.pathname === "/organizer/register/baseInfo") {
                if (!email || !password || !confirmPassword) {
                    throw new Error("Заполните все поля");
                }
                if (password === confirmPassword) {
/*                    const organizerRegistrationDates = {
                        email,
                        password
                    }*/
                    navigate("/verify", { state: { fromBaseInfo: true } });
                }
            }
            // Регистрация организатора вторая
            else if (location.pathname === "/organizer/register/corpInfo") {
                if (!corpName || !phoneNumber) {
                    throw new Error("Заполните все поля");
                }
/*                const organizerRegistrationDates = {
                    corpName,
                    phoneNumber,
                }*/
                navigate("/login/users")
            }
            // Авторизация пользователя
            else if (location.pathname === "/login/users") {
                if (!email || !password) {
                    throw new Error("Заполните все поля");
                }
                navigate("/user/home")
                console.log(email)
            }
            // Авторизация админа
            else if (location.pathname === "/login/admin") {
                if (!email || !password) {
                    throw new Error("Заполните все поля");
                }
                navigate("/user/home")
                console.log(email)
            }
            // Верификация
            else if (location.pathname === "/verify") {
                if (verificationCode === "123456") { // Пример верификационного кода
                    // Проверяем откуда пришел пользователь
                    if (location.state?.fromBaseInfo) {
                        // Если пришел с /organizer/register/baseInfo, переходим на /organizer/register/corpInfo
                        navigate("/organizer/register/corpInfo");
                    } else if (location.state?.fromUserRegister) {
                        // Если пришел с /user/register, переходим на /user/login
                        navigate("/login/users");
                    } else {
                        // Если не передано состояние, просто перенаправляем на логин
                        navigate("/login/users");
                    }
                } else {
                    console.log("unlucky");
                }
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
                            {errorMessage && (
                                <p style={{ color: "red", marginBottom: "10px" }}>{errorMessage}</p>
                            )}
                            { location.pathname === "/user/register" ? (
                                <UserRegisterPage
                                    setEmail={setEmail}
                                    setPassword={setPassword}
                                    setConfirmPassword={setConfirmPassword}
                                />
                            ) : location.pathname === "/organizer/register/baseInfo" ? (
                                <OrganizerRegisterPageBaseInfo
                                    setEmail={setEmail}
                                    setPassword={setPassword}
                                    setConfirmPassword={setConfirmPassword}
                                />
                            ) : location.pathname === "/organizer/register/corpInfo" ? (
                                <OrganizerRegisterPageCorpInfo
                                    setPhoneNumber = {setPhoneNumber}
                                    setCorpName = {setCorpName}
                                />
                            ) : location.pathname === "/login/users" ? (
                                <UsersLoginPage
                                    setEmail = {setEmail}
                                    setPassword = {setPassword}
                                />
                            ) : location.pathname === "/login/admin" ? (
                                <AdminLoginPage
                                    setEmail = {setEmail}
                                    setPassword = {setPassword}
                                />
                            ) : location.pathname === "/verify" ? (
                                <VerificationPage
                                    setVerificationCode = {setVerificationCode}
                                />
                            )  : null}
                        </Box>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AuthRootComponent;