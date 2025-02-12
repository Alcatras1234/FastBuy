import { useState, useEffect } from "react";
import { Button, Typography, Box, Paper } from "@mui/material";
import { rejectOrganizer, fetchPendingOrganizers, approveOrganizer } from "../../../utils/axios";

// Интерфейс для организаторов
interface Organizer {
    id: string;
    corpName: string;
    email: string;
    phoneNumber: string;
}

const AdminHomePage: React.FC = () => {
    const [pendingOrganizers, setPendingOrganizers] = useState<Organizer[]>([]);

    useEffect(() => {
        const loadOrganizers = async () => {
            try {
                const data: Organizer[] = await fetchPendingOrganizers();
                setPendingOrganizers(data);
            } catch (error) {
                console.error("Ошибка загрузки организаторов:", error);
            }
        };
        loadOrganizers();
    }, []);

    const handleApprove = async (organizerId: string) => {
        await approveOrganizer(organizerId);
        setPendingOrganizers(pendingOrganizers.filter(org => org.id !== organizerId));
    };

    const handleReject = async (organizerId: string) => {
        await rejectOrganizer(organizerId);
        setPendingOrganizers(pendingOrganizers.filter(org => org.id !== organizerId));
    };

    return (
        <Box padding={3}>
            <Typography variant="h4">📋 Заявки на регистрацию организаторов</Typography>
            {pendingOrganizers.length === 0 ? (
                <Typography>Нет новых заявок</Typography>
            ) : (
                pendingOrganizers.map(org => (
                    <Paper key={org.id} style={{ padding: 16, margin: 16 }}>
                        <Typography><b>Имя компании:</b> {org.corpName}</Typography>
                        <Typography><b>Email:</b> {org.email}</Typography>
                        <Typography><b>Телефон:</b> {org.phoneNumber}</Typography>
                        <Button onClick={() => handleApprove(org.id)} variant="contained" color="success" style={{ marginRight: 8 }}>
                            ✅ Добавить
                        </Button>
                        <Button onClick={() => handleReject(org.id)} variant="contained" color="error">
                            ❌ Отклонить
                        </Button>
                    </Paper>
                ))
            )}
        </Box>
    );
};

export default AdminHomePage;