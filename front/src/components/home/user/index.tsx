import React, { useEffect, useState } from "react";
import { fetchUsersMatches } from "../../../utils/axios";
import { Container, Grid, Card, CardContent, Typography, TextField, MenuItem, IconButton } from "@mui/material";
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
    const [city, setCity] = useState(""); // Фильтр по городу
    const [cities, setCities] = useState<string[]>([]); // Доступные города с сервера
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [page, setPage] = useState<number>(1);

    useEffect(() => {
        const loadMatches = async () => {
            try {
                setIsLoading(true);
                const responseMatches = await fetchUsersMatches(page, 5);

                setMatches(responseMatches);
                setFilteredMatches(responseMatches); // Инициализация отфильтрованных матчей

                // Получаем список уникальных городов
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

    // Фильтрация по поисковому запросу и городу
    useEffect(() => {
        const result = matches.filter(match =>
            (city === "" || match.city === city) &&
            (match.teamHomeName.toLowerCase().includes(search.toLowerCase()) ||
                match.teamAwayName.toLowerCase().includes(search.toLowerCase()))
        );
        setFilteredMatches(result);
    }, [search, city, matches]);

    return (
        <Container>
            <Typography variant="h5" gutterBottom>Бронирование билетов</Typography>

            <Grid container spacing={2}>
                {/* Поле поиска */}
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

                {/* Фильтр по городу */}
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

            {/* Карточки матчей */}
            <Grid container spacing={2} marginTop={2}>
                {filteredMatches.length > 0 ? (
                    filteredMatches.map(match => (
                        <Grid item xs={12} sm={6} md={4} key={match.id}>
                            <Card>
                                {/* Закомментированное фото */}
                                {/*
                                {match.photoUrl && (
                                    <img src={match.photoUrl} alt="Матч" style={{ width: "100%", height: "200px", objectFit: "cover" }} />
                                )}
                                */}
                                <CardContent style={{ backgroundColor: "#2D5939", color: "white" }}>
                                    <Typography variant="h6">{match.teamHomeName} vs {match.teamAwayName}</Typography>
                                    <Typography>{match.scheduleDate} | {match.scheduleTimeLocal}</Typography>
                                    <Typography>{match.stadiumName}</Typography>
                                    <Typography>Город: {match.city}</Typography>
                                </CardContent>
                                <CardContent>
                                    <Typography>Лига: {match.league}</Typography>
                                    <Typography>Билетов: {match.ticketsCount} | От {match.ticketsPrice} Руб</Typography>
                                    {/* Закомментированная информация об организаторе */}
                                    {/*
                                    <Typography>Организатор: {match.organizer}</Typography>
                                    */}
                                    <Typography>Статус: {match.status}</Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))
                ) : (
                    <Typography variant="h6" marginTop={2}>Матчи не найдены</Typography>
                )}
            </Grid>
        </Container>
    );
};

export default UserHomePage;