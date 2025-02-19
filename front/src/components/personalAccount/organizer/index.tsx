import React, { useState } from "react";
import { Container, Typography, TextField, Button, Grid, Paper } from "@mui/material";
import {useNavigate} from "react-router-dom";

const OrganizerPersonalAccount: React.FC = () => {
    const navigate = useNavigate();
    // Состояние пользователя
    const [user, setUser] = useState({
        email: "user@example.com",
        password: "password123",
    });

    // Состояние для редактирования
    const [newEmail, setNewEmail] = useState(user.email);
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    // Обработчик обновления email
    const handleUpdateEmail = () => {
        if (newEmail.trim() === "") {
            alert("Email не может быть пустым.");
            return;
        }
        setUser((prevUser) => ({ ...prevUser, email: newEmail }));
        alert("Email успешно обновлен.");
    };

    // Обработчик обновления пароля
    const handleUpdatePassword = () => {
        if (newPassword.trim() === "") {
            alert("Пароль не может быть пустым.");
            return;
        }
        if (newPassword !== confirmPassword) {
            alert("Пароли не совпадают.");
            return;
        }
        setUser((prevUser) => ({ ...prevUser, password: newPassword }));
        alert("Пароль успешно обновлен.");
        setNewPassword("");
        setConfirmPassword("");
    };
    const handleGoBack = () => {
        navigate("/organizer/home");
    };

    return (
        <Container maxWidth="sm" style={{ marginTop: "2rem" }}>
            <Paper elevation={3} style={{ padding: "2rem" }}>
                <Typography variant="h4" align="center" gutterBottom>
                    Личный кабинет
                </Typography>

                {/* Текущие данные пользователя */}
                <Typography variant="h6">Текущая информация</Typography>
                <Typography variant="body1">Email: {user.email}</Typography>
                <Typography variant="body1">Пароль: *******</Typography>

                <Grid container spacing={2} style={{ marginTop: "1rem" }}>
                    {/* Изменение Email */}
                    <Grid item xs={12}>
                        <Typography variant="h6">Изменить Email</Typography>
                        <TextField
                            label="Новый Email"
                            value={newEmail}
                            onChange={(e) => setNewEmail(e.target.value)}
                            fullWidth
                        />
                        <Button
                            variant="contained"
                            color="primary"
                            style={{ marginTop: "1rem" }}
                            onClick={handleUpdateEmail}
                        >
                            Обновить Email
                        </Button>
                    </Grid>

                    {/* Изменение пароля */}
                    <Grid item xs={12}>
                        <Typography variant="h6">Изменить пароль</Typography>
                        <TextField
                            label="Новый пароль"
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            fullWidth
                        />
                        <TextField
                            label="Подтвердите новый пароль"
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            fullWidth
                            style={{ marginTop: "1rem" }}
                        />
                        <Button
                            variant="contained"
                            color="primary"
                            style={{ marginTop: "1rem" }}
                            onClick={handleUpdatePassword}
                        >
                            Обновить пароль
                        </Button>
                    </Grid>
                </Grid>
                <Grid container justifyContent="flex-end" style={{ marginTop: "1rem" }}>
                    <Button variant="outlined" color="secondary" onClick={handleGoBack}>
                        Назад
                    </Button>
                </Grid>
            </Paper>
        </Container>
    );
};

export default OrganizerPersonalAccount;