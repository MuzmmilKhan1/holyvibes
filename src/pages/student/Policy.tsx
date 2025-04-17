import SpinnerLoader from "@/components/SpinLoader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import useGetAndDelete from "@/hooks/useGetAndDelete";
import axios from "axios";
import { useEffect } from "react";

const Policy = () => {
    const getPolicy = useGetAndDelete(axios.get);

    const fetchPolicies = async () => {
        const response = await getPolicy.callApi("student-policy/get", true, false);
        console.log(response.policy);
    };

    useEffect(() => {
        fetchPolicies();
    }, []);

    return (
        <div className="p-6">
            {
                getPolicy.loading ? (
                    <SpinnerLoader color="black" />
                ) :
                    <Card className="shadow-none" >
                        <CardHeader >
                            <CardTitle className="text-xl font-bold underline ">
                                Student Policies
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {getPolicy.response?.policy?.length > 0 ? (
                                <ul className="space-y-4">
                                    {getPolicy.response.policy.map(
                                        (policy: { id: number; title: string; description: string }) => (
                                            <li
                                                key={policy.id}
                                                className="p-4 bg-white rounded-lg  border border-gray-200 "
                                            >
                                                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                                                    {policy.title}
                                                </h3>
                                                <p className="text-gray-600 text-sm leading-relaxed">
                                                    {policy.description}
                                                </p>
                                            </li>
                                        )
                                    )}
                                </ul>
                            ) : (
                                <p className="text-gray-500 text-center">
                                    No policies available at the moment.
                                </p>
                            )}
                        </CardContent>
                    </Card>
            }
        </div>
    );
};

export default Policy;