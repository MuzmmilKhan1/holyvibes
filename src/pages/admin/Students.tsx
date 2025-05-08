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
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

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
    const [activeTab, setActiveTab] = useState("student-details");
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

            setFormData({
                id: selectedStudent?.id,
                studentID: selectedStudent.std_id ? selectedStudent.std_id : 0,
            });
            setActiveTab("student-details");
        } else {
            setFormData({
                id: 0,
                studentID: 0,
            });
            setActiveTab("student-details");
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
        setActiveTab("student-details");
    };

    const handleDelete = async () => {
        try {
            if (selectedStudent?.id) {
                await deleteStd.callApi(`student/delete/${selectedStudent?.id}`, false, true);
                setSelectedStudent(null);
                getStudents();
            }
        } catch (error) {
            throw new Error("Error deleting student");
        }
    };

    const getBillingDetails = async () => {
        if (selectedStudent?.id) {
            const response = await getBilling.callApi(`student/get/billing-details/${selectedStudent?.id}`, true, false);

            return response?.data?.length > 0;
        }
        return false;
    };

    const handleTabChange = async (value: string) => {
        setActiveTab(value);
        if (value === "billing") {
            const hasBillingData = await getBillingDetails();
            if (!hasBillingData) {
                setActiveTab("student-details");
            }
        } else if (value === "class-timings" && !JSON.parse(selectedStudent?.class_course_data)?.length) {
            setActiveTab("student-details");
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
                            <CardTitle className="text-xl font-bold underline">
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
                    <div className="p-3 border   rounded-xl mb-4">
                        <Tabs value={activeTab} onValueChange={handleTabChange} className="overflow-auto">
                        <TabsList className="lg:grid lg:w-full grid-cols-4 ">
                                <TabsTrigger value="student-details">Student Details</TabsTrigger>
                                <TabsTrigger value="class-timings">Class Timings</TabsTrigger>
                                <TabsTrigger value="billing">Billing</TabsTrigger>
                                <TabsTrigger value="assign-id">Assign ID</TabsTrigger>
                            </TabsList>
                        </Tabs>
                    </div>

                    <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
                        <TabsContent value="student-details">
                            <Card className="shadow-none ">
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
                        </TabsContent>

                        <TabsContent value="class-timings">
                            {JSON.parse(selectedStudent?.class_course_data)?.length > 0 ? (
                                <Card className="shadow-none ">
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
                            ) : (
                                <div className="mt-6">
                                    No classtime and course details found.
                                </div>
                            )}
                        </TabsContent>

                        <TabsContent value="billing">
                            {getBilling.response?.data && getBilling.response?.data?.length > 0 ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-5 ">
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
                                                {/* <Button className="mt-4 w-full" onClick={() => setActiveTab("student-details")}>
                                                    Close
                                                </Button> */}
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            ) : (
                                <div className="">
                                    No billing details found.
                                </div>
                            )}
                        </TabsContent>

                        <TabsContent value="assign-id">
                            <Card className="shadow-none ">
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
                                        <div className="flex gap-4 mt-4">
                                            {/* <Button variant="outline" onClick={() => setActiveTab("student-details")}>
                                                Cancel
                                            </Button> */}
                                            <Button onClick={handleSaveDetails}>
                                                Submit
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </div>
            )}
        </div>
    );
};

export default Students;