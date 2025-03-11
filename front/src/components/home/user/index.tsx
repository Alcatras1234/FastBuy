import React, { useEffect, useState } from "react";
import { fetchUsersMatches } from "../../../utils/axios";
import {useNavigate} from "react-router-dom";
import {
    Container,
    Grid,
    Card,
    CardContent,
    Typography,
    TextField,
    MenuItem,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

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

const UserHomePage: React.FC = () => {
    const [matches, setMatches] = useState<IMatch[]>([]);
    const [filteredMatches, setFilteredMatches] = useState<IMatch[]>([]);
    const [search, setSearch] = useState("");
    const [city, setCity] = useState("");
    const [cities, setCities] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [page, setPage] = useState<number>(1);
    const [selectedMatch, setSelectedMatch] = useState<IMatch | null>(null);
    const [openDialog, setOpenDialog] = useState<boolean>(false);
    const navigate = useNavigate();

    useEffect(() => {
        const loadMatches = async () => {
            try {
                setIsLoading(true);
                console.log(1);
                
                const responseMatches = await fetchUsersMatches(0, 5);
                console.log(2);

                if (!responseMatches || !Array.isArray(responseMatches)) {
                    throw new Error("❌ Данные матчей отсутствуют или имеют неверный формат!");
                }

                console.log("📡 Полученные матчи от сервера:", responseMatches); // ✅ Debugging API Response

                setMatches(responseMatches);
                setFilteredMatches(responseMatches);


                const uniqueCities = [...new Set(responseMatches.map(match => match.city))];
                setCities(uniqueCities);
            } catch (error) {
                console.error("Ошибка загрузки матчей:", error);
            } finally {
                setIsLoading(false);
            }
        };
        loadMatches();
    }, [page]);

    useEffect(() => {
        const result = matches.filter(match =>
            (city === "" || match.city === city) &&
            (match.teamHomeName.toLowerCase().includes(search.toLowerCase()) ||
                match.teamAwayName.toLowerCase().includes(search.toLowerCase()))
        );
        setFilteredMatches(result);
    }, [search, city, matches]);

    const handleOpenDialog = (match: IMatch) => {
        setSelectedMatch(match);
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setSelectedMatch(null);
    };

    const handleOpenBuyPage = () => {
        navigate('/buy');
    };

    return (
        <Container>
            <Typography variant="h5" gutterBottom>Бронирование билетов</Typography>

            <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={4}>
                    <TextField
                        fullWidth
                        label="Поиск матча..."
                        variant="outlined"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        InputProps={{
                            endAdornment: (
                                <IconButton>
                                    <SearchIcon />
                                </IconButton>
                            ),
                        }}
                    />
                </Grid>

                <Grid item xs={12} sm={6} md={4}>
                    <TextField
                        fullWidth
                        select
                        label="Город"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                    >
                        <MenuItem value="">Все</MenuItem>
                        {cities.map(city => (
                            <MenuItem key={city} value={city}>{city}</MenuItem>
                        ))}
                    </TextField>
                </Grid>
            </Grid>

            <Grid container spacing={2} marginTop={2}>
                {filteredMatches.length > 0 ? (
                    filteredMatches.map(match => (
                        <Grid item xs={12} sm={6} md={4} key={match.id}>
                            <Card onClick={() => handleOpenDialog(match)} style={{ cursor: "pointer" }}>
                                <CardContent style={{ backgroundColor: "#2D5939", color: "white" }}>
                                    <Typography variant="h6">{match.teamHomeName} vs {match.teamAwayName}</Typography>
                                    <Typography>{match.scheduleDate} | {match.scheduleTimeLocal}</Typography>
                                    <Typography>{match.stadiumName}</Typography>
                                    <Typography>Город: {match.city}</Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))
                ) : (
                    <Typography variant="h6" marginTop={2}>Матчи не найдены</Typography>
                )}
            </Grid>

            {/* Диалог с информацией о матче */}
            <Dialog open={openDialog} onClose={handleCloseDialog} fullWidth maxWidth="md">
                <DialogTitle>Информация о матче</DialogTitle>
                <DialogContent>
                    {selectedMatch && (
                        <>
                            <Typography variant="h6">{selectedMatch.teamHomeName} vs {selectedMatch.teamAwayName}</Typography>
                            <Typography>{selectedMatch.scheduleDate} | {selectedMatch.scheduleTimeLocal}</Typography>
                            <Typography>{selectedMatch.stadiumName}, {selectedMatch.city}</Typography>
                            <Typography>Лига: {selectedMatch.league}</Typography>
                            <Typography>Билетов: {selectedMatch.ticketsCount} | От {selectedMatch.ticketsPrice} Руб</Typography>
                            <Typography>Организатор: {selectedMatch.organizer}</Typography>
                            <Typography>Статус: {selectedMatch.status}</Typography>
                        </>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog} color="secondary">Закрыть</Button>
                    <Button
                        variant="contained"
                        color="primary"
                        fullWidth
                        onClick={() => handleOpenBuyPage}  // Передаем саму функцию в onClick
                    >
                        Перейти к оплате
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default UserHomePage;
