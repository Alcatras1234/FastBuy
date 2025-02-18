import React, { useState } from "react";
import { TextField, Button, Grid, Box, Container, Typography, Alert, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { createMatch } from "../../../../utils/axios"; // API Call function

const AddMatchPage: React.FC = () => {
    const navigate = useNavigate();
    const [matchData, setMatchData] = useState({
        teamA: "",
        teamB: "",
        date: "",
        time: "",
        location: "",
        tickets: "",
        ticketPrice: "",
    });

    const [error, setError] = useState<string | null>(null);
    const [confirmationOpen, setConfirmationOpen] = useState(false);
    const [successOpen, setSuccessOpen] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setMatchData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    //! More meaningful validations
    const validateFields = () => {
        const { teamA, teamB, date, time, location, tickets, ticketPrice } = matchData;

        if (!teamA.trim() || !teamB.trim()) return "Введите названия обеих команд.";
        if (teamA.trim().toLowerCase() === teamB.trim().toLowerCase()) return "Команды должны быть разными.";
        if (!date) return "Выберите дату матча.";
        if (new Date(date) < new Date()) return "Дата матча должна быть в будущем.";
        if (!time) return "Выберите время матча.";
        if (!/^\d{2}:\d{2}$/.test(time)) return "Неверный формат времени (HH:MM).";
        if (!location.trim()) return "Введите место проведения.";
        if (!tickets || isNaN(Number(tickets)) || Number(tickets) <= 0) return "Количество билетов должно быть положительным числом.";
        if (!ticketPrice || isNaN(Number(ticketPrice)) || Number(ticketPrice) <= 0) return "Цена билета должна быть положительным числом.";

        return null;
    };

    //! Handle confirmation popup
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        const validationError = validateFields();
        if (validationError) {
            setError(validationError);
            return;
        }

        setConfirmationOpen(true);
    };

    //! Handle final submission after confirmation
    const handleConfirmSubmit = async () => {
        setConfirmationOpen(false); // Close confirmation popup
        try {
            await createMatch(matchData);
            console.log("Матч успешно добавлен");
            setSuccessOpen(true); // Open success message
        } catch (error) {
            console.error(error.message);
            setError("Ошибка при добавлении матча. Попробуйте снова.");
        }
    };

    return (
        <Container maxWidth="sm" style={{ marginTop: "2rem" }}>
            <Typography variant="h4" align="center" gutterBottom>
                Добавить новый матч
            </Typography>

            {/* Display validation errors */}
            {error && <Alert severity="error" style={{ marginBottom: "1rem" }}>{error}</Alert>}

            <Box component="form" onSubmit={handleSubmit} style={{ marginTop: "1rem" }}>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <TextField label="Команда A" name="teamA" value={matchData.teamA} onChange={handleChange} fullWidth required />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField label="Команда B" name="teamB" value={matchData.teamB} onChange={handleChange} fullWidth required />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField label="Дата" name="date" type="date" value={matchData.date} onChange={handleChange} fullWidth required InputLabelProps={{ shrink: true }} />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField label="Время" name="time" type="time" value={matchData.time} onChange={handleChange} fullWidth required InputLabelProps={{ shrink: true }} />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField label="Место проведения" name="location" value={matchData.location} onChange={handleChange} fullWidth required />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField label="Количество доступных билетов" name="tickets" type="number" value={matchData.tickets} onChange={handleChange} fullWidth required />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField label="Цена билета" name="ticketPrice" type="number" value={matchData.ticketPrice} onChange={handleChange} fullWidth required />
                    </Grid>
                    <Grid item xs={12}>
                        <Box display="flex" justifyContent="space-between">
                            <Button variant="outlined" color="secondary" onClick={() => navigate("/organizer/home")}>
                                Главная
                            </Button>
                            <Button type="submit" variant="contained" color="primary">
                                Добавить матч
                            </Button>
                        </Box>
                    </Grid>
                </Grid>
            </Box>

            {/* Confirmation Dialog */}
            <Dialog open={confirmationOpen} onClose={() => setConfirmationOpen(false)}>
                <DialogTitle>Подтвердите добавление матча</DialogTitle>
                <DialogContent>
                    <Typography>
                        Вы уверены, что хотите создать этот матч? Проверьте введенные данные перед отправкой.
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setConfirmationOpen(false)} color="secondary">Отмена</Button>
                    <Button onClick={handleConfirmSubmit} color="primary">Подтвердить</Button>
                </DialogActions>
            </Dialog>

            {/* Success Dialog */}
            <Dialog open={successOpen} onClose={() => navigate("/organizer/home")}>
                <DialogTitle>✅ Матч успешно создан!</DialogTitle>
                <DialogContent>
                    <Typography>Матч добавлен в систему. Хотите вернуться на главную страницу?</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setSuccessOpen(false)} color="secondary">Остаться</Button>
                    <Button onClick={() => navigate("/organizer/home")} color="primary">На главную</Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default AddMatchPage;