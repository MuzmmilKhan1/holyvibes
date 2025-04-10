import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Link } from "react-router-dom"
import { useNavigate } from "react-router-dom"
import usePostAndPut from "@/hooks/usePostAndPut"
import { useState } from "react"
import axios from "axios"


interface User {
  email: string;
  password: string;
}

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {

  const defaultUserData: User = {
    email: "",
    password: "",
  };
  const post = usePostAndPut(axios.post);
  const navigate = useNavigate();

  const [userData, setUserData] = useState<User>(defaultUserData);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setUserData((prev) => ({ ...prev, [id]: value }));
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log(userData);
    const res = await post.callApi("auth/login", userData, true, false, true);
    if (res.status == 200) {
      localStorage.setItem("token", res.data.token)
      if (res.data.user.role === "admin") {
        navigate(res.data.user.role + "/course")
      }

    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle   >Login to your account</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} >
            <div className="flex flex-col gap-6">
              <div className="grid gap-3">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="grid gap-3">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <a href="#" className="ml-auto inline-block text-sm underline-offset-4 hover:underline">
                    Forgot your password?
                  </a>
                </div>
                <Input id="password" type="password" required onChange={handleInputChange} />
              </div>
              <div className="flex flex-col gap-3">
                <Button type="submit" className="w-full">
                  Login
                </Button>

              </div>
            </div>
            <div className="mt-4 text-center text-sm">
              <span className="mb-2" >
                Don&apos;t have an account?{" "}
              </span>
              <br />
              <Link to="/create-teacher-account" className="underline underline-offset-4 ">
                Create Teacher Account
              </Link>
              <br />
              or
              <br />
              <Link to="/create-student-account" className="underline underline-offset-4">
                Create Student Account
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
