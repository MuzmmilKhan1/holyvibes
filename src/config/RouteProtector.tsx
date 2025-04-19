import { Navigate, useLocation } from "react-router-dom";
import CryptoJS from 'crypto-js';
import Helpers from "./Helpers";

const RouteProtector = ({ children, isAuthenticate }: any) => {
    const token = localStorage.getItem("token");
    const encryptedRole = localStorage.getItem('role');
    const encryptedStatus = localStorage.getItem("status");
    const location = useLocation();

    let role: string | null = null;
    let status: string | null = null;
    try {
        if (encryptedRole) {
            const bytes = CryptoJS.AES.decrypt(encryptedRole, Helpers.secretKey);
            role = bytes.toString(CryptoJS.enc.Utf8);
        }
    } catch (error) {
        console.error("Role decryption failed:", error);
        role = null;
    }
    try {
        if (encryptedStatus) {
            const bytes = CryptoJS.AES.decrypt(encryptedStatus, Helpers.secretKey);
            status = bytes.toString(CryptoJS.enc.Utf8);
        }
    } catch (error) {
        console.error("Status decryption failed:", error);
        status = null;
    }
    const roleRoutes: Record<string, string> = {
        admin: "/admin/course",
        teacher: "/teacher/classes",
        student: "/student/enrolled-courses",
    };
    if (status === "blocked") {
        if (isAuthenticate) {
            return <Navigate to="/restriction-message" replace />;
        }
        return children;
    }
    if (isAuthenticate) {
        if (!token || !role) {
            return <Navigate to="/" replace />;
        }
        const currentRolePath = location.pathname.split("/")[1];
        if (role && currentRolePath && currentRolePath !== role) {
            return <Navigate to={roleRoutes[role]} replace />;
        }
        return children;
    }
    if (token && role) {
        return <Navigate to={roleRoutes[role]} replace />;
    }

    return children;
};

export default RouteProtector;
