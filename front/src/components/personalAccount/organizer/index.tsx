import React, { useEffect, useState } from "react";
import { Container, Typography, TextField, Button, Grid, Paper, Dialog, DialogTitle, DialogContent, DialogActions, CircularProgress } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { fetchOrganizerProfile, updateOrganizerProfile } from "../../../utils/axios";

const OrganizerPersonalAccount: React.FC = () => {
    const navigate = useNavigate();
    
    // Organizer profile state
    const [organizer, setOrganizer] = useState({
        companyName: "",
        contactPhone: "",
        contactEmail: "",
        bankAccount: "",
    });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // ✅ Fetch organizer profile from backend
    useEffect(() => {
        const loadProfile = async () => {
            try {
                const profileData = await fetchOrganizerProfile();
                // ✅ Map backend response to frontend state format
                setOrganizer({
                    companyName: profileData.companyName || "Не указано",
                    contactPhone: profileData.contactNumber || "Не указано",
                    contactEmail: profileData.user.email,
                    bankAccount: profileData.bankAccount || "Не указано",
                });
            } catch (err) {
                setError("Не удалось загрузить профиль");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        loadProfile();
    }, []);

    // ✅ Edit Modal Handling
    const [openModal, setOpenModal] = useState(false);
    const [editField, setEditField] = useState("");
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
        <Container maxWidth="sm" sx={{ mt: 4 }}>
            <Paper elevation={3} sx={{ p: 4 }}>
                <Typography variant="h4" align="center" sx={{ mb: 3, color: "primary.main" }}>
                    📋 Профиль организатора
                </Typography>

                {loading ? (
                    <CircularProgress />
                ) : error ? (
                    <Typography color="error">{error}</Typography>
                ) : (
                    <>
                        <Typography>📧 Email: {organizer.contactEmail}</Typography>
                        <Typography variant="h6" sx={{ mt: 3 }}> {organizer.companyName}</Typography>
                        <Button variant="outlined" color="primary" onClick={() => handleEdit("companyName", organizer.companyName)}>
                            Изменить компанию
                        </Button>

                        <Typography>📞 Телефон: {organizer.contactPhone}</Typography>
                        <Button variant="outlined" color="primary" onClick={() => handleEdit("contactPhone", organizer.contactPhone)}>
                            Изменить телефон
                        </Button>


                        <Typography variant="h6" sx={{ mt: 3, color: "primary.main" }}>🏦 Банковские реквизиты</Typography>
                        <Typography>{organizer.bankAccount || "Не указано"}</Typography>
                        <Button variant="outlined" color="primary" onClick={() => handleEdit("bankAccount", organizer.bankAccount)}>
                            Изменить реквизиты
                        </Button>

                        <Grid container justifyContent="flex-end" sx={{ mt: 4 }}>
                            <Button variant="outlined" color="secondary" onClick={() => navigate("/organizer/home")}>
                                Назад
                            </Button>
                        </Grid>
                    </>
                )}
            </Paper>

            {/* ✅ Edit Modal */}
            <Dialog open={openModal} onClose={() => setOpenModal(false)}>
                <DialogTitle>✏️ Редактировать</DialogTitle>
                <DialogContent>
                    <TextField value={updatedValue} onChange={(e) => setUpdatedValue(e.target.value)} fullWidth margin="normal" />
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