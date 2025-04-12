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

const CreateStudentAccountForm = () => {
    const [formData, setFormData] = useState({
        name: "",
        guardian_name: "",
        email: "",
        contact_number: "",
        alternate_contact_number: "",
        preferred_language: "",
        signature: "",
        courses: [
            { courseID: "", classID: "", classTimeID: "" }
        ]
    });

    const [dob, setDob] = useState<Date | undefined>();
    const [registrationDate, setRegistrationDate] = useState<Date | undefined>();
    const [courseList, setCourseList] = useState([]);
    const [classesMap, setClassesMap] = useState<Record<string, any[]>>({});
    const [classTimesMap, setClassTimesMap] = useState<Record<string, any[]>>({});
    const getCourse = useGetAndDelete(axios.get);
    const getClasses = useGetAndDelete(axios.get);
    const getClassesTime = useGetAndDelete(axios.get);

    const fetchCourses = async () => {
        const response = await getCourse.callApi("course/get", false, false);
        if (response?.course) {
            setCourseList(response.course);
        }
    };

    const fetchClassesForCourse = async (courseID: string) => {
        const res = await getClasses.callApi(`class/get/${courseID}`, true, false);
        if (res?.class) {
            setClassesMap((prev) => ({ ...prev, [courseID]: res.class }));
        }
    };

    const fetchClassesTime = async (classID: string) => {
        const response = await getClassesTime.callApi(`class/get/class-time/${classID}`, true, false);
        if (response?.classTime) {
            setClassTimesMap((prev) => ({ ...prev, [classID]: response.classTime }));
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleLanguageChange = (value: string) => {
        setFormData({ ...formData, preferred_language: value });
    };

    const handleCourseChange = async (index: number, courseID: string) => {
        const updatedCourses = [...formData.courses];
        updatedCourses[index].courseID = courseID;
        updatedCourses[index].classID = "";
        updatedCourses[index].classTimeID = "";
        setFormData({ ...formData, courses: updatedCourses });
        await fetchClassesForCourse(courseID);
    };

    const handleClassChange = async (index: number, classID: string) => {
        const updatedCourses = [...formData.courses];
        updatedCourses[index].classID = classID;
        updatedCourses[index].classTimeID = "";
        setFormData({ ...formData, courses: updatedCourses });
        await fetchClassesTime(classID);
    };

    const handleClassTimeChange = (index: number, classTimeID: string) => {
        const updatedCourses = [...formData.courses];
        updatedCourses[index].classTimeID = classTimeID;
        setFormData({ ...formData, courses: updatedCourses });
    };

    const handleAddCourse = () => {
        setFormData({
            ...formData,
            courses: [...formData.courses, { courseID: "", classID: "", classTimeID: "" }]
        });
    };

    const handleRemoveCourse = (index: number) => {
        const updatedCourses = formData.courses.filter((_, i) => i !== index);
        setFormData({ ...formData, courses: updatedCourses });
    };

    const handleSubmit = async () => {
        try {
            const payload = {
                ...formData,
                date_of_birth: dob ? format(dob, "yyyy-MM-dd") : null,
                registration_date: registrationDate ? format(registrationDate, "yyyy-MM-dd") : null,
            };
            console.log(payload);
            // Submit to API
        } catch (error) {
            console.error("Error submitting form:", error);
        }
    };

    useEffect(() => {
        fetchCourses();
    }, []);

    return (
        <div className="max-w-7xl mx-auto p-5">
            <Card>
                <CardHeader>
                    <CardTitle>Create Student Account</CardTitle>
                    <CardDescription>
                        Fill in the information below to request admin for approval.
                    </CardDescription>
                </CardHeader>

                <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <Label>Name</Label>
                            <Input
                                name="name"
                                placeholder="Student Name"
                                value={formData.name}
                                onChange={handleInputChange}
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
                            />
                        </div>

                        <div>
                            <Label>Contact Number</Label>
                            <Input
                                name="contact_number"
                                placeholder="Phone number"
                                value={formData.contact_number}
                                onChange={handleInputChange}
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
                            <Select onValueChange={handleLanguageChange} value={formData.preferred_language}>
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
                                    <Calendar mode="single" selected={registrationDate} onSelect={setRegistrationDate} />
                                </PopoverContent>
                            </Popover>
                        </div>
                    </div>

                    {/* Multi-course selection */}
                    <div className="space-y-6">
                        {formData.courses.map((course, index) => (
                            <div key={index} className="border p-4 rounded-md space-y-4">
                                <div className="flex justify-between items-center">
                                    <Label>Course #{index + 1}</Label>
                                    {index > 0 && (
                                        <Button variant="destructive" size="icon" onClick={() => handleRemoveCourse(index)}>
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
                                        {courseList.map((c: any) => (
                                            <SelectItem key={c.id} value={String(c.id)}>{c.name}</SelectItem>
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
                                            {classesMap[course.courseID]?.map((cls: any) => (
                                                <SelectItem key={cls.id} value={String(cls.id)}>{cls.title}</SelectItem>
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
                                            {classTimesMap[course.classID]?.map((time: any) => (
                                                <SelectItem key={time.id} value={String(time.id)}>
                                                    {time.preferred_time_from} - {time.preferred_time_to}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                )}
                            </div>
                        ))}

                        <Button type="button" variant="outline" onClick={handleAddCourse}>
                            <Plus className="w-4 h-4 mr-2" /> Add Another Course
                        </Button>
                    </div>
                </CardContent>

                <CardFooter>
                    <Button className="ml-auto" onClick={handleSubmit}>
                        Submit
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
};

export default CreateStudentAccountForm;
