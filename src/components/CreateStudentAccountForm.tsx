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

// Define TypeScript interfaces for clarity and type safety
interface Course {
    id: string;
    name: string;
}

interface Class {
    id: string;
    title: string;
}

interface ClassTime {
    id: string;
    preferred_time_from: string;
    preferred_time_to: string;
}

interface Billing {
    receipt_image: File | null;
    payment_method: string;
}

interface CourseFormData {
    courseID: string;
    classID: string;
    classTimeID: string;
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
    courses: CourseFormData[];
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
                courseID: "",
                classID: "",
                classTimeID: "",
                billing: { receipt_image: null, payment_method: "" },
            },
        ],
    });

    const [dob, setDob] = useState<Date | undefined>();
    const [registrationDate, setRegistrationDate] = useState<Date | undefined>();
    const [courseList, setCourseList] = useState<Course[]>([]);
    const [classesMap, setClassesMap] = useState<Record<string, Class[]>>({});
    const [classTimesMap, setClassTimesMap] = useState<Record<string, ClassTime[]>>({});
    const [previewUrls, setPreviewUrls] = useState<(string | null)[]>([null]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const getCourse = useGetAndDelete(axios.get);
    const getClasses = useGetAndDelete(axios.get);
    const getClassesTime = useGetAndDelete(axios.get);
    const postStudent = usePostAndPut(axios.post);

    const fetchCourses = async () => {
        try {
            const response = await getCourse.callApi("course/get", false, false);
            if (response?.course) {
                setCourseList(response.course);
            }
        } catch (err) {
            setError("Failed to fetch courses");
        }
    };

    const fetchClassesForCourse = async (courseID: string) => {
        try {
            const res = await getClasses.callApi(`class/get/${courseID}`, true, false);
            if (res?.class) {
                setClassesMap((prev) => ({ ...prev, [courseID]: res.class }));
            }
        } catch (err) {
            setError("Failed to fetch classes");
        }
    };

    const fetchClassesTime = async (classID: string) => {
        try {
            const response = await getClassesTime.callApi(
                `class/get/class-time/${classID}`,
                true,
                false
            );
            if (response?.classTime) {
                setClassTimesMap((prev) => ({ ...prev, [classID]: response.classTime }));
            }
        } catch (err) {
            setError("Failed to fetch class times");
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleLanguageChange = (value: string) => {
        setFormData((prev) => ({ ...prev, preferred_language: value }));
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const file = e.target.files?.[0];
        if (file) {
            const updatedCourses = [...formData.courses];
            updatedCourses[index].billing.receipt_image = file;
            setFormData((prev) => ({ ...prev, courses: updatedCourses }));

            const newPreviewUrls = [...previewUrls];
            newPreviewUrls[index] = URL.createObjectURL(file);
            setPreviewUrls(newPreviewUrls);
        }
    };

    const handlePaymentMethodChange = (value: string, index: number) => {
        const updatedCourses = [...formData.courses];
        updatedCourses[index].billing.payment_method = value;
        setFormData((prev) => ({ ...prev, courses: updatedCourses }));
    };

    const handleCourseChange = async (index: number, courseID: string) => {
        const updatedCourses = [...formData.courses];
        updatedCourses[index] = {
            ...updatedCourses[index],
            courseID,
            classID: "",
            classTimeID: "",
        };
        setFormData((prev) => ({ ...prev, courses: updatedCourses }));
        if (courseID) {
            await fetchClassesForCourse(courseID);
        }
    };

    const handleClassChange = async (index: number, classID: string) => {
        const updatedCourses = [...formData.courses];
        updatedCourses[index] = {
            ...updatedCourses[index],
            classID,
            classTimeID: "",
        };
        setFormData((prev) => ({ ...prev, courses: updatedCourses }));
        if (classID) {
            await fetchClassesTime(classID);
        }
    };

    const handleClassTimeChange = (index: number, classTimeID: string) => {
        const updatedCourses = [...formData.courses];
        updatedCourses[index].classTimeID = classTimeID;
        setFormData((prev) => ({ ...prev, courses: updatedCourses }));
    };

    const handleAddCourse = () => {
        setFormData((prev) => ({
            ...prev,
            courses: [
                ...prev.courses,
                { courseID: "", classID: "", classTimeID: "", billing: { receipt_image: null, payment_method: "" } },
            ],
        }));
        setPreviewUrls((prev) => [...prev, null]);
    };

    const handleRemoveCourse = (index: number) => {
        setFormData((prev) => ({
            ...prev,
            courses: prev.courses.filter((_, i) => i !== index),
        }));
        setPreviewUrls((prev) => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);
    
        try {
            const payload = {
                ...formData,
                date_of_birth: dob ? format(dob, "yyyy-MM-dd") : "",
                registration_date: registrationDate ? format(registrationDate, "yyyy-MM-dd") : "",
            };
    
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
            // Cleanup preview URLs to prevent memory leaks
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
                                        <Button variant="outline" className="w-full justify-start text-left">
                                            {dob ? format(dob, "MM/dd/yyyy") : "Pick a date"}
                                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0">
                                        <Calendar mode="single" selected={dob} onSelect={setDob} />
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
                                        <Button variant="outline" className="w-full justify-start text-left">
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
                            {formData.courses.map((course, index) => (
                                <div key={index} className="border p-4 rounded-md space-y-4">
                                    <div className="flex justify-between items-center">
                                        <Label>Course #{index + 1}</Label>
                                        {index > 0 && (
                                            <Button
                                                variant="destructive"
                                                size="icon"
                                                onClick={() => handleRemoveCourse(index)}
                                            >
                                                <Trash className="h-4 w-4" />
                                            </Button>
                                        )}
                                    </div>

                                    <Select
                                        onValueChange={(value) => handleCourseChange(index, value)}
                                        value={course.courseID}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select course" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {courseList.map((c) => (
                                                <SelectItem key={c.id} value={c.id}>
                                                    {c.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>

                                    {course.courseID && classesMap[course.courseID] && (
                                        <Select
                                            onValueChange={(value) => handleClassChange(index, value)}
                                            value={course.classID}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select class" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {classesMap[course.courseID].map((cls) => (
                                                    <SelectItem key={cls.id} value={cls.id}>
                                                        {cls.title}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    )}

                                    {course.classID && classTimesMap[course.classID] && (
                                        <Select
                                            onValueChange={(value) => handleClassTimeChange(index, value)}
                                            value={course.classTimeID}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select class time" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {classTimesMap[course.classID].map((time) => (
                                                    <SelectItem key={time.id} value={time.id}>
                                                        {time.preferred_time_from} - {time.preferred_time_to}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    )}

                                    <div>
                                        <Label htmlFor={`receipt_image_${index}`}>Receipt Image</Label>
                                        <Input
                                            id={`receipt_image_${index}`}
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => handleImageChange(e, index)}
                                        />
                                    </div>

                                    {previewUrls[index] && (
                                        <div>
                                            <img
                                                src={previewUrls[index]!}
                                                alt="Receipt Preview"
                                                className="mt-2 max-h-48 rounded-md border"
                                            />
                                        </div>
                                    )}

                                    <div>
                                        <Label>Payment Method</Label>
                                        <Select
                                            onValueChange={(value) => handlePaymentMethodChange(value, index)}
                                            value={course.billing.payment_method}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select payment method" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Credit Card">Credit Card</SelectItem>
                                                <SelectItem value="PayPal">PayPal</SelectItem>
                                                <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            ))}

                            <Button type="button" variant="outline" onClick={handleAddCourse}>
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