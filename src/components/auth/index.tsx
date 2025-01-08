import {useLocation} from "react-router-dom";
import LoginPage from "./login";
import RegisterPage from "./register";
import './style.scss'
import {Box} from "@mui/material";
import {useState} from "react";
import {instance} from "../../utils/axios";

const AuthRootComponent: React.FC = (): JSX.Element => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [fullName, setFullName] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [role,setSelectedRole] = useState("");

    const location = useLocation();

    const handleSubmit = async (e: { preventDefault: () => void;}) => {
        e.preventDefault();

        if (location.pathname === "/login") {
            const userDates = {
                email,
                password
            }
            const user = await instance.post('auth/login', userDates);
            console.log(user.data)
        }
        else{
            if (password === confirmPassword) {
                const userDates ={
                    fullName,
                    email,
                    password,
                    role
                }
                const user = await instance.post('auth/register', userDates);
                console.log(user.data)
            }
            else {
                throw new Error('не совпадают пароли')
            }
        }
    }

    return (
        <div className='root'>
            <form className="form" onSubmit={handleSubmit}>
                <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    flexDirection="column"
                    maxWidth={640}
                    margin="auto"
                    padding={5}
                    borderRadius={5}
                    boxShadow={'5px 5px 10px #ccc'}
                >
                    {location.pathname === '/login' ? <LoginPage
                        setEmail = {setEmail}
                        setPassword = {setPassword}/>: location.pathname === '/register' ?
                        <RegisterPage
                            setEmail = {setEmail}
                            setPassword = {setPassword}
                            setFullName = {setFullName}
                            setConfirmPassword = {setConfirmPassword}
                            setSelectedRole = {setSelectedRole}/> : null}
                </Box>
            </form>
        </div>
    )
};

export default AuthRootComponent;