import { Button, TextField, Typography, Select, MenuItem, FormControl, InputLabel } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { IPropsRegister } from "../../../common/types/auth";
import { SelectChangeEvent } from "@mui/material";
import { useState } from "react";

const RegisterPage = (props: IPropsRegister) => {
    const { setFullName, setEmail, setPassword, setConfirmPassword, setSelectedRole} = props;
    const navigate = useNavigate();
    const [role, setRole] = useState<string>("");

    const handleRoleChange = (event: SelectChangeEvent<string>) => {
        const selectedRole = event.target.value;
        setRole(selectedRole);
        setSelectedRole(selectedRole);
    };


    const handleLoginRedirect = () => {
        navigate("/login");
    };

    return (
        <div className="background-container">
            <div className="box">
                <Typography variant="h2" fontFamily="Popins" textAlign="center" padding={3}>
                    Регистрация
                </Typography>
                <TextField
                    fullWidth
                    margin="normal"
                    label="ФИО"
                    variant="standard"
                    placeholder="Введите ФИО"
                    onChange={(e) => setFullName(e.target.value)}
                />
                <TextField
                    fullWidth
                    margin="normal"
                    label="E-mail"
                    variant="standard"
                    placeholder="Введите E-mail"
                    onChange={(e) => setEmail(e.target.value)}
                />
                <TextField
                    type="password"
                    fullWidth
                    margin="normal"
                    label="Password"
                    variant="standard"
                    placeholder="Введите пароль"
                    onChange={(e) => setPassword(e.target.value)}
                />
                <TextField
                    type="password"
                    fullWidth
                    margin="normal"
                    label="Password"
                    variant="standard"
                    placeholder="Повторите пароль"
                    onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <FormControl fullWidth margin="normal">
                    <InputLabel id="role-select-label">Роль</InputLabel>
                    <Select
                        labelId="role-select-label"
                        value={role}
                        onChange={handleRoleChange}
                    >
                        <MenuItem value="admin">Администратор</MenuItem>
                        <MenuItem value="user">Пользователь</MenuItem>
                    </Select>
                </FormControl>

                <Button
                    sx={{ fontFamily: "Poppins", marginTop: 2, width: "30%" }}
                    variant="contained"
                    type="submit"
                >
                    Войти
                </Button>
                <Typography variant="body1" fontFamily="Popins" textAlign="center" padding={3}>
                    Есть аккаунт?{" "}
                    <span
                        className="reg"
                        onClick={handleLoginRedirect}
                        style={{ cursor: "pointer", color: "blue" }}
                    >
                        Авторизация
                    </span>
                </Typography>
            </div>
        </div>
    );
};

export default RegisterPage;