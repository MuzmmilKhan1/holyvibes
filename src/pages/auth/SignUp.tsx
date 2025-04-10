import NavBar from "@/components/navbar"
import { SignupForm } from "@/components/signup-form"

const SignUp = () => {
    return (
        <div>
            <NavBar />
            <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
                <div className="w-full max-w-sm">
                    <SignupForm />
                </div>
            </div>
        </div>
    )
}

export default SignUp