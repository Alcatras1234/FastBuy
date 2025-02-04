import { useState } from "react";
import { TextField, Button, Typography, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";

const AdminLoginPage: React.FC = (): JSX.Element => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
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
    };

    return (
        <div className="background-container">
            <div className="box">
                <form onSubmit={handleSubmit}>
                    <Typography variant="h2" fontFamily="Poppins" textAlign="center" padding={3}>
                        Авторизация
                    </Typography>

                    {errorMessage && <p style={{ color: "red", textAlign: "center" }}>{errorMessage}</p>}

                    <TextField
                        fullWidth
                        margin="normal"
                        label="E-mail"
                        variant="standard"
                        placeholder="Введите E-mail"
                        value={email}
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
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />

                    <Box display="flex" flexDirection="column" alignItems="center" mt={2}>
                        {/* Кнопка Войти */}
                        <Button type="submit" variant="contained" sx={{ width: "60%", mb: 1 }}>
                            Войти
                        </Button>
                    </Box>
                </form>
            </div>
        </div>
    );
};

export default AdminLoginPage;