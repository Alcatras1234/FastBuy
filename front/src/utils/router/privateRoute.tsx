import {Navigate, Outlet} from "react-router-dom";
import {useAuth} from "../hook";

const PrivateRoute = (role: "USER" | "ORGANIZER") => {
    const auth = useAuth(role);
    return (
        auth ? <Outlet/> : <Navigate to="login/users"/>
    )
}

export default PrivateRoute