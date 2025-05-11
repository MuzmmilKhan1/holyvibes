import CourseOutlineScreen from "@/components/CourseOutlineScreen";
import SpinnerLoader from "@/components/SpinLoader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import useGetAndDelete from "@/hooks/useGetAndDelete";
import usePostAndPut from "@/hooks/usePostAndPut";
import axios from "axios";
import { Trash } from "lucide-react";
import { useEffect, useState } from "react";

type Course = {
    id: number | null;
    image: string;
    name: string;
    description: string;
    price: string | number;
    course_duration: string;
};

type FormData = {
    courseID: number | null;
    receipt: File | null;
    paymentMethod: string;
    classTimings: {
        from: string;
        to: string;
    }[];
};



const Courses = () => {
    const getCourse = useGetAndDelete(axios.get);
    const postBilling = usePostAndPut(axios.post);
    const getOutlines = useGetAndDelete(axios.get);

    const [showOutlines, setShowOutlines] = useState(false)

    const fetchCourseOutlines = async (courseId: React.Key | null) => {
        console.log(courseId)
        await getOutlines.callApi(`course/outlines/${courseId}`, true, false)
        setShowOutlines(!showOutlines)
    }

    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState<FormData>({
        courseID: null,
        receipt: null,
        paymentMethod: "",
        classTimings: [
            {
                from: "",
                to: "",
            },
        ],
    });


    const getCourses = async () => {
        const response = await getCourse.callApi("course/get", false, false);
        if (response.course) {
            console.log(response.course);
        }
    };


    const handlePayement = async (e: React.FormEvent) => {
        e.preventDefault();
        const response = await postBilling.callApi('student/purchase-course', formData, false, true, true);
        console.log(response)
    };

    useEffect(() => {
        getCourses();
    }, []);


    return (
        <div className="p-6">
            {
                !showOutlines &&
                <div>
                    {getCourse.loading ? (
                        <SpinnerLoader color="black" />
                    ) : (
                        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                            {!showForm &&
                                getCourse?.response?.course.map((course: Course) => (
                                    <div
                                        key={course.id}
                                        className="bg-white rounded-2xl border overflow-hidden"
                                    >
                                        <img
                                            src={course.image}
                                            alt={course.name}
                                            className="w-full h-48 object-none"
                                        />
                                        <div className="p-4">
                                            <h2 className="text-lg font-bold text-gray-800">{course.name}</h2>
                                            <p className="text-gray-600 mt-1 text-sm">{course.description}</p>
                                            <div className="mt-3 flex flex-col justify-between items-start">
                                                <div className="flex flex-row items-center justify-between px-1 w-full">
                                                    <span className="text-gray-600 font-semibold">${course.price}</span>
                                                    <span className="text-sm text-gray-500">{course.course_duration}</span>
                                                </div>
                                                <div className="flex mt-2 items-center justify-between w-full">
                                                    <Button
                                                        onClick={() => fetchCourseOutlines(course.id)}
                                                        size="sm">See outlines</Button>
                                                    <Button
                                                        size="sm"
                                                        onClick={() => {
                                                            setFormData((prev) => ({
                                                                ...prev,
                                                                courseID: course.id,
                                                            }));
                                                            setShowForm(true);
                                                        }}
                                                        disabled={postBilling.loading}
                                                    >
                                                        Purchase
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                        </div>
                    )}

                    {showForm && (
                        <div className="flex flex-col gap-5">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                <div className="p-5 border rounded-xl  bg-white">
                                    <CardTitle className="text-2xl font-bold  underline mb-6">
                                        Payment Details
                                    </CardTitle>
                                    <div className="space-y-6 ">
                                        <div>
                                            <h3 className="text-lg font-semibold underline mb-3">For Pakistani Students</h3>
                                            <div className="space-y-2">
                                                <p className="font-medium text-lg underline">Bank Details:</p>
                                                <p>
                                                    <span className="font-medium">Bank:</span> United Bank Limited (UBL)
                                                </p>
                                                <p>
                                                    <span className="font-medium">Account #:</span> 309795098
                                                </p>
                                                <p>
                                                    <span className="font-medium">Account Title:</span> Aneeqa Saeed
                                                </p>
                                                <div className="mt-4">
                                                    <p className="font-medium text-lg underline">JazzCash:</p>
                                                    <p>
                                                        <span className="font-medium">Number:</span> 0321-0102288
                                                    </p>
                                                    <p>
                                                        <span className="font-medium">Name:</span> Aneeqa Saeed
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* International Students */}
                                        <div>
                                            <h3 className="text-lg font-semibold underline mb-3">For International Students</h3>
                                            <div className="space-y-2">
                                                <p className="font-medium text-lg underline">ENBD Emirates Bank</p>
                                                <p>
                                                    <span className="font-medium">Account Title:</span> Aneeqa Saeed
                                                </p>
                                                <p>
                                                    <span className="font-medium">IBAN #:</span> AE330260000125922140601
                                                </p>
                                                <p>
                                                    <span className="font-medium">Account #:</span> 5922140601
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-5 border rounded-xl  bg-white">
                                    <CardTitle className="text-2xl font-bold  underline mb-6">
                                        Steps to Complete Payment
                                    </CardTitle>
                                    <ol className="list-disc list-inside space-y-4 ">
                                        <li>
                                            Select the appropriate payment method based on your location (UBL, Jazz Cash for Pakistani students; ENBD Emirates Bank for international students).
                                        </li>
                                        <li>
                                            Transfer the required amount to the provided account or Jazz Cash number. Ensure you include any reference number if provided.
                                        </li>
                                        <li>
                                            After making the payment, upload a clear image of the payment receipt in the form provided.
                                        </li>
                                        <li>
                                            Complete and submit the registration form with all required details, including the uploaded receipt.
                                        </li>
                                        <li>
                                            Wait for admin approval. You’ll receive a confirmation once your payment and registration are verified.
                                        </li>
                                    </ol>
                                </div>
                            </div>
                            
                            <Card className="w-full shadow-none">
                                <CardHeader>
                                    <CardTitle className="text-xl font-bold underline ">
                                        Complete Payment Details
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="receipt" className="text-sm font-medium text-gray-700">
                                            Upload Receipt Image
                                        </Label>
                                        <Input
                                            id="receipt"
                                            type="file"
                                            className="border-gray-300"
                                            onChange={(e) =>
                                                setFormData((prev) => ({
                                                    ...prev,
                                                    receipt: e.target.files?.[0] || null,
                                                }))
                                            }
                                        />
                                    </div>

                                    <div className="space-y-2">

                                        <Label htmlFor="payment-method" className="text-sm font-medium text-gray-700">
                                            Select Payment Method
                                        </Label>
                                        <Select
                                            onValueChange={(value: string) =>
                                                setFormData((prev) => ({
                                                    ...prev,
                                                    paymentMethod: value,
                                                }))
                                            }
                                            value={formData.paymentMethod}
                                        >
                                            <SelectTrigger id="payment-method" className="w-full border-gray-300">
                                                <SelectValue placeholder="Select payment method" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="bank transfer">Bank Transfer</SelectItem>
                                                <SelectItem value="jazzcash">JazzCash</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-4">
                                        <Label className="text-sm font-medium text-gray-700">Class Timings</Label>

                                        {formData.classTimings.map((timing, index) => (
                                            <div key={index} className="flex flex-row flex-wrap max-sm:mt-0 items-center justify-start gap-4">
                                                <div>
                                                    <Label>From</Label>
                                                    <Input
                                                        type="time"
                                                        value={timing.from}
                                                        onChange={(e) => {
                                                            const updated = [...formData.classTimings];
                                                            updated[index].from = e.target.value;
                                                            setFormData((prev) => ({ ...prev, classTimings: updated }));
                                                        }}
                                                    />
                                                </div>
                                                <div>
                                                    <Label>To</Label>
                                                    <Input
                                                        type="time"
                                                        value={timing.to}
                                                        onChange={(e) => {
                                                            const updated = [...formData.classTimings];
                                                            updated[index].to = e.target.value;
                                                            setFormData((prev) => ({ ...prev, classTimings: updated }));
                                                        }}
                                                    />
                                                </div>
                                                <div>
                                                    {
                                                        index !== 0 &&
                                                        <Button
                                                            type="button"
                                                            variant="destructive"
                                                            className="mt-3"
                                                            onClick={() => {
                                                                setFormData((prev) => ({
                                                                    ...prev,
                                                                    classTimings: prev.classTimings.filter((_, i) => i !== index),
                                                                }));
                                                            }}
                                                        >
                                                            <Trash className="w-4 h-4" />
                                                        </Button>
                                                    }
                                                </div>
                                            </div>
                                        ))}
                                        <Button
                                            type="button"
                                            variant="outline"
                                            className="mt-2"
                                            onClick={() =>
                                                setFormData((prev) => ({
                                                    ...prev,
                                                    classTimings: [...prev.classTimings, { from: "", to: "" }],
                                                }))
                                            }
                                        >
                                            + Add More
                                        </Button>
                                    </div>

                                    <div>
                                        <Button onClick={handlePayement}>Submit</Button>
                                        <Button onClick={() => setShowForm(!showForm)} variant='outline' className="ml-2">Close</Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    )}
                </div>
            }
            
            {
                showOutlines &&
                <CourseOutlineScreen
                    outlines={getOutlines?.response?.outlines}
                    setShowOutlines={setShowOutlines}
                    showOutlines={showOutlines}
                />
            }

        </div>
    );
};

export default Courses;
