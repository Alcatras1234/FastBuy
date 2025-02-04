import { useLocation } from "react-router-dom";
import UserHomePage from "./user";
import OrganizerHomePage from "./organizer";
import AdminHomePage from "./admin";


const HomeRootComponent: React.FC = () => {
    const location = useLocation();

    const handleSubmit = () => {
        if (location.pathname === "/user/home") {
            console.log("Home page");
        }
    }

    return (
        <div className="homepage" onChange={handleSubmit}>
            { location.pathname === "/user/home" ? (
                <UserHomePage
                />
            ) : location.pathname === "/organizer/home" ? (
                <OrganizerHomePage
                />
            ) : location.pathname === "/admin/home" ? (
                <AdminHomePage
                />
            )  : null}
        </div>
    );
};

export default HomeRootComponent;