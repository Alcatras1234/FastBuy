import { Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

const PendingPage: React.FC = (): JSX.Element => {
    const navigate = useNavigate();

    const handleBack = () => {
        navigate("/login/users"); // Возвращаем пользователя на предыдущую страницу
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
                        Ожидайте подтверждения
                    </Typography>
                    <Typography
                        variant="body1"
                        fontFamily="Poppins"
                        textAlign="center"
                        padding={2}
                    >
                        Дождитесь пока организатор свяжется с вами
                        и одобрит вашу заявку
                    </Typography>
                    <Typography
                        variant="body2"
                        fontFamily="Poppins"
                        textAlign="center"
                        padding={2}
                        color="gray"
                    >
                        Связь будет проходить по телефонному номеру
                    </Typography>

                    {/* Кнопка назад */}
                    <Button
                        variant="outlined"
                        fullWidth
                        sx={{ marginTop: 3, fontFamily: "Poppins", color: "#555" }}
                        onClick={handleBack}
                    >
                        Далее
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default PendingPage;