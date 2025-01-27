import React, { useState } from "react";
import { TextField, Button, Grid, Box } from "@mui/material";

interface AddMatchFormProps {
    onAddMatch: (newMatch: { teamA: string; teamB: string; date: string; time: string; location: string }) => void;
}

const AddMatchForm: React.FC<AddMatchFormProps> = ({ onAddMatch }) => {
    const [matchData, setMatchData] = useState({
        teamA: "",
        teamB: "",
        date: "",
        time: "",
        location: "",
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
        onAddMatch(matchData);
        setMatchData({
            teamA: "",
            teamB: "",
            date: "",
            time: "",
            location: "",
        });
    };

    return (
        <Box component="form" onSubmit={handleSubmit}>
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
                    <Box textAlign="center">
                        <Button type="submit" variant="contained" color="primary">
                            Добавить
                        </Button>
                    </Box>
                </Grid>
            </Grid>
        </Box>
    );
};

export default AddMatchForm;