import {Navigate, Outlet} from "react-router-dom";

const PrivateRoute = () => {
    const auth = true; // useAuth()
    return (
        auth ? <Outlet/> : <Navigate to="login"/>
    )
}

export default PrivateRoute