import { useState } from "react";
import NavBar from "@/components/navbar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import axios from "axios";
import Helpers from "@/config/Helpers";

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");
        setError("");

        try {
            const response = await axios.post(`${Helpers.apiUrl}auth/forgot-password`, { email });
            setMessage(response.data.message || "Reset link sent to your email.");
        } catch (err: any) {
            setError(
                err.response?.data?.message || "Failed to send reset link. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <NavBar />
            <div className="flex min-h-[93vh] w-full items-center justify-center p-4">
                <Card className="w-full max-w-md shadow-none">
                    <form onSubmit={handleSubmit}>
                        <CardHeader  >
                            <CardTitle className="text-xl ">Forgot Password</CardTitle>
                            <CardDescription>
                                Enter your email address to reset your password
                            </CardDescription>
                        </CardHeader>

                        <CardContent className="space-y-4 mt-5">
                            <div className="space-y-2">
                                <Label htmlFor="email">Email Address</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="you@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                            {message && <p className="text-green-600 text-sm text-center">{message}</p>}
                            {error && <p className="text-red-600 text-sm text-center">{error}</p>}
                            <Button
                                type="submit"
                                className="w-full"
                                disabled={loading}
                            >
                                {loading ? "Sending..." : "Send Reset Link"}
                            </Button>
                        </CardContent>

                    </form>
                </Card>
            </div>
        </div>
    );
};

export default ForgotPassword;
