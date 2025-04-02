import './App.css';
import { Route, Routes, Navigate } from "react-router-dom";
import AuthRootComponent from "./components/auth";
import HomeRootComponent from "./components/home";
import HomePage from "./components/home";
import PrivateRoute from "./utils/router/privateRoute.tsx";
import OrganizerPersonalAccount from "./components/personalAccount/organizer";
import AddMatchPage from "./components/matches/organizer/add";
import BuyPage from "./components/matches/user/buy";

function App() {
    return (
        <div className="App">
            <Routes>
                <Route path="/" element={<Navigate to="/login/users" replace />} />

                <Route element={<PrivateRoute role={"USER"}/>}>
                    <Route path="/user/home" element={<HomeRootComponent />} />
                </Route>

                <Route element={<PrivateRoute role={"ORGANIZER"}/>}>
                    <Route path="/organizer/personalAcc" element={<OrganizerPersonalAccount />} />
                    <Route path="/organizer/matchAdd" element={<AddMatchPage />} />
                    <Route path="/organizer/home" element={<HomeRootComponent />} />
                    <Route path="/buy" element={<BuyPage />} />
                </Route>

                <Route path="/login/users" element={<AuthRootComponent />} />
                <Route path="/login/admin" element={<AuthRootComponent />} />
                <Route path="/pending" element={<AuthRootComponent />} />
                <Route path="/user/register" element={<AuthRootComponent />} />
                <Route path="/organizer/register/baseInfo" element={<AuthRootComponent />} />
                <Route path="/organizer/register/corpInfo" element={<AuthRootComponent />} />
                <Route path="/verify" element={<AuthRootComponent />} />
                <Route path="/admin/home" element={<HomeRootComponent />} />

            </Routes>
        </div>
    );
}

export default App;