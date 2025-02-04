import { TextField, Button, Typography, Box } from "@mui/material";
import {IPropsAdminLogin} from "../../../../common/types/auth";

const AdminLoginPage: React.FC<IPropsAdminLogin> = (props: IPropsAdminLogin): JSX.Element => {
    const {setEmail, setPassword} = props

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
                    </Box>
            </div>
        </div>
    );
};

export default AdminLoginPage;