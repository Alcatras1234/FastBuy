import { Button, TextField, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import {IPropsOrganizerRegisterCorpInfo} from "../../../../../common/types/auth";// Убедитесь, что этот путь и тип корректны

const OrganizerRegisterPageCorpInfo: React.FC<IPropsOrganizerRegisterCorpInfo> = (props: IPropsOrganizerRegisterCorpInfo): JSX.Element => {
    const { setCorpName, setPhoneNumber } = props;
    const navigate = useNavigate();

    const handleBack = () => {
        navigate("/organizer/register/baseInfo"); // Возвращает на предыдущую страницу в истории
    };

    return (
        <div className="background-container">
            <div className="box">
                <Typography
                    variant="h3"
                    fontFamily="Poppins"
                    textAlign="center"
                    padding={3}
                >
                    Введите данные организации
                </Typography>
                    <TextField
                        fullWidth
                        margin="normal"
                        label="Corporation name"
                        variant="standard"
                        placeholder="Введите название организации"
                        onChange={(e) => setCorpName(e.target.value)}
                        required
                    />
                    <TextField
                        type="tel"
                        fullWidth
                        margin="normal"
                        label="Номер"
                        variant="standard"
                        placeholder="Введите номер телефона"
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        required
                    />
                    <Button
                        sx={{ fontFamily: "Poppins", marginTop: 2, width: "100%" }}
                        variant="contained"
                        type="submit"
                    >
                        Зарегистрироваться
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
    );
};

export default OrganizerRegisterPageCorpInfo;