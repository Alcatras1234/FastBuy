import './App.css'
import {Route, Routes} from "react-router-dom"
import HomePage from "./components/home";
import PrivateRoute from "./utils/router/privateRoute.tsx";
import AuthRootComponent from "./components/auth";
import UserHomePage from "./components/home/user";
import OrganizerHomePage from "./components/home/organizer";

function App() {

    return (
        <div className="App">
                <Routes>
                    <Route element={<PrivateRoute />}>
                        <Route path ="\" element={<HomePage />} />
                    </Route>
                    <Route path="/user/home" element={<UserHomePage />} />
                    <Route path="/organizer/home" element={<OrganizerHomePage />} />
                    <Route path="login" element={<AuthRootComponent/>}/>
                    <Route path="register" element={<AuthRootComponent/>}/>
                </Routes>
        </div>
    )
}

export default App
