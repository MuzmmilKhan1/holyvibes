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
}

interface FormData {
    name: string;
    email: string;
    password: string;
}

const Students = () => {
    const getStd = useGetAndDelete(axios.get);
    const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
    const [formData, setFormData] = useState<FormData>({
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
                name: selectedStudent.name,
                email: selectedStudent.email,
                password: "",
            });
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
            console.log(formData)
        } catch (error) {
            console.error("Error assigning credentials:", error);
        }
    };

    const handleDelete = async () => {
        try {
            await getStd.callApi(`student/delete/${selectedStudent?.id}`, false, true);
            setSelectedStudent(null);
            getStudents();
        } catch (error) {
            console.error("Error deleting student:", error);
        }
    };

    return (
        <div className="p-6">
            {getStd.loading ? (
                <SpinnerLoader color="black" />
            ) : (
                !selectedStudent && (
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
                                                <Button size="sm" onClick={() => setSelectedStudent(student)}>
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
                    <Card className="shadow-none">
                        <CardHeader>
                            <CardTitle className="text-lg underline">Student Details</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-wrap w-full space-y-4 lg:space-y-0 lg:flex-row">
                                <div className="w-full lg:w-1/3 space-y-2">
                                    <p><strong>Name:</strong> {selectedStudent.name}</p>
                                    <p><strong>Email:</strong> {selectedStudent.email}</p>
                                    <p><strong>Contact:</strong> {selectedStudent.contact_number}</p>
                                    <p><strong>Alternate Contact:</strong> {selectedStudent.alternate_contact_number}</p>
                                </div>
                                <div className="w-full lg:w-1/3 space-y-2">
                                    <p><strong>Date of Birth:</strong> {selectedStudent.date_of_birth}</p>
                                    <p><strong>Preferred Language:</strong> {selectedStudent.preferred_language}</p>
                                    <p><strong>Guardian:</strong> {selectedStudent.guardian_name}</p>
                                    <p><strong>Signature:</strong> {selectedStudent.signature}</p>
                                    <p><strong>Registered On:</strong> {selectedStudent.registration_date}</p>
                                </div>
                                <div className="w-full lg:w-1/3 space-y-2 flex flex-col items-start">
                                    <p className="underline"><strong>Action</strong></p>
                                    <div className="flex flex-col flex-wrap gap-3">
                                        <div className="flex gap-2">
                                            <Button>Billing Details</Button>
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
                </div>
            )}
        </div>
    );
};

export default Students;