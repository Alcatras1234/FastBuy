import { Button, TextField, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import {IPropsVerificationCode} from "../../../common/types/auth";

const VerificationPage: React.FC<IPropsVerificationCode> = (props: IPropsVerificationCode): JSX.Element => {
    const {setVerificationCode} = props
    const navigate = useNavigate();

    const handleBack = () => {
        navigate(-1); // Возвращаем пользователя на предыдущую страницу
    };

    return (
        <div className="root">
            <div className="background-container">
                <div className="box">
                    <Typography
                        variant="h2"
                        fontFamily="Poppins"
                        textAlign="center"
                        padding={3}
                    >
                        Верификация
                    </Typography>
                        <TextField
                            fullWidth
                            margin="normal"
                            label="Введите код подтверждения"
                            variant="standard"
                            placeholder="Код подтверждения"
                            onChange={(e) => setVerificationCode(e.target.value)}
                            required
                        />
                        <Button
                            type="submit"
                            sx={{ fontFamily: "Poppins", marginTop: 2, width: "100%" }}
                            variant="contained"
                        >
                            Подтвердить
                        </Button>
                        <Button
                            sx={{ fontFamily: "Poppins", marginTop: 2, width: "100%" }}
                            variant="outlined"
                            onClick={handleBack}
                        >
                            Назад
                        </Button>
                </div>
            </div>
        </div>
    );
};

export default VerificationPage;