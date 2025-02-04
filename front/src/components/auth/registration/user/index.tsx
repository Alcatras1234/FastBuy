import { Button, TextField, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { IPropsUserRegister } from "../../../../common/types/auth"; // Убедитесь, что этот путь и тип корректны

const UserRegisterPage: React.FC<IPropsUserRegister> = (props: IPropsUserRegister): JSX.Element => {
    const { setEmail, setPassword, setConfirmPassword } = props;
    const navigate = useNavigate();

    const handleVerify = () => {
        navigate("/verify", { state: { fromUserRegister: true } }); // Перенаправление на страницу логина
    };
    const handleOrganizerRedirect = () => {
        navigate("/organizer/register/baseInfo");
    };
    const handleBack = () => {
        navigate(-1); // Возвращает на предыдущую страницу в истории
    };

    return (
        <div className="background-container">
            <div className="box">
                {/* Логотип */}
                <div style={{ display: "flex", justifyContent: "center", marginBottom: "20px" }}>
                    <img
                        src="/Users/tengisangrikov/WebstormProjects/train/front/src/utils/image/img.png" // Замените на реальный путь к вашему логотипу
                        alt="Логотип"
                        style={{ maxWidth: "150px", height: "auto" }}
                    />
                </div>
                <Typography
                    variant="h2"
                    fontFamily="Poppins"
                    textAlign="center"
                    padding={3}
                >
                    Регистрация
                </Typography>
                <form>
                    <TextField
                        fullWidth
                        margin="normal"
                        label="E-mail"
                        variant="standard"
                        placeholder="Введите E-mail"
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <TextField
                        type="password"
                        fullWidth
                        margin="normal"
                        label="Пароль"
                        variant="standard"
                        placeholder="Введите пароль"
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <TextField
                        type="password"
                        fullWidth
                        margin="normal"
                        label="Повторите пароль"
                        variant="standard"
                        placeholder="Повторите пароль"
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />
                    <Button
                        sx={{ fontFamily: "Poppins", marginTop: 2, width: "100%" }}
                        variant="contained"
                        type="submit"
                        onClick={handleVerify}
                    >
                        Зарегистрироваться
                    </Button>
                    <Typography
                        variant="body1"
                        fontFamily="Poppins"
                        textAlign="center"
                        padding={3}
                    >
                        Хотите стать организатором?{" "}
                        <span
                            className="reg"
                            onClick={handleOrganizerRedirect}
                            style={{ cursor: "pointer", color: "blue" }}
                        >
                        Регистрация для организатора
                    </span>
                    </Typography>
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
    );
};

export default UserRegisterPage;