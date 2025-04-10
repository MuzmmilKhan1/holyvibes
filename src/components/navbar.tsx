import { useLocation } from "react-router-dom";
import { SidebarTrigger } from "./ui/sidebar";

const NavBar = () => {
    const location = useLocation()
    return (
        <div className='bg-slate-50 border-b border-slate-200 h-15 w-full flex items-center px-3'>
            {
                location.pathname !== "/login" && location.pathname !== "/create-teacher-account" && location.pathname !== "/" && location.pathname !== "/create-student-account" && location.pathname !== "/restriction-message" && <SidebarTrigger />
            }
            <span className='ml-1 text-slate-700 font-semibold bg-slate-200 border border-slate-300 p-1 px-2 rounded-md'>
                Holy Vibes
            </span>
        </div>
    );
};

export default NavBar;