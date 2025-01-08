import './App.css'
import {Route, Routes} from "react-router-dom"
import HomePage from "./components/home";
import PrivateRoute from "./utils/router/privateRoute.tsx";
import AuthRootComponent from "./components/auth";

function App() {

    return (
        <div className="App">
            <div className = 'page-background'>
                <Routes>
                    <Route element={<PrivateRoute/>}>
                        <Route path="/" element={<HomePage/>}/>
                    </Route>
                    <Route path="login" element={<AuthRootComponent/>}/>
                    <Route path="register" element={<AuthRootComponent/>}/>
                </Routes>
            </div>

        </div>
    )
}

export default App
