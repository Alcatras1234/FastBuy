import React, { useEffect, useState } from "react";
import { fetchUserTickets, refundTicket } from "../../../utils/axios";
import { 
  Container, 
  Card, 
  CardContent, 
  Typography, 
  CircularProgress, 
  Grid, 
  Pagination, 
  Box,
  Paper,
  Button
} from "@mui/material";

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
    const [isRefunding, setIsRefunding] = useState<boolean>(false);
    const [refundingTicketId, setRefundingTicketId] = useState<number | null>(null);
    const [page, setPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(1);
    const [hasAnyTickets, setHasAnyTickets] = useState<boolean>(false);
    const itemsPerPage = 5;
    
    // Минимальная высота для контейнера контента
    const minContentHeight = "60vh";

    const handleRefundTicket = async (ticket: ITicket) => {
        if (!window.confirm("Вы уверены, что хотите вернуть этот билет?")) return;

        try {
            setIsRefunding(true);
            setRefundingTicketId(ticket.id);
            console.log("🚀 Подробная информация о билете:", ticket);
            console.log("🚀 Возвращаем билет с ID:", ticket.id);

            // Вызов API для возврата билета с использованием ID билета
            await refundTicket(ticket.id);
            
            // После успешного возврата обновляем список билетов
            await loadTickets();
            
            console.log("✅ Билет успешно возвращен");
            alert("Билет успешно возвращен");
        } catch (error) {
            console.error("❌ Ошибка при возврате билета:", error);
            alert("Ошибка при возврате билета");
        } finally {
            setIsRefunding(false);
            setRefundingTicketId(null);
        }
    };

    const loadTickets = async () => {
        try {
            setIsLoading(true);
            const response = await fetchUserTickets(page - 1, itemsPerPage); // Запрос билетов пользователя
            console.log("📡 Полученные билеты:", response);
            
            // Предполагаем, что API возвращает массив билетов
            if (Array.isArray(response)) {
                setTickets(response);
                
                // Если мы на первой странице и получили билеты, пометим что у пользователя есть билеты
                if (page === 1 && response.length > 0) {
                    setHasAnyTickets(true);
                    // Установим общее количество страниц в 3 (или рассчитайте на основе реальных данных)
                    setTotalPages(3);
                } 
                // Если мы на первой странице и не получили билеты, значит их вообще нет
                else if (page === 1 && response.length === 0) {
                    setHasAnyTickets(false);
                    setTotalPages(1);
                }
                // На других страницах состояние hasAnyTickets не меняем
            } else {
                console.error("Неожиданный формат ответа:", response);
                setTickets([]);
            }
        } catch (error) {
            console.error("Ошибка загрузки билетов:", error);
            setTickets([]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadTickets();
    }, [page]);

    const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
        setPage(value);
        window.scrollTo(0, 0); // Прокрутка вверх при смене страницы
    };

    // Проверка, можно ли вернуть билет (не является отмененным)
    const canRefundTicket = (ticket: ITicket): boolean => {
        return ticket.status !== "canceled" //&& ticket.status === "ACTIVE";
    };

    return (
        <Container>
            {/* Заголовок страницы */}
            <Typography variant="h5" gutterBottom>Мои билеты</Typography>
            
            {/* Контейнер для основного содержимого с минимальной высотой */}
            <Box sx={{ minHeight: minContentHeight, display: 'flex', flexDirection: 'column' }}>
                {isLoading ? (
                    <Box display="flex" justifyContent="center" alignItems="center" flexGrow={1}>
                        <CircularProgress />
                    </Box>
                ) : (
                    <Box flexGrow={1}>
                        {tickets.length > 0 ? (
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
                                                
                                                {/* Показываем кнопку возврата только для активных билетов */}
                                                {canRefundTicket(ticket) && (
                                                    <Box mt={2} display="flex" justifyContent="flex-start">
                                                        <Button 
                                                            variant="contained" 
                                                            color="secondary" 
                                                            size="small" 
                                                            onClick={() => handleRefundTicket(ticket)}
                                                            disabled={isRefunding && refundingTicketId === ticket.id}
                                                        >
                                                            {isRefunding && refundingTicketId === ticket.id ? "Обработка..." : "Вернуть билет"}
                                                        </Button>
                                                    </Box>
                                                )}
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                ))}
                            </Grid>
                        ) : (
                            <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
                                <Typography variant="h6">
                                    {hasAnyTickets 
                                        ? "На этой странице нет билетов. Воспользуйтесь пагинацией, чтобы вернуться к своим билетам." 
                                        : "У вас нет купленных билетов."}
                                </Typography>
                            </Box>
                        )}
                    </Box>
                )}
            </Box>
            
            {/* Фиксированная пагинация внизу страницы */}
            {totalPages > 1 && hasAnyTickets && (
                <Paper 
                    elevation={3} 
                    sx={{ 
                        position: 'sticky', 
                        bottom: 0, 
                        left: 0, 
                        right: 0, 
                        py: 2,
                        mt: 3,
                        mb: 0,
                        backgroundColor: 'white',
                        zIndex: 1
                    }}
                >
                    <Box display="flex" justifyContent="center">
                        <Pagination 
                            count={totalPages} 
                            page={page} 
                            onChange={handlePageChange} 
                            color="primary"
                            size="large"
                        />
                    </Box>
                </Paper>
            )}
        </Container>
    );
};

export default UserTicketsPage;
