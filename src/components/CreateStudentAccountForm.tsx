import { useEffect, useState } from "react";
import { format } from "date-fns";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { CalendarIcon, Plus, Trash } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
    CardFooter,
} from "@/components/ui/card";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import axios from "axios";
import useGetAndDelete from "@/hooks/useGetAndDelete";
import usePostAndPut from "@/hooks/usePostAndPut";

// Define TypeScript interfaces
interface Course {
    id: string;
    name: string;
}

interface Timing {
    from: string;
    to: string;
}

interface Billing {
    receipt_image: File | null;
    payment_method: string;
}

interface CourseSelection {
    course_id: string;
    course_name: string | undefined;
    timings: Timing[];
    billing: Billing;
}

interface FormData {
    name: string;
    guardian_name: string;
    email: string;
    contact_number: string;
    alternate_contact_number: string;
    preferred_language: string;
    signature: string;
    courses: CourseSelection[];
}

const CreateStudentAccountForm = () => {
    const [formData, setFormData] = useState<FormData>({
        name: "",
        guardian_name: "",
        email: "",
        contact_number: "",
        alternate_contact_number: "",
        preferred_language: "",
        signature: "",
        courses: [
            {
                course_id: "",
                course_name: "",
                timings: [{ from: "", to: "" }],
                billing: { receipt_image: null, payment_method: "" },
            },
        ],
    });

    const [dob, setDob] = useState<Date | undefined>();
    const [registrationDate, setRegistrationDate] = useState<Date | undefined>();
    const [courseList, setCourseList] = useState<Course[]>([]);
    const [previewUrls, setPreviewUrls] = useState<(string | null)[]>([null]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const getCourse = useGetAndDelete(axios.get);
    const postStudent = usePostAndPut(axios.post);

    const fetchCourses = async () => {
        try {
            const response = await getCourse.callApi("course/get", false, false);
            if (response?.course) {
                console.log(response?.course)
                setCourseList(response.course);
            }
        } catch (err) {
            setError("Failed to fetch courses");
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleLanguageChange = (value: string) => {
        setFormData((prev) => ({ ...prev, preferred_language: value }));
    };

    const handleImageChange = (
        e: React.ChangeEvent<HTMLInputElement>,
        courseIndex: number
    ) => {
        const file = e.target.files?.[0];
        if (file) {
            const updatedCourses = [...formData.courses];
            updatedCourses[courseIndex].billing.receipt_image = file;
            setFormData((prev) => ({ ...prev, courses: updatedCourses }));

            const newPreviewUrls = [...previewUrls];
            if (newPreviewUrls[courseIndex]) {
                URL.revokeObjectURL(newPreviewUrls[courseIndex]!);
            }
            newPreviewUrls[courseIndex] = URL.createObjectURL(file);
            setPreviewUrls(newPreviewUrls);
        }
    };

    const handlePaymentMethodChange = (value: string, courseIndex: number) => {
        const updatedCourses = [...formData.courses];
        updatedCourses[courseIndex].billing.payment_method = value;
        setFormData((prev) => ({ ...prev, courses: updatedCourses }));
    };

    const handleCourseChange = (index: number, courseId: string) => {
        const updatedCourses = [...formData.courses];
        console.log(courseList.find((c) => c.id == courseId)?.name || "")
        updatedCourses[index] = {
            course_id: courseId,
            course_name: courseList.find((c) => c.id == courseId)?.name ?? undefined,
            timings: updatedCourses[index].timings || [{ from: "", to: "" }],
            billing: updatedCourses[index].billing,
        };
        setFormData((prev) => ({ ...prev, courses: updatedCourses }));
    };

    const handleTimingChange = (
        courseIndex: number,
        timingIndex: number,
        field: "from" | "to",
        value: string
    ) => {
        const updatedCourses = [...formData.courses];
        updatedCourses[courseIndex].timings[timingIndex][field] = value;
        setFormData((prev) => ({ ...prev, courses: updatedCourses }));
    };

    const handleAddTiming = (courseIndex: number) => {
        const updatedCourses = [...formData.courses];
        updatedCourses[courseIndex].timings.push({ from: "", to: "" });
        setFormData((prev) => ({ ...prev, courses: updatedCourses }));
    };

    const handleRemoveTiming = (courseIndex: number, timingIndex: number) => {
        const updatedCourses = [...formData.courses];
        updatedCourses[courseIndex].timings = updatedCourses[
            courseIndex
        ].timings.filter((_, i) => i !== timingIndex);
        if (updatedCourses[courseIndex].timings.length === 0) {
            updatedCourses[courseIndex].timings = [{ from: "", to: "" }];
        }
        setFormData((prev) => ({ ...prev, courses: updatedCourses }));
    };

    const handleAddCourse = () => {
        setFormData((prev) => ({
            ...prev,
            courses: [
                ...prev.courses,
                {
                    course_id: "",
                    course_name: "",
                    timings: [{ from: "", to: "" }],
                    billing: { receipt_image: null, payment_method: "" },
                },
            ],
        }));
        setPreviewUrls((prev) => [...prev, null]);
    };

    const handleRemoveCourse = (index: number) => {
        setFormData((prev) => ({
            ...prev,
            courses: prev.courses.filter((_, i) => i !== index),
        }));
        setPreviewUrls((prev) => {
            const newUrls = prev.filter((_, i) => i !== index);
            if (prev[index]) URL.revokeObjectURL(prev[index]!);
            return newUrls;
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        try {
            const payload = {
                ...formData,
                date_of_birth: dob ? format(dob, "yyyy-MM-dd") : "",
                registration_date: registrationDate
                    ? format(registrationDate, "yyyy-MM-dd")
                    : "",
                courses: formData.courses.filter(
                    (course) =>
                        course.course_id &&
                        course.timings.some((t) => t.from && t.to)
                ),
            };


            console.log("Submission successful:", payload);

            // const formDataPayload = new FormData();
            // formDataPayload.append("name", payload.name);
            // formDataPayload.append("guardian_name", payload.guardian_name);
            // formDataPayload.append("email", payload.email);
            // formDataPayload.append("contact_number", payload.contact_number);
            // formDataPayload.append(
            //     "alternate_contact_number",
            //     payload.alternate_contact_number
            // );
            // formDataPayload.append("preferred_language", payload.preferred_language);
            // formDataPayload.append("signature", payload.signature);
            // formDataPayload.append("date_of_birth", payload.date_of_birth);
            // formDataPayload.append("registration_date", payload.registration_date);

            // // Append courses as JSON and receipt images with unique keys
            // payload.courses.forEach((course, index) => {
            //     if (course.billing.receipt_image) {
            //         formDataPayload.append(
            //             `receipt_images[${index}]`,
            //             course.billing.receipt_image
            //         );
            //     }
            // });
            // formDataPayload.append("courses", JSON.stringify(payload.courses));

            const response = await postStudent.callApi(
                "student/register",
                payload,
                true,
                true,
                true
            );
            console.log("Submission successful:", response);


        } catch (error) {
            console.error("Error submitting form:", error);
            setError("Failed to submit form. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    useEffect(() => {
        fetchCourses();
        return () => {
            previewUrls.forEach((url) => {
                if (url) URL.revokeObjectURL(url);
            });
        };
    }, []);

    return (
        <div className="max-w-7xl mx-auto p-5">
            <Card className="shadow-none">
                <CardHeader>
                    <CardTitle>Create Student Account</CardTitle>
                    <CardDescription>
                        Fill in the information below to request admin approval.
                    </CardDescription>
                </CardHeader>

                <CardContent className="space-y-6">
                    {error && <div className="text-red-500">{error}</div>}
                    <form onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <Label>Name</Label>
                                <Input
                                    name="name"
                                    placeholder="Student Name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>

                            <div>
                                <Label>Date of Birth</Label>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant="outline"
                                            className="w-full justify-start text-left"
                                        >
                                            {dob
                                                ? format(dob, "MM/dd/yyyy")
                                                : "Pick a date"}
                                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0">
                                        <Calendar
                                            mode="single"
                                            selected={dob}
                                            onSelect={setDob}
                                        />
                                    </PopoverContent>
                                </Popover>
                            </div>

                            <div>
                                <Label>Guardian Name</Label>
                                <Input
                                    name="guardian_name"
                                    placeholder="Guardian's Full Name"
                                    value={formData.guardian_name}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>

                            <div>
                                <Label>Email</Label>
                                <Input
                                    name="email"
                                    type="email"
                                    placeholder="example@email.com"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>

                            <div>
                                <Label>Contact Number</Label>
                                <Input
                                    name="contact_number"
                                    placeholder="Phone number"
                                    value={formData.contact_number}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>

                            <div>
                                <Label>Alternate Contact Number</Label>
                                <Input
                                    name="alternate_contact_number"
                                    placeholder="Optional"
                                    value={formData.alternate_contact_number}
                                    onChange={handleInputChange}
                                />
                            </div>

                            <div>
                                <Label>Languages Spoken</Label>
                                <Select
                                    onValueChange={handleLanguageChange}
                                    value={formData.preferred_language}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select language" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="urdu">Urdu</SelectItem>
                                        <SelectItem value="english">English</SelectItem>
                                        <SelectItem value="arabic">Arabic</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div>
                                <Label>Signature</Label>
                                <Input
                                    name="signature"
                                    placeholder="Type signature"
                                    value={formData.signature}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>

                            <div>
                                <Label>Registration Date</Label>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant="outline"
                                            className="w-full justify-start text-left"
                                        >
                                            {registrationDate
                                                ? format(registrationDate, "MM/dd/yyyy")
                                                : "Pick a date"}
                                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0">
                                        <Calendar
                                            mode="single"
                                            selected={registrationDate}
                                            onSelect={setRegistrationDate}
                                        />
                                    </PopoverContent>
                                </Popover>
                            </div>
                        </div>

                        <div className="space-y-6 mt-6">
                            {formData.courses.map((course, courseIndex) => (
                                <div
                                    key={courseIndex}
                                    className="border p-4 rounded-md space-y-4"
                                >
                                    <div className="flex justify-between items-center">
                                        <Label>Course #{courseIndex + 1}</Label>
                                        {courseIndex > 0 && (
                                            <Button
                                                variant="destructive"
                                                size="icon"
                                                onClick={() => handleRemoveCourse(courseIndex)}
                                            >
                                                <Trash className="h-4 w-4" />
                                            </Button>
                                        )}
                                    </div>

                                    <div>
                                        <Label>Course</Label>
                                        <Select
                                            onValueChange={(value) =>
                                                handleCourseChange(courseIndex, value)
                                            }
                                            value={course.course_id}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select course" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {courseList.map((c) => (
                                                    <SelectItem
                                                        key={c.id}
                                                        value={c.id.toString()}
                                                    >
                                                        {c.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Timings</Label>
                                        {course.timings.map((timing, timingIndex) => (
                                            <div
                                                key={timingIndex}
                                                className="flex gap-4 items-center"
                                            >
                                                <div className="flex-1">
                                                    <Label className="sr-only">
                                                        From
                                                    </Label>
                                                    <Input
                                                        type="time"
                                                        placeholder="From"
                                                        value={timing.from}
                                                        onChange={(e) =>
                                                            handleTimingChange(
                                                                courseIndex,
                                                                timingIndex,
                                                                "from",
                                                                e.target.value
                                                            )
                                                        }
                                                    />
                                                </div>
                                                <div className="flex-1">
                                                    <Label className="sr-only">To</Label>
                                                    <Input
                                                        type="time"
                                                        placeholder="To"
                                                        value={timing.to}
                                                        onChange={(e) =>
                                                            handleTimingChange(
                                                                courseIndex,
                                                                timingIndex,
                                                                "to",
                                                                e.target.value
                                                            )
                                                        }
                                                    />
                                                </div>
                                                {course.timings.length > 1 && (
                                                    <Button
                                                        variant="destructive"
                                                        size="icon"
                                                        onClick={() =>
                                                            handleRemoveTiming(
                                                                courseIndex,
                                                                timingIndex
                                                            )
                                                        }
                                                    >
                                                        <Trash className="h-4 w-4" />
                                                    </Button>
                                                )}
                                            </div>
                                        ))}
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleAddTiming(courseIndex)}
                                        >
                                            <Plus className="w-4 h-4 mr-2" /> Add Timing
                                        </Button>
                                    </div>

                                    <div>
                                        <Label htmlFor={`receipt_image_${courseIndex}`}>
                                            Receipt Image
                                        </Label>
                                        <Input
                                            id={`receipt_image_${courseIndex}`}
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => handleImageChange(e, courseIndex)}
                                        />
                                    </div>

                                    {previewUrls[courseIndex] && (
                                        <div>
                                            <img
                                                src={previewUrls[courseIndex]!}
                                                alt={`Receipt Preview for Course ${courseIndex + 1}`}
                                                className="mt-2 max-h-48 rounded-md border"
                                            />
                                        </div>
                                    )}

                                    <div>
                                        <Label>Payment Method</Label>
                                        <Select
                                            onValueChange={(value) =>
                                                handlePaymentMethodChange(value, courseIndex)
                                            }
                                            value={course.billing.payment_method}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select payment method" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Credit Card">
                                                    Credit Card
                                                </SelectItem>
                                                <SelectItem value="PayPal">
                                                    PayPal
                                                </SelectItem>
                                                <SelectItem value="Bank Transfer">
                                                    Bank Transfer
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            ))}

                            <Button
                                type="button"
                                variant="outline"
                                onClick={handleAddCourse}
                            >
                                <Plus className="w-4 h-4 mr-2" /> Add Another Course
                            </Button>
                        </div>

                        <CardFooter className="mt-6">
                            <Button type="submit" disabled={isSubmitting}>
                                {isSubmitting ? "Submitting..." : "Submit"}
                            </Button>
                        </CardFooter>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};

export default CreateStudentAccountForm;