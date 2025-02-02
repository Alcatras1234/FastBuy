import { Button, TextField, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import {IPropsOrganizerRegisterBaseInfo} from "../../../../../common/types/auth";// Убедитесь, что этот путь и тип корректны

const OrganizerRegisterPageBaseInfo: React.FC<IPropsOrganizerRegisterBaseInfo> = (props: IPropsOrganizerRegisterBaseInfo): JSX.Element => {
    const { setEmail, setPassword, setConfirmPassword } = props;
    const navigate = useNavigate();

    const handleCorpRegistrationRedirect = () => {
        navigate("/verify", { state: { fromBaseInfo: true } }); // Перенаправление на страницу логина
    };
    const handleBack = () => {
        navigate("/user/register"); // Возвращает на предыдущую страницу в истории
    };

    return (
        <div className="background-container">
            <div className="box">
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
                        onClick={handleCorpRegistrationRedirect}
                    >
                        Далее
                    </Button>
                    <Button
                        sx={{ fontFamily: "Poppins", marginTop: 2, width: "100%" }}
                        variant="outlined"
                        onClick={handleBack}
                    >
                        Назад
                    </Button>
                </form>
{/*                <Typography
                    variant="body1"
                    fontFamily="Poppins"
                    textAlign="center"
                    padding={3}
                >
                    Есть аккаунт?{" "}
                    <span
                        className="reg"
                        onClick={handleLoginRedirect}
                        style={{ cursor: "pointer", color: "blue" }}
                    >
                        Авторизация
                    </span>
                </Typography>*/}
            </div>
        </div>
    );
};

export default OrganizerRegisterPageBaseInfo;