import Helpers from "@/config/Helpers";
import { useState } from "react";
import { toast } from "sonner";

type ApiMethod = (url: string, data: any, config: { headers: any }) => Promise<any>;

const usePostAndPut = (method: ApiMethod) => {
    const [loading, setLoading] = useState<boolean>(false);
    const [response, setResponse] = useState<any>(null);
    const [error, setError] = useState<any>(null);

    const callApi = async (
        path: string,
        data: any,
        auth: boolean,
        fileHeaders: boolean,
        showMessage: boolean
    ) => {
        setLoading(true);
        setError(null);

        const url = `${Helpers.apiUrl}${path}`;
        let headers;

        if (auth) {
            headers = fileHeaders
                ? { "Content-Type": "multipart/form-data" }
                : { "Content-Type": "application/json" };
        } else {
            headers = fileHeaders
                ? {
                    "Content-Type": "multipart/form-data",
                    token: `${localStorage.getItem("token")}`,
                }
                : {
                    "Content-Type": "application/json",
                    token: `${localStorage.getItem("token")}`,
                };
        }
        const toastId = toast.loading("Loading...");
        try {
            const res = await method(url, data, { headers });
            setResponse(res);
            setError(null);
            toast.dismiss(toastId);
            showMessage && toast.success(res.data.message);
            return res;
        } catch (err: any) {
            toast.dismiss(toastId);
            let errorMessage: string;
            if (err.response?.data?.error && typeof err.response.data.error === "object") {
                errorMessage = "Validation failed";
                const validationErrors = Object.values(err.response.data.error).flat();
                if (validationErrors.length > 0) {
                    errorMessage += ": " + validationErrors.join("; ");
                }
            } else {
                errorMessage = err.response?.data?.error || err.response?.data?.message || "Something went wrong";
            }
            toast.error(errorMessage);
            setResponse(null);
            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return { callApi, loading, response, error };
};

export default usePostAndPut;
