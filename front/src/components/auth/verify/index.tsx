import { Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

const VerificationPage: React.FC = (): JSX.Element => {
    const navigate = useNavigate();

    const handleBack = () => {
        navigate(-1); // Возвращаем пользователя на предыдущую страницу
    };

    return (
        <div className="root">
            <div className="background-container">
                <div className="box">
                    <Typography
                        variant="h4"
                        fontFamily="Poppins"
                        textAlign="center"
                        padding={3}
                    >
                        Подтвердите ваш email
                    </Typography>
                    <Typography
                        variant="body1"
                        fontFamily="Poppins"
                        textAlign="center"
                        padding={2}
                    >
                        Мы отправили вам письмо с ссылкой для подтверждения.
                        Пожалуйста, проверьте вашу почту и перейдите по ссылке.
                    </Typography>
                    <Typography
                        variant="body2"
                        fontFamily="Poppins"
                        textAlign="center"
                        padding={2}
                        color="gray"
                    >
                        Если письмо не пришло, проверьте папку "Спам".
                    </Typography>

                    {/* Кнопка назад */}
                    <Button
                        variant="outlined"
                        fullWidth
                        sx={{ marginTop: 3, fontFamily: "Poppins", color: "#555" }}
                        onClick={handleBack}
                    >
                        Назад
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default VerificationPage;