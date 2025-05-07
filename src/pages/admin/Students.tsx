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
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Slash } from "lucide-react";

interface Student {
    std_id: number;
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
    id: number;
    studentID: number;
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
    const postLoginCredentials = usePostAndPut(axios.post);
    const deleteStd = useGetAndDelete(axios.delete);

    const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
    const [showBillingDetails, setShowBillingDetails] = useState<boolean>(false);
    const [showStdClassTimings, setShowStdClassTimings] = useState<boolean>(false);
    const [showAssignId, setShowAssignId] = useState<boolean>(false);
    const [formData, setFormData] = useState<FormData>({
        id: 0,
        studentID: 0,
    });

    const getStudents = async () => {
        await getStd.callApi("student/get", true, false);
    };

    useEffect(() => {
        getStudents();
    }, []);

    useEffect(() => {
        if (selectedStudent) {
            console.log(selectedStudent?.class_course_data);
            setFormData({
                id: selectedStudent?.id,
                studentID: selectedStudent.std_id ? selectedStudent.std_id : 0,
            });
        } else {
            setFormData({
                id: 0,
                studentID: 0,
            });
            setShowBillingDetails(false);
            setShowStdClassTimings(false);
            setShowAssignId(false);
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
        await postLoginCredentials.callApi('student/assign_login_credentials', formData, true, false, true);
        getStudents();
    };

    const handleDelete = async () => {
        try {
            if (selectedStudent?.id) {
                await deleteStd.callApi(`student/delete/${selectedStudent?.id}`, false, true);
                setSelectedStudent(null);
                getStudents();
            }
        } catch (error) {
            console.error("Error deleting student:", error);
        }
    };

    const getBillingDetails = async () => {
        if (selectedStudent?.id) {
            const response = await getBilling.callApi(`student/get/billing-details/${selectedStudent?.id}`, true, false);
            console.log(response);
            if (response?.data?.length > 0) {
                setShowBillingDetails(true);
                setShowStdClassTimings(false);
                setShowAssignId(false);
            }
        }
    };

    // Breadcrumb click handlers
    const handleStudentDetailsClick = () => {
        if (selectedStudent) {
            setShowBillingDetails(false);
            setShowStdClassTimings(false);
            setShowAssignId(false);
        }
    };

    const handleClassTimingsClick = () => {
        if (selectedStudent) {
            setShowStdClassTimings(true);
            setShowBillingDetails(false);
            setShowAssignId(false);
        }
    };

    const handleBillingClick = () => {
        if (selectedStudent) {
            getBillingDetails();
            setShowStdClassTimings(false);
            setShowAssignId(false);
        }
    };

    const handleAssignIdClick = () => {
        if (selectedStudent) {
            setShowAssignId(true);
            setShowBillingDetails(false);
            setShowStdClassTimings(false);
        }
    };

    return (
        <div className="p-5">
            {getStd.loading ? (
                <SpinnerLoader color="black" />
            ) : (
                !selectedStudent && (
                    <Card className="shadow-none">
                        <CardHeader>
                            <CardTitle className="text-xl font-bold underline ">
                                Registered Students
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Student ID</TableHead>
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
                                            <TableCell>{student.std_id || 'N/A'}</TableCell>
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

            {selectedStudent && (
                <div>
                    <div className="p-3 border w-full mb-2 rounded-xl">
                        <Breadcrumb>
                            <BreadcrumbList>
                                <BreadcrumbItem>
                                    <BreadcrumbLink onClick={handleStudentDetailsClick} className="cursor-pointer">
                                        Student Details
                                    </BreadcrumbLink>
                                </BreadcrumbItem>
                                <BreadcrumbSeparator>
                                    <Slash />
                                </BreadcrumbSeparator>
                                <BreadcrumbItem>
                                    <BreadcrumbLink onClick={handleClassTimingsClick} className="cursor-pointer">
                                        Class Timings
                                    </BreadcrumbLink>
                                </BreadcrumbItem>
                                <BreadcrumbSeparator>
                                    <Slash />
                                </BreadcrumbSeparator>
                                <BreadcrumbItem>
                                    <BreadcrumbLink onClick={handleBillingClick} className="cursor-pointer">
                                        Billing
                                    </BreadcrumbLink>
                                </BreadcrumbItem>
                                <BreadcrumbSeparator>
                                    <Slash />
                                </BreadcrumbSeparator>
                                <BreadcrumbItem>
                                    <BreadcrumbLink onClick={handleAssignIdClick} className="cursor-pointer">
                                        Assign ID
                                    </BreadcrumbLink>
                                </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>
                    </div>

                    {!showBillingDetails && !showStdClassTimings && !showAssignId && (
                        <Card className="shadow-none">
                            <CardHeader>
                                <CardTitle className="text-xl font-bold underline">Student Details</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex flex-wrap w-full space-y-4 lg:space-y-0 lg:flex-row">
                                    <div className="w-full lg:w-1/4 space-y-2">
                                        <p className="underline"><strong>Contact Info</strong></p>
                                        <p><strong>Name:</strong> {selectedStudent?.name}</p>
                                        <p><strong>Email:</strong> {selectedStudent?.email}</p>
                                        <p><strong>Contact:</strong> {selectedStudent?.contact_number}</p>
                                        <p><strong>Alternate Contact:</strong> {selectedStudent?.alternate_contact_number}</p>
                                    </div>
                                    <div className="w-full lg:w-1/4 space-y-2">
                                        <p className="underline"><strong>Personal Details</strong></p>
                                        <p><strong>Date of Birth:</strong> {selectedStudent?.date_of_birth}</p>
                                        <p><strong>Preferred Language:</strong> {selectedStudent?.preferred_language}</p>
                                        <p><strong>Guardian:</strong> {selectedStudent?.guardian_name}</p>
                                        <p><strong>Signature:</strong> {selectedStudent?.signature}</p>
                                        <p><strong>Registered On:</strong> {selectedStudent?.registration_date}</p>
                                    </div>
                                    <div className="w-full lg:w-1/4 space-y-2 flex flex-col items-start">
                                        <p className="underline"><strong>Action</strong></p>
                                        <div className="flex flex-col flex-wrap gap-3">
                                            <div className="flex gap-2">
                                                <Button variant="outline" onClick={() => setSelectedStudent(null)}>
                                                    Close
                                                </Button>
                                                <Button variant="destructive" onClick={handleDelete}>
                                                    Delete
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {showAssignId && (
                        <Card className="shadow-none mt-6">
                            <CardHeader>
                                <CardTitle className="text-xl font-bold underline">
                                    Assign and Edit ID
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div>
                                        <Label className="block text-sm font-medium">Student ID</Label>
                                        <Input
                                            id="studentID"
                                            type="text"
                                            value={formData?.studentID}
                                            onChange={handleInputChange}
                                            className="w-full mt-2"
                                        />
                                    </div>
                                    <div className="mt-4">
                                        <Button onClick={handleSaveDetails}>
                                            Submit
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {showStdClassTimings && JSON.parse(selectedStudent?.class_course_data)?.length > 0 ? (
                        <Card className="shadow-none mt-6">
                            <CardHeader>
                                <CardTitle className="text-xl font-bold underline">
                                    Class Time
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Course</TableHead>
                                            <TableHead>Preference Time From</TableHead>
                                            <TableHead>Preference Time To</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {JSON.parse(selectedStudent?.class_course_data)?.map((item: any, index: number) => (
                                            item.timings.map((time: any, idx: number) => (
                                                <TableRow key={`${index}-${idx}`}>
                                                    <TableCell>{item.course_name}</TableCell>
                                                    <TableCell>{time.from}</TableCell>
                                                    <TableCell>{time.to}</TableCell>
                                                </TableRow>
                                            ))
                                        ))}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    ) : showStdClassTimings && (
                        <div className="mt-6">
                            No classtime and course details found.
                        </div>
                    )}

                    {showBillingDetails && getBilling.response?.data && getBilling.response?.data?.length > 0 && (
                        <div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-5">
                                {getBilling.response?.data.map((billing: BillingDetail, index: number) => (
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
            )}
        </div>
    );
};

export default Students;