import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import {
    Container, Typography, Grid, Card, CardContent, TextField, Button, MenuItem, Dialog, DialogTitle, DialogContent, DialogActions
} from "@mui/material";
//import { buyTicket } from "../../../utils/axios"; // ✅ Import API function

const mockSeats = [
    { sector: "A", row: 1, seatNumber: 5, price: 500 },
    { sector: "A", row: 1, seatNumber: 6, price: 500 },
    { sector: "A", row: 2, seatNumber: 4, price: 550 },
    { sector: "B", row: 1, seatNumber: 1, price: 600 },
    { sector: "B", row: 2, seatNumber: 3, price: 650 },
    { sector: "C", row: 1, seatNumber: 7, price: 700 },
];

const BuyPage: React.FC = () => {
    const [match, setMatch] = useState<any>(null);
    const location = useLocation();

    const [selectedSector, setSelectedSector] = useState<string | null>(null);
    const [selectedRow, setSelectedRow] = useState<number | null>(null);
    const [selectedSeat, setSelectedSeat] = useState<number | null>(null);
    const [selectedPrice, setSelectedPrice] = useState<number | null>(null);
    
    // ✅ Payment state
    const [openPaymentDialog, setOpenPaymentDialog] = useState<boolean>(false);
    const [bankCard, setBankCard] = useState<string>("");
    const [cvv, setCvv] = useState<string>("");
    const [expireDate, setExpireDate] = useState<string>("");

    useEffect(() => {
        const matchData = location.state?.match;
        if (matchData) {
            setMatch(matchData);
        }
    }, [location.state]);

    // ✅ Handles Payment
    const handleConfirmPayment = async () => {
        try {
            if (!selectedSeat || !selectedPrice) {
                alert("Выберите место перед оплатой!");
                return;
            }

            const token = "yourUserToken"; // Get from authentication
            const paymentData = {
                token,
                seatNumber: selectedSeat.toString(),
                bankCard,
                cvv,
                expireDate,
            };

            console.log("📡 Отправка данных на сервер:", paymentData);
            await buyTicket(paymentData); // ✅ Call API function

            alert("✅ Оплата прошла успешно!");
            setOpenPaymentDialog(false);
            setBankCard("");
            setCvv("");
            setExpireDate("");
        } catch (error) {
            console.error("❌ Ошибка при оплате билета:", error);
            alert("Ошибка при оплате билета, попробуйте снова.");
        }
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
                                    <Typography>Осталось билетов: {match.ticketsCount}</Typography>
                                </CardContent>
                            </Card>
                        </Grid>

                        {/* Select Sector */}
                        <Grid item xs={4}>
                            <TextField select label="Сектор" fullWidth
                                value={selectedSector || ""}
                                onChange={(e) => {
                                    setSelectedSector(e.target.value);
                                    setSelectedRow(null);
                                    setSelectedSeat(null);
                                    setSelectedPrice(null);
                                }}>
                                {Array.from(new Set(mockSeats.map(seat => seat.sector))).map(sector => (
                                    <MenuItem key={sector} value={sector}>{sector}</MenuItem>
                                ))}
                            </TextField>
                        </Grid>

                        {/* Select Row */}
                        <Grid item xs={4}>
                            <TextField select label="Ряд" fullWidth disabled={!selectedSector}
                                value={selectedRow || ""}
                                onChange={(e) => {
                                    setSelectedRow(Number(e.target.value));
                                    setSelectedSeat(null);
                                    setSelectedPrice(null);
                                }}>
                                {Array.from(new Set(mockSeats
                                    .filter(seat => seat.sector === selectedSector)
                                    .map(seat => seat.row)))
                                    .map(row => (
                                        <MenuItem key={row} value={row}>Ряд {row}</MenuItem>
                                    ))}
                            </TextField>
                        </Grid>

                        {/* Select Seat */}
                        <Grid item xs={4}>
                            <TextField select label="Место" fullWidth disabled={!selectedRow}
                                value={selectedSeat || ""}
                                onChange={(e) => {
                                    const seat = mockSeats.find(seat =>
                                        seat.sector === selectedSector &&
                                        seat.row === selectedRow &&
                                        seat.seatNumber === Number(e.target.value));
                                    setSelectedSeat(seat?.seatNumber || null);
                                    setSelectedPrice(seat?.price || null);
                                }}>
                                {mockSeats.filter(seat =>
                                    seat.sector === selectedSector && seat.row === selectedRow)
                                    .map(seat => (
                                        <MenuItem key={seat.seatNumber} value={seat.seatNumber}>
                                            Место {seat.seatNumber}
                                        </MenuItem>
                                    ))}
                            </TextField>
                        </Grid>

                        {/* Payment Button */}
                        {selectedSeat && selectedPrice && (
                            <Grid item xs={12}>
                                <Typography variant="h6">Цена билета: {selectedPrice} Руб</Typography>
                                <Button variant="contained" color="primary" fullWidth onClick={() => setOpenPaymentDialog(true)}>
                                    Оплатить билет
                                </Button>
                            </Grid>
                        )}
                    </Grid>

                    {/* Payment Dialog */}
                    <Dialog open={openPaymentDialog} onClose={() => setOpenPaymentDialog(false)} fullWidth maxWidth="sm">
                        <DialogTitle>Введите данные для оплаты</DialogTitle>
                        <DialogContent>
                            <TextField label="Номер карты" fullWidth value={bankCard} onChange={(e) => setBankCard(e.target.value)} margin="dense"/>
                            <TextField label="CVV" fullWidth value={cvv} onChange={(e) => setCvv(e.target.value)} margin="dense" type="password"/>
                            <TextField label="Дата истечения (MM/YY)" fullWidth value={expireDate} onChange={(e) => setExpireDate(e.target.value)} margin="dense"/>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={() => setOpenPaymentDialog(false)} color="secondary">Отмена</Button>
                            <Button variant="contained" color="primary" onClick={handleConfirmPayment}>
                                Подтвердить оплату
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