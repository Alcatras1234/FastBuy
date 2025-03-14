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
    const location = useLocation();

    useEffect(() => {
        const matchData = location.state?.match;
        if (matchData) {
            setMatch(matchData);
            setTotalPrice(matchData.ticketsPrice); // Устанавливаем цену сразу
        }
    }, [location.state]);

    const handleTicketChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const tickets = Number(event.target.value);
        if (!isNaN(tickets) && tickets > 0 && match && tickets <= match.ticketsCount) {
            setNumberOfTickets(tickets);
            setTotalPrice(tickets * match.ticketsPrice);
        }
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
    };

    const handleProceedToPurchase = () => {
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

                    <Dialog open={openDialog} onClose={handleCloseDialog} fullWidth maxWidth="sm">
                        <DialogTitle>Подтверждение покупки</DialogTitle>
                        <DialogContent>
                            <Typography>Вы хотите купить {numberOfTickets} билетов на матч {match.teamHomeName} - {match.teamAwayName} за {totalPrice} Руб?</Typography>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleCloseDialog} color="secondary">Отмена</Button>
                            <Button variant="contained" color="primary">
                                Подтвердить покупку
                            </Button>
                        </DialogActions>
                    </Dialog>
                </>
            ) : (
                <Typography variant="h6" marginTop={4}>Загрузка данных о матче...</Typography>
            )}
        </Container>
    );
};

export default BuyPage;
