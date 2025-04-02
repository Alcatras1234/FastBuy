import React, { useEffect, useState } from "react";
import { fetchUserTickets } from "../../../utils/axios";
import { Container, Card, CardContent, Typography, CircularProgress, Grid } from "@mui/material";

interface IMatch {
    id: number;
    league: string;
    scheduleDate: string;
    scheduleTimeLocal: string;
    stadiumName: string;
    teamHomeName: string;
    teamAwayName: string;
    city: string;
}

interface ITicket {
    id: number;
    seat: {
        id: number;
        row: number;
        sector: string;
        seatNumber: string;
        matchId: IMatch;
        price: number;
        stadiumId: {
            id: number;
            name: string;
            city: string;
        };
    };
    status: string;
    createdAt: string;
    updatedAt: string;
    price: number;
}

const UserTicketsPage: React.FC = () => {
    const [tickets, setTickets] = useState<ITicket[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        const loadTickets = async () => {
            try {
                setIsLoading(true);
                const response = await fetchUserTickets(0,5); // Запрос билетов пользователя
                console.log("📡 Полученные билеты:", response);
                setTickets(response);
            } catch (error) {
                console.error("Ошибка загрузки билетов:", error);
            } finally {
                setIsLoading(false);
            }
        };
        loadTickets();
    }, []);

    return (
        <Container>
            <Typography variant="h5" gutterBottom>Мои билеты</Typography>

            {isLoading ? (
                <CircularProgress />
            ) : tickets.length > 0 ? (
                <Grid container spacing={2}>
                    {tickets.map(ticket => (
                        <Grid item xs={12} sm={6} md={4} key={ticket.id}>
                            <Card>
                                <CardContent>
                                    <Typography variant="h6">
                                        {ticket.seat.matchId.teamHomeName} vs {ticket.seat.matchId.teamAwayName}
                                    </Typography>
                                    <Typography>
                                        {ticket.seat.matchId.scheduleDate} | {ticket.seat.matchId.scheduleTimeLocal}
                                    </Typography>
                                    <Typography>
                                        {ticket.seat.matchId.stadiumName}, {ticket.seat.stadiumId.city}
                                    </Typography>
                                    <Typography>
                                        Сектор: {ticket.seat.sector}, Ряд: {ticket.seat.row}, Место: {ticket.seat.seatNumber}
                                    </Typography>
                                    <Typography>Цена: {ticket.price} Руб.</Typography>
                                    <Typography>Статус: {ticket.status}</Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            ) : (
                <Typography variant="h6">У вас нет купленных билетов.</Typography>
            )}
        </Container>
    );
};

export default UserTicketsPage;