import { useState, useEffect } from "react";
import { Button, Typography, Box, Paper, Pagination } from "@mui/material";
import {
    rejectOrganizer,
    fetchPendingOrganizers,
    approveOrganizer,
    /*    fetchRejectedOrganizers,*/
    fetchApprovedOrganizers
} from "../../../utils/axios";

interface Organizer {
    email: string;
    corpName: string;
    phoneNumber: string;
    status: "pending" | "approved";
}

const AdminHomePage: React.FC = () => {
    const [pendingOrganizers, setPendingOrganizers] = useState<Organizer[]>([]);
    const [approvedOrganizers, setApprovedOrganizers] = useState<Organizer[]>([]);
    /*    const [rejectedOrganizers, setRejectedOrganizers] = useState<Organizer[]>([]);*/
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [page, setPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(1);

    useEffect(() => {
        const loadOrganizers = async () => {
            try {
                setIsLoading(true);
                const responsePendingOrganizers = await fetchPendingOrganizers(page, 5);
                const responseApprovedOrganizers = await fetchApprovedOrganizers(page, 5);
                /*                const responseRejectedOrganizers = await fetchRejectedOrganizers(page, 5);*/
                setPendingOrganizers(responsePendingOrganizers);
                /*                setRejectedOrganizers(responseRejectedOrganizers);*/
                setApprovedOrganizers(responseApprovedOrganizers);
                /*setTotalPages(response.data.totalPages);*/

            } catch (error) {
                console.error("Ошибка загрузки организаторов:", error);
            } finally {
                setIsLoading(false);
            }
        };
        loadOrganizers();
    }, [page]);

    const handleApprove = async (organizerEmail: string) => {
        try {
            await approveOrganizer(organizerEmail);
            const approvedOrganizer = pendingOrganizers.find(org => org.email === organizerEmail);
            if (approvedOrganizer) {
                setPendingOrganizers(prev => prev.filter(org => org.email !== organizerEmail));
            }
        } catch (error) {
            console.error(`Ошибка при одобрении организатора (${organizerEmail}):`, error);
        }
    };

    const handleReject = async (organizerEmail: string) => {
        try {
            await rejectOrganizer(organizerEmail);
            const rejectedOrganizer = pendingOrganizers.find(org => org.email === organizerEmail);
            if (rejectedOrganizer) {
                /*setRejectedOrganizers(prev => [...prev, { ...rejectedOrganizer, status: "rejected" }]);*/
                setPendingOrganizers(prev => prev.filter(org => org.email !== organizerEmail));
            }
        } catch (error) {
            console.error(`Ошибка при отклонении организатора (${organizerEmail}):`, error);
        }
    };

    return (
        <Box padding={3}>
            <Typography variant="h4">📋 Заявки на регистрацию организаторов</Typography>

            {isLoading ? (
                <Typography>Загрузка...</Typography>
            ) : (
                <>
                    <Box display="flex" justifyContent="space-between">
                        <Box>
                            <Typography variant="h5">Ожидают рассмотрения</Typography>
                            {pendingOrganizers.length === 0 ? (
                                <Typography>Нет новых заявок</Typography>
                            ) : (
                                pendingOrganizers.map(org => (
                                    <Paper key={org.email} style={{ padding: 16, margin: 16 }}>
                                        <Typography><b>Имя компании:</b> {org.corpName}</Typography>
                                        <Typography><b>Email:</b> {org.email}</Typography>
                                        <Typography><b>Телефон:</b> {org.phoneNumber}</Typography>
                                        <Button onClick={() => handleApprove(org.email)} variant="contained" color="success" style={{ marginRight: 8 }}>
                                            Добавить
                                        </Button>
                                        <Button onClick={() => handleReject(org.email)} variant="contained" color="error">
                                            Отклонить
                                        </Button>
                                    </Paper>
                                ))
                            )}
                        </Box>

                        <Box>
                            <Typography variant="h5">Одобренные</Typography>
                            {approvedOrganizers.length === 0 ? (
                                <Typography>Нет одобренных заявок</Typography>
                            ) : (
                                approvedOrganizers.map(org => (
                                    <Paper key={org.email} style={{ padding: 16, margin: 16 }}>
                                        <Typography><b>Имя компании:</b> {org.corpName}</Typography>
                                        <Typography><b>Email:</b> {org.email}</Typography>
                                        <Typography><b>Телефон:</b> {org.phoneNumber}</Typography>
                                    </Paper>
                                ))
                            )}
                        </Box>

                        {/* <Box>
                            <Typography variant="h5">Отклоненные</Typography>
                            {rejectedOrganizers.length === 0 ? (
                                <Typography>Нет отклоненных заявок</Typography>
                            ) : (
                                rejectedOrganizers.map(org => (
                                    <Paper key={org.email} style={{ padding: 16, margin: 16 }}>
                                        <Typography><b>Имя компании:</b> {org.corpName}</Typography>
                                        <Typography><b>Email:</b> {org.email}</Typography>
                                        <Typography><b>Телефон:</b> {org.phoneNumber}</Typography>
                                    </Paper>
                                ))
                            )}
                        </Box>*/}
                    </Box>

                    <Pagination
                        count={totalPages}
                        page={page}
                        onChange={(_, value) => setPage(value)}
                        color="primary"
                        style={{ marginTop: 16 }}
                    />
                </>
            )}
        </Box>
    );
};

export default AdminHomePage;