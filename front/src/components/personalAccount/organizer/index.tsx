import React, { useEffect, useState } from "react";
import { Container, Typography, TextField, Button, Grid, Paper, Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { fetchOrganizerProfile, updateOrganizerProfile } from "../../../utils/axios";

const OrganizerPersonalAccount: React.FC = () => {
    const navigate = useNavigate();
    
    // Organizer profile state
    const [organizer, setOrganizer] = useState({
        email: "",
        companyName: "",
        contactPhone: "",
        contactEmail: "",
        bankAccount: "",
    });

    // Loading state
    const [loading, setLoading] = useState(true);

/*     // Fetch organizer data on mount
    useEffect(() => {
        const loadProfile = async () => {
            try {
                const profileData = await fetchOrganizerProfile();
                setOrganizer(profileData);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        loadProfile();
    }, []); */

     // Simulated backend response (mock data)
     useEffect(() => {
        setLoading(true);
        setTimeout(() => {
            const mockProfileData = {
                email: "organizer@example.com",
                companyName: "Football Masters Ltd.",
                contactPhone: "+1 234 567 890",
                contactEmail: "contact@fmasters.com",
                bankAccount: "1234 5678 9101 1121 - Bank of America",
            };
            setOrganizer(mockProfileData);
            setLoading(false);
        }, 1000); // Simulated delay (1s)
    }, []);


    // Modal handling
    const [openModal, setOpenModal] = useState(false);
    const [editField, setEditField] = useState(""); // The field currently being edited
    const [updatedValue, setUpdatedValue] = useState("");

    const handleEdit = (fieldName: string, currentValue: string) => {
        setEditField(fieldName);
        setUpdatedValue(currentValue);
        setOpenModal(true);
    };

    const handleSave = async () => {
        try {
            await updateOrganizerProfile({ ...organizer, [editField]: updatedValue });
            setOrganizer((prev) => ({ ...prev, [editField]: updatedValue }));
            setOpenModal(false);
        } catch (error) {
            alert("Ошибка при обновлении данных");
        }
    };

    return (
        <Container maxWidth="sm" style={{ marginTop: "2rem" }}>
            <Paper elevation={3} style={{ padding: "2rem" }}>
                <Typography variant="h4" align="center" gutterBottom>
                    Профиль организатора
                </Typography>

                {loading ? (
                    <Typography align="center">Загрузка...</Typography>
                ) : (
                    <>
                        <Typography variant="h6">Основная информация</Typography>
                        <Typography variant="body1">📩 Email: {organizer.email}</Typography>
                        <Typography variant="body1">🏢 Компания: {organizer.companyName}</Typography>
                        <Button variant="outlined" color="primary" onClick={() => handleEdit("companyName", organizer.companyName)}>
                            Изменить компанию
                        </Button>

                        <Typography variant="h6" style={{ marginTop: "1rem" }}>Контактные данные</Typography>
                        <Typography variant="body1">📞 Телефон: {organizer.contactPhone}</Typography>
                        <Button variant="outlined" color="primary" onClick={() => handleEdit("contactPhone", organizer.contactPhone)}>
                            Изменить телефон
                        </Button>
                        <Typography variant="body1">📧 Email: {organizer.contactEmail}</Typography>
                        <Button variant="outlined" color="primary" onClick={() => handleEdit("contactEmail", organizer.contactEmail)}>
                            Изменить email
                        </Button>

                        <Typography variant="h6" style={{ marginTop: "1rem" }}>Банковские реквизиты</Typography>
                        <Typography variant="body1">🏦 Счет: {organizer.bankAccount}</Typography>
                        <Button variant="outlined" color="primary" onClick={() => handleEdit("bankAccount", organizer.bankAccount)}>
                            Изменить реквизиты
                        </Button>

                        <Grid container justifyContent="flex-end" style={{ marginTop: "1rem" }}>
                            <Button variant="outlined" color="secondary" onClick={() => navigate("/organizer/home")}>
                                Назад
                            </Button>
                        </Grid>
                    </>
                )}
            </Paper>

            {/* Edit Modal */}
            <Dialog open={openModal} onClose={() => setOpenModal(false)}>
                <DialogTitle>Редактировать информацию</DialogTitle>
                <DialogContent>
                    <TextField label={`Изменить: ${editField}`} value={updatedValue} onChange={(e) => setUpdatedValue(e.target.value)} fullWidth margin="normal" />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenModal(false)} color="secondary">Отмена</Button>
                    <Button onClick={handleSave} color="primary">Сохранить</Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default OrganizerPersonalAccount;