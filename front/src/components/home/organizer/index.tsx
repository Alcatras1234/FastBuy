import React, { useEffect, useState } from "react";
import { Container, Grid, Typography, Button, CircularProgress } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { fetchOrganizerMatches, deleteMatch, updateMatch } from "../../../utils/axios";

import MatchList from "../../matches/organizer/list";  // Match listing
import EditMatchModal from "../../matches/organizer/edit"; // Match editing modal

const OrganizerHomePage: React.FC = () => {
    const navigate = useNavigate();
    const [matches, setMatches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [editingMatch, setEditingMatch] = useState<any>(null);
    const [openDialog, setOpenDialog] = useState(false);

    // Mock API response
    useEffect(() => {
        setLoading(true);
        setTimeout(() => {
            try {
                // Hardcoded sample match data
                const mockData = [
                    {
                        id: "1",
                        teamA: "FC Barcelona",
                        teamB: "Real Madrid",
                        date: "2024-06-15",
                        time: "19:00",
                        location: "Camp Nou",
                        tickets: 1500,
                        ticketPrice: 300,
                    },
                    {
                        id: "2",
                        teamA: "Manchester United",
                        teamB: "Chelsea",
                        date: "2024-06-20",
                        time: "18:00",
                        location: "Old Trafford",
                        tickets: 2000,
                        ticketPrice: 200,
                    },
                    {
                        id: "3",
                        teamA: "Bayern Munich",
                        teamB: "Borussia Dortmund",
                        date: "2024-06-25",
                        time: "20:30",
                        location: "Allianz Arena",
                        tickets: 1800,
                        ticketPrice: 100,
                    }
                ];
                setMatches(mockData);
            } catch (err) {
                setError("Ошибка загрузки матчей");
                console.error(err);
            } finally {
                setLoading(false);
            }
        }, 1000); // Delay for 1 sec to simulate API loading
    }, []);

// когда бэк заработает shift-option-a
/*     useEffect(() => {
        const loadMatches = async () => {
            setLoading(true);
            try {
                const realData = await fetchOrganizerMatches(); // Fetch data from backend
                setMatches(realData);  // Set real matches in state
            } catch (err) {
                setError("Ошибка загрузки матчей");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
    
        loadMatches();
    }, []); */

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