import { Button, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const VerificationPage: React.FC = (): JSX.Element => {
    const [verificationCode, setVerificationCode] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const navigate = useNavigate();
    const location = useLocation();

    const handleVerification = () => {
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
            setErrorMessage("Неверный код. Попробуйте снова.");
        }
    };

    const handleBack = () => {
        navigate(-1); // Возвращаем пользователя на предыдущую страницу
    };

    return (
        <div className="root">
            <div className="background-container">
                <div className="box">
                    <Typography
                        variant="h2"
                        fontFamily="Poppins"
                        textAlign="center"
                        padding={3}
                    >
                        Верификация
                    </Typography>
                    <form className="form">
                        {errorMessage && (
                            <Typography variant="body2" color="error" textAlign="center">
                                {errorMessage}
                            </Typography>
                        )}
                        <TextField
                            fullWidth
                            margin="normal"
                            label="Введите код подтверждения"
                            variant="standard"
                            placeholder="Код подтверждения"
                            value={verificationCode}
                            onChange={(e) => setVerificationCode(e.target.value)}
                            required
                        />
                        <Button
                            sx={{ fontFamily: "Poppins", marginTop: 2, width: "100%" }}
                            variant="contained"
                            onClick={handleVerification}
                        >
                            Подтвердить
                        </Button>
                        <Button
                            sx={{ fontFamily: "Poppins", marginTop: 2, width: "100%" }}
                            variant="outlined"
                            onClick={handleBack}
                        >
                            Назад
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default VerificationPage;