import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
    Container,
    Typography,
    Grid,
    Card,
    CardContent,
    TextField,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions
} from "@mui/material";

interface IMatch {
    id: number;
    league: string;
    scheduleDate: string;
    scheduleTimeLocal: string;
    stadiumName: string;
    ticketsCount: number;
    ticketsPrice: number;
    info: string;
    teamHomeName: string;
    teamAwayName: string;
    photoUrl: string;
    organizer: string;
    status: string;
    city: string;
}

const BuyPage: React.FC = () => {
    const [match, setMatch] = useState<IMatch | null>(null);
    const [numberOfTickets, setNumberOfTickets] = useState<number>(1);
    const [totalPrice, setTotalPrice] = useState<number>(0);
    const [openDialog, setOpenDialog] = useState<boolean>(false);
    const navigate = useNavigate();
    const location = useLocation();
    const { matchId }: any = location.state || {}; // Получаем matchId из состояния маршрута

    useEffect(() => {
        // Загружаем информацию о выбранном матче по matchId
        const fetchMatch = async () => {
            try {
                // Здесь предполагается, что данные о матче можно загрузить через API или из глобального состояния
                // В примере используется mock, где данные матчей загружаются по matchId
                const response = await fetch(`https://api.example.com/matches/${matchId}`);
                const matchData = await response.json();
                setMatch(matchData);
                setTotalPrice(matchData.ticketsPrice * numberOfTickets); // Начальная калькуляция
            } catch (error) {
                console.error("Ошибка загрузки данных о матче:", error);
            }
        };

        if (matchId) {
            fetchMatch();
        }
    }, [matchId, numberOfTickets]);

    const handleTicketChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const tickets = Number(event.target.value);
        setNumberOfTickets(tickets);
        if (match) {
            setTotalPrice(match.ticketsPrice * tickets); // Пересчитываем цену
        }
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
    };

    const handleProceedToPurchase = () => {
        // Здесь можно добавить логику перехода к оплате
        setOpenDialog(true);
    };

    return (
        <Container>
            <Typography variant="h5" gutterBottom>Страница покупки билетов</Typography>

            {match ? (
                <>
                    <Grid container spacing={2} marginTop={2}>
                        <Grid item xs={12}>
                            <Card>
                                <CardContent style={{ backgroundColor: "#2D5939", color: "white" }}>
                                    <Typography variant="h6">{match.teamHomeName} vs {match.teamAwayName}</Typography>
                                    <Typography>{match.scheduleDate} | {match.scheduleTimeLocal}</Typography>
                                    <Typography>{match.stadiumName}, {match.city}</Typography>
                                    <Typography>Лига: {match.league}</Typography>
                                    <Typography>Цена за билет: {match.ticketsPrice} Руб</Typography>
                                    <Typography>Осталось билетов: {match.ticketsCount}</Typography>
                                </CardContent>
                            </Card>
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="Количество билетов"
                                type="number"
                                fullWidth
                                value={numberOfTickets}
                                onChange={handleTicketChange}
                                InputProps={{
                                    inputProps: {
                                        min: 1,
                                        max: match.ticketsCount
                                    }
                                }}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <Typography variant="h6" gutterBottom>Итого: {totalPrice} Руб</Typography>
                        </Grid>

                        <Grid item xs={12}>
                            <Button
                                variant="contained"
                                color="primary"
                                fullWidth
                                onClick={handleProceedToPurchase}
                            >
                                Перейти к оплате
                            </Button>
                        </Grid>
                    </Grid>

                    {/* Диалог для подтверждения покупки */}
                    <Dialog open={openDialog} onClose={handleCloseDialog} fullWidth maxWidth="sm">
                        <DialogTitle>Подтверждение покупки</DialogTitle>
                        <DialogContent>
                            <Typography>Вы хотите купить {numberOfTickets} билетов за {totalPrice} Руб?</Typography>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleCloseDialog} color="secondary">Отмена</Button>
                            <Button variant="contained" color="primary">Подтвердить покупку</Button>
                        </DialogActions>
                    </Dialog>
                </>
            ) : (
                <Typography variant="h6">Загрузка данных о матче...</Typography>
            )}
        </Container>
    );
};

export default BuyPage;