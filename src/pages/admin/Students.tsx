import useGetAndDelete from "@/hooks/useGetAndDelete";
import axios from "axios";
import { useEffect, useState } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle
} from "@/components/ui/card";
import SpinnerLoader from "@/components/SpinLoader";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import usePostAndPut from "@/hooks/usePostAndPut";

interface Student {
    id: number;
    name: string;
    email: string;
    contact_number: string;
    alternate_contact_number: string;
    date_of_birth: string;
    preferred_language: string;
    guardian_name: string;
    signature: string;
    registration_date: string;
    class_course_data: any | null;
    created_at: string;
    updated_at: string;
    status: string
}

interface FormData {
    id: number
    name: string;
    email: string;
    password: string;
}

interface Course {
    name: string;
    course_duration: string;
}

interface BillingDetail {
    receipt: string;
    paymentMethod: string;
    paymentStatus: string;
    course?: Course;
}

const Students = () => {
    const getStd = useGetAndDelete(axios.get);
    const getBilling = useGetAndDelete(axios.get);
    const getClassCourseData = usePostAndPut(axios.post);
    const postLoginCredentials = usePostAndPut(axios.post);
    const getAllocatedCourseClass = useGetAndDelete(axios.get);

    const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
    const [showBillingDetails, setShowBillingDetails] = useState<boolean>(false);
    const [showStdEnrollment, setShowStdEnrollment] = useState<boolean>(false);
    const [formData, setFormData] = useState<FormData>({
        id: 0,
        name: "",
        email: "",
        password: "",
    });

    const getStudents = async () => {
        await getStd.callApi("student/get", true, false);
    };

    useEffect(() => {
        getStudents();
    }, []);

    useEffect(() => {
        if (selectedStudent) {
            setFormData({
                id: selectedStudent.id,
                name: selectedStudent.name,
                email: selectedStudent.email,
                password: "",
            });
            if (selectedStudent.class_course_data) {
                getStudentRequestedClassCourseData();
            }
        } else {
            setFormData({
                id: 0,
                name: "",
                email: "",
                password: "",
            });
            setShowBillingDetails(false);
            setShowStdEnrollment(false);
        }
    }, [selectedStudent]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [id]: value,
        }));
    };

    const handleSaveDetails = async () => {
        try {
            await postLoginCredentials.callApi('student/assign_login_credentials', formData, true, false, true);
            setFormData({
                id: 0,
                name: "",
                email: "",
                password: "",
            });
            setSelectedStudent(null);
            getStudents();
        } catch (error) {
            console.error("Error assigning credentials:", error);
        }
    };

    const handleDelete = async () => {
        try {
            if (selectedStudent?.id) {
                await getStd.callApi(`student/delete/${selectedStudent.id}`, false, true);
                setSelectedStudent(null);
                getStudents();
            }
        } catch (error) {
            console.error("Error deleting student:", error);
        }
    };

    const getStudentRequestedClassCourseData = async () => {
        if (selectedStudent?.class_course_data) {
            try {
                const jsonObj = JSON.parse(selectedStudent.class_course_data);
                await getClassCourseData.callApi('student/get/requested-class-course', jsonObj, true, false, false);
            } catch (error) {
                console.error("Error fetching class course data:", error);
            }
        }
    };

    const getBillingDetails = async () => {
        if (selectedStudent?.id) {
            await getBilling.callApi(`student/get/billing-details/${selectedStudent.id}`, true, false);
            setShowBillingDetails(true);
        }
    };

    const getAllocatedClass = async () => {
        if (selectedStudent?.id) {
            const response = await getAllocatedCourseClass.callApi(`student/get/allocated-class-course/${selectedStudent.id}`, true, false);
            console.log("response", response)
            setShowStdEnrollment(!showStdEnrollment);
        }
    };

    return (
        <div className="p-6">
            {getStd.loading ? (
                <SpinnerLoader color="black" />
            ) : (
                !selectedStudent && !showBillingDetails && (
                    <Card className="shadow-none">
                        <CardHeader>
                            <CardTitle className="text-xl underline">
                                Registered Students
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Name</TableHead>
                                        <TableHead>Email</TableHead>
                                        <TableHead>Contact</TableHead>
                                        <TableHead>DOB</TableHead>
                                        <TableHead>Language</TableHead>
                                        <TableHead>Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {getStd.response?.students?.map((student: Student) => (
                                        <TableRow key={student.id}>
                                            <TableCell>{student.name}</TableCell>
                                            <TableCell>{student.email}</TableCell>
                                            <TableCell>{student.contact_number}</TableCell>
                                            <TableCell>{student.date_of_birth}</TableCell>
                                            <TableCell>{student.preferred_language}</TableCell>
                                            <TableCell>
                                                <Button
                                                    size="sm"
                                                    onClick={() => {
                                                        setSelectedStudent(student);
                                                    }}
                                                >
                                                    See more
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                )
            )}

            {selectedStudent && !showBillingDetails && (
                <div>
                    <Card className="shadow-none">
                        <CardHeader>
                            <CardTitle className="text-lg underline">Student Details</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-wrap w-full space-y-4 lg:space-y-0 lg:flex-row">
                                <div className="w-full lg:w-1/4 space-y-2">
                                    <p className="underline"><strong>Contact Info</strong></p>
                                    <p><strong>Name:</strong> {selectedStudent.name}</p>
                                    <p><strong>Email:</strong> {selectedStudent.email}</p>
                                    <p><strong>Contact:</strong> {selectedStudent.contact_number}</p>
                                    <p><strong>Alternate Contact:</strong> {selectedStudent.alternate_contact_number}</p>
                                </div>
                                <div className="w-full lg:w-1/4 space-y-2">
                                    <p className="underline"><strong>Personal Details</strong></p>
                                    <p><strong>Date of Birth:</strong> {selectedStudent.date_of_birth}</p>
                                    <p><strong>Preferred Language:</strong> {selectedStudent.preferred_language}</p>
                                    <p><strong>Guardian:</strong> {selectedStudent.guardian_name}</p>
                                    <p><strong>Signature:</strong> {selectedStudent.signature}</p>
                                    <p><strong>Registered On:</strong> {selectedStudent.registration_date}</p>
                                </div>
                                <div className="w-full lg:w-1/4 space-y-2  flex flex-col items-start">
                                    <p className="underline"><strong>Requested Course and Class</strong></p>
                                    {
                                        getClassCourseData.response?.data?.map((items: any) => (
                                            <div className="bg-gray-200 p-2 rounded-lg" key={items.course?.id}>
                                                <p><strong>Course: </strong> {items.course?.name}</p>
                                                <p><strong>Class: </strong> {items.class?.title}</p>
                                                <p><strong>Class Time: </strong> {items.classTime?.preferred_time_from} - {items.classTime?.preferred_time_to}</p>
                                            </div>
                                        ))
                                    }
                                </div>
                                <div className="w-full lg:w-1/4 space-y-2 flex flex-col items-start">
                                    <p className="underline"><strong>Action</strong></p>
                                    <div className="flex flex-col flex-wrap gap-3">
                                        <div className="flex gap-2">
                                            <Button onClick={getBillingDetails}>Billing Details</Button>
                                            <Button onClick={getAllocatedClass}>Allocated Class & Course</Button>
                                        </div>
                                        <div className="flex gap-2">
                                            <Button variant="outline" onClick={() => setSelectedStudent(null)}>
                                                Close
                                            </Button>
                                            <Button variant="destructive" onClick={handleDelete}>
                                                Delete
                                            </Button>
                                            <Button variant="secondary">
                                                Edit
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    {selectedStudent?.status === 'pending' && !showStdEnrollment && (
                        <Card className="shadow-none mt-6">
                            <CardHeader>
                                <CardTitle className="text-xl font-bold underline">Assign Login Credentials</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div>
                                        <Label className="block text-sm font-medium">Name</Label>
                                        <Input
                                            id="name"
                                            type="text"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            className="w-full mt-2"
                                        />
                                    </div>
                                    <div>
                                        <Label className="block text-sm font-medium">Email</Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            className="w-full mt-2"
                                        />
                                    </div>
                                    <div>
                                        <Label className="block text-sm font-medium">Password</Label>
                                        <Input
                                            id="password"
                                            type="password"
                                            value={formData.password}
                                            onChange={handleInputChange}
                                            className="w-full mt-2"
                                        />
                                    </div>
                                    <div className="mt-4">
                                        <Button onClick={handleSaveDetails}>Assign</Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {showStdEnrollment && (
                        <Card className="shadow-none mt-6">
                            <CardHeader>
                                <CardTitle className="text-xl underline">
                                    Student Enrollment
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Class</TableHead>
                                            <TableHead>Course</TableHead>
                                            <TableHead>Class Time</TableHead>
                                            <TableHead>Total Seats</TableHead>
                                            <TableHead>Occupied Seats</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {getAllocatedCourseClass?.response?.map((items: any) => (
                                            <TableRow key={items.id}>
                                                <TableCell>{items.class?.title}</TableCell>
                                                <TableCell>{items.course?.name}</TableCell>
                                                <TableCell>
                                                    {items.class.class_timings?.[0]?.preferred_time_from} - {items.class.class_timings?.[0]?.preferred_time_to}
                                                </TableCell>
                                                <TableCell>
                                                    {items.class.total_seats || 0}
                                                </TableCell>
                                                <TableCell>
                                                    {items.class.filled_seats || 0}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    )}

                </div>
            )}
            {showBillingDetails && getBilling.response?.billingDetails && getBilling.response?.billingDetails?.length > 0 && (
                <div>
                    <div className="underline text-xl font-bold mb-5">
                        Billing details
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-5">
                        {getBilling.response?.billingDetails.map((billing: BillingDetail, index: number) => (
                            <Card key={index} className="shadow-none">
                                <CardContent>
                                    <div className="space-y-2">
                                        <div className="w-full flex items-center justify-center">
                                            <img src={billing.receipt} className="border p-2 rounded-xl" alt="Receipt" />
                                        </div>
                                        <p className="mt-5"><strong>Payment Method:</strong> {billing.paymentMethod}</p>
                                        <p><strong>Payment Status:</strong> {billing.paymentStatus}</p>
                                        <p><strong>Course:</strong> {billing.course?.name}</p>
                                        <p><strong>Duration:</strong> {billing.course?.course_duration}</p>
                                    </div>
                                    <Button className="mt-4 w-full" onClick={() => {
                                        setShowBillingDetails(false);
                                    }}>
                                        Close
                                    </Button>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Students;