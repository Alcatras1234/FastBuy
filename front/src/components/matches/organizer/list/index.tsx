import React from "react";
import { Grid, Card, CardContent, Typography, Button } from "@mui/material";

interface Match {
    id: string;
    teamA: string;
    teamB: string;
    date: string;
    time: string;
    location: string;
    tickets: number;
    ticketPrice: number;
}

interface MatchListProps {
    matches: Match[];
    onEdit: (match: Match) => void;
    onDelete: (matchId: string) => void;
}

const MatchList: React.FC<MatchListProps> = ({ matches, onEdit, onDelete }) => {
    return (
        <Grid container spacing={2}>
            {matches.length > 0 ? (
                matches.map((match) => (
                    <Grid item xs={12} sm={6} md={4} key={match.id}>
                        <Card className="event-card">
                            <CardContent>
                                <Typography variant="h6">{match.teamA} vs {match.teamB}</Typography>
                                <Typography variant="body2">📅 {match.date} - 🕘 {match.time}</Typography>
                                <Typography variant="body2">📍 {match.location}</Typography>
                                <Typography variant="body2">🎟️ Билетов: {match.tickets}</Typography>
                                <Typography variant="body2">💰 Цена билета: {match.ticketPrice}₽</Typography>
                                <Button variant="contained" color="primary" size="small" onClick={() => onEdit(match)}>
                                    Редактировать
                                </Button>
                                <Button variant="contained" color="secondary" size="small" style={{ marginLeft: "0.5rem" }} onClick={() => onDelete(match.id)}>
                                    Удалить
                                </Button>
                            </CardContent>
                        </Card>
                    </Grid>
                ))
            ) : (
                <Typography>У вас пока нет созданных матчей.</Typography>
            )}
        </Grid>
    );
};

export default MatchList;
