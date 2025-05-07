import { useLocation } from "react-router-dom";
import { SidebarTrigger } from "./ui/sidebar";
import logo from "../assets/logo.png"
const NavBar = () => {
    const location = useLocation()
    return (
        <div className='bg-gray-50 border-b bordergrey-300 h-16 w-full flex items-center px-3'>
            {
                location.pathname !== "/login" && location.pathname !== "/create-teacher-account" && location.pathname !== "/" && location.pathname !== "/create-student-account" && location.pathname !== "/restriction-message" && location.pathname !== "/forgot-password" && !location.pathname.startsWith("/reset-password") && <SidebarTrigger />
            }
            <span className='ml-1  flex  text-black items-center justify-center gap-1 font-semibold    rounded-md'>
                <img src={logo} className="w-13 rounded-lg" alt="logo" />
                <span>
                    Holy Vibes
                </span>
            </span>
        </div>
    );
};

export default NavBar;