import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Box } from "@mui/material";
import UserRegisterPage from "./user";
import OrganizerRegisterPageBaseInfo from "./organizer/base_info";
import OrganizerRegisterPageCorpInfo from "./organizer/corp_info";
import "./style.scss";

const RegistrationRootComponent: React.FC = (): JSX.Element => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [corpName, setCorpName] = useState("");
    const [phoneNumber, setPhoneNumber] = useState(""); // Для ошибок

    const location = useLocation();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            // Регистрация Покупателя
            if (location.pathname === "/user/register") {
                if (password === confirmPassword) {
                    const userRegistrationData = {
                        email,
                        password };
                    console.log("Регистрация пользователя: ", userRegistrationData);
                    navigate("/user/login"); // После регистрации переход на логин
                } else {
                    throw new Error("Пароли не совпадают");
                }
            }
            // Регистрация Организатора
            else if (location.pathname === "/organizer/register/baseInfo") {
                if (password === confirmPassword) {
                    const organizerRegistrationDates = {
                        email,
                        password
                    }
                }
            }
            else if (location.pathname === "/organizer/register/corpInfo") {
                const organizerRegistrationDates = {
                    corpName,
                    phoneNumber,
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
                            )  : null}
                        </Box>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default RegistrationRootComponent;