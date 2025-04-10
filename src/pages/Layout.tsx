import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from '@/components/app-sidebar'
import NavBar from "@/components/navbar"
import { Outlet } from "react-router-dom"


const Layout = ({ userType }: { userType: string }) => {
    return (
        <SidebarProvider>
            <AppSidebar userType={userType} />
            <SidebarInset>
                <NavBar />
                <div className="h-auto w-full "  >
                    <Outlet />
                </div>
            </SidebarInset>
        </SidebarProvider>
    )
}

export default Layout