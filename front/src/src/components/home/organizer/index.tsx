import React from "react";
import { Container, Grid, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

const OrganizerHomePage: React.FC = () => {
    const navigate = useNavigate();

    const handleGoToAccount = () => {
        navigate("/organizer/personalAcc");
    };

    const handleAddMatch = () => {
        navigate("/organizer/matchAdd"); // Здесь можно реализовать логику добавления матча
    };

    return (
        <Container maxWidth="lg" style={{ marginTop: "2rem" }}>
            <Grid container justifyContent="space-between" alignItems="center" style={{ marginBottom: "1rem" }}>
                <Typography variant="h4" align="center">
                    Лента матчей
                </Typography>
                <Button variant="outlined" color="secondary" onClick={handleGoToAccount}>
                    Личный кабинет
                </Button>
            </Grid>
            <Grid container justifyContent="flex-end" style={{ marginBottom: "1rem" }}>
                <Button variant="contained" color="primary" onClick={handleAddMatch}>
                    Добавить матч
                </Button>
            </Grid>
        </Container>
    );
};

export default OrganizerHomePage;