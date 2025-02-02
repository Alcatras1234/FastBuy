import React, { useState } from "react";
import { TextField, Button, Grid, Box, Container, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

const AddMatchPage: React.FC = () => {
    const navigate = useNavigate();
    const [matchData, setMatchData] = useState({
        teamA: "",
        teamB: "",
        date: "",
        time: "",
        location: "",
        tickets: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setMatchData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Новый матч:", matchData); // Здесь можно отправить данные на сервер
        // После добавления матча перенаправляем назад, например, на главную страницу организатора
        navigate("/organizer/home");
    };

    return (
        <Container maxWidth="sm" style={{ marginTop: "2rem" }}>
            <Typography variant="h4" align="center" gutterBottom>
                Добавить новый матч
            </Typography>
            <Box component="form" onSubmit={handleSubmit} style={{ marginTop: "1rem" }}>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <TextField
                            label="Команда A"
                            name="teamA"
                            value={matchData.teamA}
                            onChange={handleChange}
                            fullWidth
                            required
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            label="Команда B"
                            name="teamB"
                            value={matchData.teamB}
                            onChange={handleChange}
                            fullWidth
                            required
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            label="Дата"
                            name="date"
                            type="date"
                            value={matchData.date}
                            onChange={handleChange}
                            fullWidth
                            required
                            InputLabelProps={{ shrink: true }}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            label="Время"
                            name="time"
                            type="time"
                            value={matchData.time}
                            onChange={handleChange}
                            fullWidth
                            required
                            InputLabelProps={{ shrink: true }}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            label="Место проведения"
                            name="location"
                            value={matchData.location}
                            onChange={handleChange}
                            fullWidth
                            required
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            label="Количество доступных билетов"
                            name="tickets"
                            type="number"
                            value={matchData.tickets}
                            onChange={handleChange}
                            fullWidth
                            required
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Box textAlign="center">
                            <Button type="submit" variant="contained" color="primary">
                                Добавить матч
                            </Button>
                        </Box>
                    </Grid>
                </Grid>
            </Box>
        </Container>
    );
};

export default AddMatchPage;