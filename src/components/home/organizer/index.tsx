import React, { useState } from "react";
import { Container, Grid, Typography, Button, Card, CardContent, Dialog, DialogTitle, DialogContent } from "@mui/material";
import AddMatchForm from "../../matches/organizer/add";

interface Match {
    id: number;
    teamA: string;
    teamB: string;
    date: string;
    time: string;
    location: string;
}

const OrganizerHomePage: React.FC = () => {
    const [matches, setMatches] = useState<Match[]>([]);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const handleAddMatch = (newMatch: Omit<Match, "id">) => {
        setMatches((prevMatches) => [
            ...prevMatches,
            { id: prevMatches.length + 1, ...newMatch },
        ]);
        setIsDialogOpen(false); // Закрыть диалог после добавления
    };

    const handleOpenDialog = () => {
        setIsDialogOpen(true);
    };

    const handleCloseDialog = () => {
        setIsDialogOpen(false);
    };

    return (
        <Container maxWidth="lg" style={{ marginTop: "2rem" }}>
            <Typography variant="h4" align="center" gutterBottom>
                Лента матчей
            </Typography>
            <Grid container justifyContent="flex-end" style={{ marginBottom: "1rem" }}>
                <Button variant="contained" color="primary" onClick={handleOpenDialog}>
                    Добавить матч
                </Button>
            </Grid>
            <Grid container spacing={3}>
                {matches.map((match) => (
                    <Grid item xs={12} sm={6} md={4} key={match.id}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6">
                                    {match.teamA} vs {match.teamB}
                                </Typography>
                                <Typography variant="body2">Дата: {match.date}</Typography>
                                <Typography variant="body2">Время: {match.time}</Typography>
                                <Typography variant="body2">Место: {match.location}</Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            {/* Диалог для добавления матча */}
            <Dialog open={isDialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
                <DialogTitle>Добавить новый матч</DialogTitle>
                <DialogContent>
                    <AddMatchForm onAddMatch={handleAddMatch} />
                </DialogContent>
            </Dialog>
        </Container>
    );
};

export default OrganizerHomePage;