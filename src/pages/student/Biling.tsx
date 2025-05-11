import SpinnerLoader from "@/components/SpinLoader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import useGetAndDelete from "@/hooks/useGetAndDelete";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import logo from "../../assets/logo.png";
import { useReactToPrint } from "react-to-print";

interface BillingItem {
    event?: { title: string; description: string; price: number };
    course?: { name: string; description: string; price: number };
    paymentMethod: string;
    receipt?: string;
}

const Receipt = ({ data }: { data: BillingItem | null }) => {
    return (
        <div className="a4-report mx-auto bg-white shadow-lg font-sans w-full max-w-[210mm] min-h-[297mm] p-2 sm:p-4 md:p-5">
            <div className="border-4 border-double border-green-800 w-full h-[285mm]">
                <div className="border-b-4 border-double border-green-800 bg-green-50 w-full flex items-center justify-center mb-3 sm:mb-5 p-2 sm:p-3 md:p-5">
                    <img
                        src={logo}
                        alt="Logo"
                        className="w-12 sm:w-16 md:w-20 mr-2 sm:mr-3"
                    />
                    <h1 className="text-green-800 font-bold text-lg sm:text-xl md:text-2xl">
                        Holy Vibes
                    </h1>
                </div>
                <div className="px-2 sm:px-4 md:px-6 lg:px-10">
                    <h2 className="text-center mt-10 font-semibold text-lg sm:text-xl md:text-2xl lg:text-2xl mb-3 sm:mb-4 md:mb-5">
                        Billing Receipt
                    </h2>
                    <div className="text-xs sm:text-sm md:text-base leading-relaxed">
                        {data?.receipt &&
                            <div className="flex items-center justify-center mt-5" >
                                <img src={data.receipt} alt="Receipt" className="rounded-lg" />
                            </div>
                        }
                        <h3 className="font-bold text-sm sm:text-base md:text-lg mt-2 sm:mt-3 md:mt-4">
                            {data?.event ? "Event" : "Course"}
                        </h3>
                        <p className="text-gray-600">
                            {data?.event ? data.event.title : data?.course?.name}
                        </p>
                        <h3 className="font-bold text-sm sm:text-base md:text-lg mt-2 sm:mt-3 md:mt-4">
                            Price
                        </h3>
                        <p className="text-gray-600">
                            {data?.event ? data.event.price : data?.course?.price}
                        </p>
                        <h3 className="font-bold text-sm sm:text-base md:text-lg mt-2 sm:mt-3 md:mt-4">
                            Payment Method
                        </h3>
                        <p className="text-gray-600">{data?.paymentMethod}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

const Billing = () => {
    const getStdBilling = useGetAndDelete(axios.get);
    const [showReceipt, setShowReceipt] = useState(false);
    const [data, setData] = useState<BillingItem | null>(null);

    const getBilling = async () => {
        const response = await getStdBilling.callApi("student/billing", false, false);
        console.log(response);
    };

    const contentRef = useRef<HTMLDivElement>(null);
    const handlePrint = useReactToPrint({
        contentRef,
        documentTitle: `Receipt`,
        onAfterPrint: () => console.log("Report printed successfully"),
    });

    useEffect(() => {
        getBilling();
    }, []);

    return (
        <div className="p-5">
            {getStdBilling.loading ? (
                <SpinnerLoader color="black" />
            ) : (
                !showReceipt && (
                    <div className="space-y-2">
                        {getStdBilling?.response?.billing?.map(
                            (billingItem: BillingItem, index: number) => (
                                <Card key={index} className="shadow-none">
                                    <CardHeader className="mb-0">
                                        <h2 className="font-semibold text-lg">
                                            {billingItem.event
                                                ? billingItem.event.title
                                                : billingItem.course?.name}
                                        </h2>
                                    </CardHeader>
                                    <CardContent className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm">
                                                {billingItem.event
                                                    ? billingItem.event.description
                                                    : billingItem.course?.description}
                                            </p>
                                            <p className="mt-1 text-sm">
                                                <span className="font-semibold">
                                                    $
                                                    {billingItem.event
                                                        ? billingItem.event.price
                                                        : billingItem.course?.price}
                                                </span>
                                            </p>
                                            <p className="text-sm mt-1">
                                                {billingItem.paymentMethod}
                                            </p>
                                        </div>
                                        <div>
                                            <Button
                                                onClick={() => {
                                                    setShowReceipt(true);
                                                    setData(billingItem);
                                                }}
                                            >
                                                View
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            )
                        )}
                    </div>
                )
            )}

            {showReceipt && (
                <div>
                    <div className="flex justify-end mb-4">
                        <Button onClick={handlePrint}>Print</Button>
                        <Button
                            className="ml-2"
                            onClick={() => {
                                setShowReceipt(false);
                                setData(null);
                            }}
                        >
                            Close
                        </Button>
                    </div>
                    <div ref={contentRef}>
                        <Receipt data={data} />
                    </div>
                </div>
            )}
        </div>
    );
};

export default Billing;