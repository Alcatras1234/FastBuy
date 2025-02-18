import React from "react";
import {
    Dialog, DialogActions, DialogContent, DialogTitle,
    TextField, Button
} from "@mui/material";

interface EditMatchModalProps {
    open: boolean;
    match: any;
    onClose: () => void;
    onSave: () => void;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const EditMatchModal: React.FC<EditMatchModalProps> = ({ open, match, onClose, onSave, onChange }) => {
    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Редактировать матч</DialogTitle>
            <DialogContent>
                <TextField label="Команда A" name="teamA" value={match?.teamA} onChange={onChange} fullWidth margin="normal" />
                <TextField label="Команда B" name="teamB" value={match?.teamB} onChange={onChange} fullWidth margin="normal" />
                <TextField label="Дата" name="date" type="date" value={match?.date} onChange={onChange} fullWidth margin="normal" InputLabelProps={{ shrink: true }} />
                <TextField label="Время" name="time" type="time" value={match?.time} onChange={onChange} fullWidth margin="normal" InputLabelProps={{ shrink: true }} />
                <TextField label="Место" name="location" value={match?.location} onChange={onChange} fullWidth margin="normal" />
                <TextField label="Билеты" name="tickets" type="number" value={match?.tickets} onChange={onChange} fullWidth margin="normal" />
                <TextField label="Цена билета" name="ticketPrice" type="number" value={match?.ticketPrice} onChange={onChange} fullWidth margin="normal"
/>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="secondary">Отмена</Button>
                <Button onClick={onSave} color="primary">Сохранить</Button>
            </DialogActions>
        </Dialog>
    );
};

export default EditMatchModal;