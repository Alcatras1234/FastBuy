import {TextField, Button, Typography} from "@mui/material";
import {Fragment} from "react";
import {IPropsLogin} from "../../../common/types/auth";
import {useNavigate} from "react-router-dom";

const LoginPage: React.FC<IPropsLogin> = (props: IPropsLogin) : JSX.Element => {
    const {setEmail, setPassword} = props;
    const navigate = useNavigate();
    const handleRegisterRedirect = () => {
        navigate("/register"); // Переходим на маршрут /login
    };
    return (
        <div className="background-container">
            <div className="box">
                <Fragment>
                    <Typography
                        variant="h2"
                        fontFamily='Poppins'
                        textAlign='center'
                        padding={3}>
                        Авторизация
                    </Typography>
                    <TextField
                        fullWidth = {true}
                        margin='normal'
                        label="E-mail"
                        variant="standard"
                        placeholder="Введите E-mail"
                        onChange={(e) => setEmail(e.target.value)}/>
                    <TextField
                        type = 'password'
                        fullWidth = {true}
                        margin='normal'
                        label="Password"
                        variant="standard"
                        placeholder="Введите Пароль"
                        onChange={(e) => setPassword(e.target.value)}/>
                    <Button
                        type = 'submit'
                        sx = {{fontFamily:'Poppins', marginTop:2, width:'30%'}}
                        variant="contained">
                        Войти</Button>
                    <Typography variant="body1"
                                fontFamily='Popins'
                                textAlign='center'
                                padding={3}>Нет аккаунта? <span
                        className='reg'
                        onClick={handleRegisterRedirect}
                        style={{ cursor: "pointer", color: "blue" }}> Регистрация </span>
                    </Typography>
                </Fragment>
            </div>

        </div>
    )
}
export default LoginPage