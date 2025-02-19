import './App.css';
import { Route, Routes, Navigate } from "react-router-dom";
import AuthRootComponent from "./components/auth";
import HomeRootComponent from "./components/home";
import HomePage from "./components/home";
import PrivateRoute from "./utils/router/privateRoute.tsx";
import OrganizerPersonalAccount from "./components/personalAccount/organizer";
import AddMatchPage from "./components/matches/organizer/add";

function App() {
    return (
        <div className="App">
            <Routes>
                <Route path="/" element={<Navigate to="/login/users" replace />} />

                <Route element={<PrivateRoute />}>
                    <Route path="/home" element={<HomePage />} />
                </Route>
                <Route path="/login/users" element={<AuthRootComponent />} />
                <Route path="/login/admin" element={<AuthRootComponent />} />
                <Route path="/pending" element={<AuthRootComponent />} />
                <Route path="/user/register" element={<AuthRootComponent />} />
                <Route path="/organizer/register/baseInfo" element={<AuthRootComponent />} />
                <Route path="/organizer/register/corpInfo" element={<AuthRootComponent />} />
                <Route path="/verify" element={<AuthRootComponent />} />
                <Route path="/organizer/personalAcc" element={<OrganizerPersonalAccount />} />
                <Route path="/organizer/matchAdd" element={<AddMatchPage />} />
                <Route path="/user/home" element={<HomeRootComponent />} />
                <Route path="/organizer/home" element={<HomeRootComponent />} />
                <Route path="/admin/home" element={<HomeRootComponent />} />

            </Routes>
        </div>
    );
}

export default App;