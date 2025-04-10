import { LoginForm } from "@/components/login-form"
import NavBar from "@/components/navbar"

const Login = () => {
    return (
        <div>
            <NavBar />
            <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
                <div className="w-full max-w-sm">
                    <LoginForm />
                </div>
            </div>
        </div>
    )
}

export default Login