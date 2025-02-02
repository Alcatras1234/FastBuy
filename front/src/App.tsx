import './App.css'
import {Route, Routes} from "react-router-dom"
import HomePage from "./components/home";
import PrivateRoute from "./utils/router/privateRoute.tsx";
import UserHomePage from "./components/home/user";
import OrganizerHomePage from "./components/home/organizer";
import OrganizerPersonalAccount from "./components/personalAccount/organizer";
import RegistrationRootComponent from "./components/auth/registration";
import UsersLoginPage from "./components/auth/login/users";
import AdminLoginPage from "./components/auth/login/admin";
import VerificationPage from "./components/auth/verify";
import AddMatchPage from "./components/matches/organizer/add";

function App() {

    return (
        <div className="App">
                <Routes>
                    <Route element={<PrivateRoute />}>
                        <Route path ="\" element={<HomePage />} />
                    </Route>
                    <Route path="/user/home" element={<UserHomePage />} />
                    <Route path="/organizer/home" element={<OrganizerHomePage />} />
                    <Route path="/login/users" element={<UsersLoginPage/>}/>
                    <Route path="/login/admin" element={<AdminLoginPage/>}/>
                    <Route path="/user/register" element={<RegistrationRootComponent/>}/>
                    <Route path="/organizer/register/baseInfo" element={<RegistrationRootComponent/>}/>
                    <Route path="/organizer/register/corpInfo" element={<RegistrationRootComponent/>}/>
                    <Route path="/organizer/personalAcc" element={<OrganizerPersonalAccount/>}/>
                    <Route path="/organizer/matchAdd" element={<AddMatchPage/>}/>
                    <Route path="/verify" element={<VerificationPage/>}/>

                </Routes>
        </div>
    )
}

export default App
