import React, { useEffect, useState } from "react";
import { Container, Grid, Typography, Button, CircularProgress } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { fetchOrganizerMatches, deleteMatch, updateMatch } from "../../../utils/axios";

import MatchList from "../../matches/organizer/list";  // Match listing
import EditMatchModal from "../../matches/organizer/edit"; // Match editing modal
import Cookies from "js-cookie";


const OrganizerHomePage: React.FC = () => {
    const navigate = useNavigate();
    const [matches, setMatches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [editingMatch, setEditingMatch] = useState<any>(null);
    const [openDialog, setOpenDialog] = useState(false);

    useEffect(() => {
        const loadMatches = async () => {
            setLoading(true);
            try {
                // ✅ Получаем email организатора из Cookies
                const organizerEmail = Cookies.get("Email");
                if (!organizerEmail) throw new Error("Не найден email организатора!");

                // ✅ Загружаем все матчи
                const realData = await fetchOrganizerMatches(0, 10);
    
                // ✅ Фильтруем только матчи этого организатора
                const filteredMatches = realData.filter(match => match.organizer?.email === organizerEmail);
    
                // ✅ Приводим к нужному формату
                const formattedMatches = filteredMatches.map(match => ({
                    id: match.id || "Нет данных",
                    teamA: match.teamHomeName || "Неизвестно",
                    teamB: match.teamAwayName || "Неизвестно",
                    date: match.scheduleDate || "Неизвестно",
                    time: match.scheduleTimeLocal || "Неизвестно",
                    location: match.stadiumName || "Не указано",
                    tickets: match.ticketsCount || 0,
                    ticketPrice: match.ticketsPrice || 0,
                }));
    
                setMatches(formattedMatches);
            } catch (err) {
                setError("Ошибка загрузки матчей");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
    
        loadMatches();
    }, []);
   
    const handleDeleteMatch = async (matchId: string) => {
        if (!window.confirm("Вы уверены, что хотите удалить этот матч?")) return;

        try {
            await deleteMatch(matchId);
            setMatches(matches.filter(match => match.id !== matchId));
        } catch (error) {
            alert("Ошибка удаления матча");
        }
    };

    const handleEditMatch = (match: any) => {
        setEditingMatch(match);
        setOpenDialog(true);
    };

    const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setEditingMatch((prev: any) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleUpdateMatch = async () => {
        try {
            await updateMatch(editingMatch.id, editingMatch);
            setMatches(matches.map(match => (match.id === editingMatch.id ? editingMatch : match)));
            setOpenDialog(false);
        } catch (error) {
            alert("Ошибка при обновлении матча");
        }
    };

    return (
        <Container maxWidth="lg" style={{ marginTop: "2rem" }}>
            <Grid container justifyContent="space-between" alignItems="center" style={{ marginBottom: "1rem" }}>
                <Typography variant="h4" align="center">Ваши матчи</Typography>
                <Button variant="outlined" color="secondary" onClick={() => navigate("/organizer/personalAcc")}>
                    Личный кабинет
                </Button>
            </Grid>
            <Grid container justifyContent="flex-end" style={{ marginBottom: "1rem" }}>
                <Button variant="contained" color="primary" onClick={() => navigate("/organizer/matchAdd")}>
                    Добавить матч
                </Button>
            </Grid>

            {loading && <CircularProgress />}
            {error && <Typography color="error">{error}</Typography>}

            <MatchList matches={matches} onEdit={handleEditMatch} onDelete={handleDeleteMatch} />

            <EditMatchModal open={openDialog} match={editingMatch} onClose={() => setOpenDialog(false)} onSave={handleUpdateMatch} onChange={handleEditChange} />
        </Container>
    );
};

export default OrganizerHomePage;