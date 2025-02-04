import { TextField, Button, Typography, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import {IPropsUsersLogin} from "../../../../common/types/auth";

const UsersLoginPage: React.FC<IPropsUsersLogin> = (props: IPropsUsersLogin): JSX.Element => {
    const {setEmail, setPassword} = props

    const navigate = useNavigate();

    const handleRedirecRegister = () => {
        navigate("/user/register");
    }

    /*    const handleSubmit = async (e: React.FormEvent) => {
            e.preventDefault();

            try {
                if (!email || !password) {
                    throw new Error("Заполните все поля");
                }

                const userData = { email, password };
                console.log("Авторизация пользователя:", userData);

                navigate("/");
            } catch (error: any) {
                setErrorMessage(error.message || "Ошибка входа");
            }
        };*/

    return (
        <div className="background-container">
            <div className="box">
                    <Typography variant="h2" fontFamily="Poppins" textAlign="center" padding={3}>
                        Авторизация
                    </Typography>

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

                    <Box display="flex" flexDirection="column" alignItems="center" mt={2}>
                        {/* Кнопка Войти */}
                        <Button type="submit" variant="contained" sx={{ width: "60%", mb: 1 }}>
                            Войти
                        </Button>
                        <Button variant="contained" sx={{ width: "60%", mb: 1 }} onClick={handleRedirecRegister}>
                            Регистрация
                        </Button>
                    </Box>
            </div>
        </div>
    );
};

export default UsersLoginPage;