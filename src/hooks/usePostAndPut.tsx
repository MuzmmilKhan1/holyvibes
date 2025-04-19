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
            const errorMessage = err.response?.data?.error || err.response?.data?.message || "Something went wrong";
            toast.error(errorMessage);
            setResponse(null);
            setError(err);
            return err;
        } finally {
            setLoading(false);
        }
    };

    return { callApi, loading, response, error };
};

export default usePostAndPut;
