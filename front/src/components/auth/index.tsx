import { useLocation } from "react-router-dom";
import LoginPage from "./login";
import RegisterPage from "./register";
import "./style.scss";
import { Box } from "@mui/material";
import { useState } from "react";
import { instance } from "../../utils/axios";
import { useAppDispatch } from "../../utils/hook";
import { login } from "../../store/slice/auth";
import {useNavigate} from "react-router-dom";

const AuthRootComponent: React.FC = (): JSX.Element => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [fullName, setFullName] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [role, setSelectedRole] = useState("");
    const [errorMessage, setErrorMessage] = useState(""); // Для отображения ошибок

    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const handleSubmit = async (e: { preventDefault: () => void }) => {
        e.preventDefault();

        try {
            if (location.pathname === "/login") {
                const userDates = {
                    email,
                    password,
                };
                const user = await instance.post("auth/login", userDates);
                dispatch(login(user.data));
                navigate("/");
                console.log(email);
            } else {
                if (password === confirmPassword) {
                    const userDates = {
                        fullName,
                        email,
                        password,
                        role,
                    };
                    // const user = await instance.post('auth/register', userDates);
                    console.log(userDates); // Временно логируем данные
                } else {
                    throw new Error("Пароли не совпадают");
                }
            }
        } catch (error: any) {
            setErrorMessage(error.message || "Ошибка авторизации");
        }
    };

    return (
        <div className="root">
            <form className="form" onSubmit={handleSubmit}>
                <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    flexDirection="column"
                    maxWidth={640}
                    margin="auto"
                    padding={5}
                    borderRadius={5}
                    boxShadow={"5px 5px 10px #ccc"}
                >
                    {errorMessage && (
                        <p style={{ color: "red", marginBottom: "10px" }}>{errorMessage}</p>
                    )}
                    {location.pathname === "/login" ? (
                        <LoginPage setEmail={setEmail} setPassword={setPassword} />
                    ) : location.pathname === "/register" ? (
                        <RegisterPage
                            setEmail={setEmail}
                            setPassword={setPassword}
                            setFullName={setFullName}
                            setConfirmPassword={setConfirmPassword}
                            setSelectedRole={setSelectedRole}
                        />
                    ) : null}
                </Box>
            </form>
        </div>
    );
};

export default AuthRootComponent;