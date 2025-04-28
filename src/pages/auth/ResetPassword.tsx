import { useState, useEffect } from "react";
import NavBar from "@/components/navbar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import axios from "axios";
import Helpers from "@/config/Helpers";
import { useParams } from "react-router-dom";

const ResetPassword = () => {
  const { token, email } = useParams();
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!token || !email) {
      setError("Invalid or missing token and email.");
    }
  }, [token, email]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    try {
      const response = await axios.post(`${Helpers.apiUrl}auth/reset-password`, {
        token,
        email,
        password,
      });

      setMessage(response.data.message || "Password reset successful.");
    } catch (err: any) {
      setError(
        err.response?.data?.message || "Failed to reset password. Please try again."
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
            <CardHeader>
              <CardTitle className="text-xl">Change Password</CardTitle>
              <CardDescription>Enter your new password</CardDescription>
            </CardHeader>

            <CardContent className="space-y-4 mt-5">
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter new password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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
                {loading ? "Resetting..." : "Reset Password"}
              </Button>
            </CardContent>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default ResetPassword;
