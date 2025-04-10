import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import useGetAndDelete from "@/hooks/useGetAndDelete";
import axios from "axios";
import { useEffect, useState } from "react";
import SpinnerLoader from "@/components/SpinLoader";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Label } from "@radix-ui/react-dropdown-menu";
import { Input } from "@/components/ui/input";
import usePostAndPut from "@/hooks/usePostAndPut";

const Teacher = () => {
    const getTeacher = useGetAndDelete(axios.get);
    const postTeacherData = usePostAndPut(axios.post);
    const [showTeacherDetails, setShowTeacherDetails] = useState(false);
    const [selectedTeacher, setSelectedTeacher] = useState<any>(null);
    const [teacherName, setTeacherName] = useState<string>("");
    const [teacherEmail, setTeacherEmail] = useState<string>("");
    const [teacherPassword, setTeacherPassword] = useState<string>("");

    const getRequestedTeacher = async () => {
        const response = await getTeacher.callApi("teacher/get", false, false);
        console.log(response.data)
    };

    useEffect(() => {
        getRequestedTeacher();
    }, []);

    const handleTeacherDetails = (teacher: any) => {
        setSelectedTeacher(teacher);
        setTeacherName(teacher.name);
        setTeacherEmail(teacher.email);
        setShowTeacherDetails(!showTeacherDetails);
    };

    const handleSaveDetails = async () => {
        const response = await postTeacherData.callApi('teacher/assign_login_credentials', {
            name: teacherName,
            email: teacherEmail,
            password: teacherPassword,
            teacherID: selectedTeacher.id,
        },
            true,
            false,
            true
        )
        if (response.status == 200) {
            setShowTeacherDetails(!showTeacherDetails)
            getRequestedTeacher();
        }
    };

    const deleteUser = async () => {
        const response = await postTeacherData.callApi('teacher/delete', {
            teacherID: selectedTeacher.id
        },
            true,
            false,
            true
        )
        if (response.status == 200) {
            setShowTeacherDetails(!showTeacherDetails)
            getRequestedTeacher();
        }
    }

    const blockUser = async () => {
        const response = await postTeacherData.callApi('teacher/block', {
            teacherID: selectedTeacher.id
        },
            true,
            false,
            true
        )
        if (response.status == 200) {
            setShowTeacherDetails(!showTeacherDetails)
            getRequestedTeacher();
        }
    }

    return (
        <div className="p-6">
            {getTeacher.loading ? (
                <SpinnerLoader color="black" />
            ) : !showTeacherDetails ? (
                <Card className="shadow-none">
                    <CardHeader>
                        <CardTitle>Requested Teacher</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableCaption>List of all teachers</TableCaption>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Application Date</TableHead>
                                    <TableHead>Contact Number</TableHead>
                                    <TableHead>Current Address</TableHead>
                                    <TableHead>Date of Birth</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead>Experience in Quran</TableHead>
                                    <TableHead>Action</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {getTeacher?.response?.teachers?.map((teacher: any) => (
                                    <TableRow key={teacher.id}>
                                        <TableCell>{teacher.name}</TableCell>
                                        <TableCell>{teacher.application_date}</TableCell>
                                        <TableCell>{teacher.contact_number}</TableCell>
                                        <TableCell>{teacher.current_address}</TableCell>
                                        <TableCell>{teacher.date_of_birth}</TableCell>
                                        <TableCell>{teacher.email}</TableCell>
                                        <TableCell>{teacher.experience_Quran}</TableCell>
                                        <TableCell>
                                            <Button onClick={() => handleTeacherDetails(teacher)}>
                                                See more
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            ) : (
                <div className="w-full">
                    <Button
                        onClick={() => setShowTeacherDetails(!showTeacherDetails)}
                        className="bg-transparent text-black hover:bg-transparent"
                    >
                        <ArrowLeft size={40} />
                    </Button>
                    <Card className="shadow-none w-full">
                        <CardHeader>
                            <CardTitle className="text-xl font-bold underline -mb-3">Teacher Details</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-wrap w-full space-y-4 lg:space-y-0 lg:flex-row ">
                                <div className="w-full lg:w-1/3 ">
                                    <h4 className="text-lg font-bold underline">Basic Information</h4>
                                    <p className="text-gray-800"><strong>Name:</strong> {selectedTeacher.name}</p>
                                    <p className="text-gray-800"><strong>Email:</strong> {selectedTeacher.email}</p>
                                    <p className="text-gray-800"><strong>Application Date:</strong> {selectedTeacher.application_date}</p>
                                    <p className="text-gray-800"><strong>Contact Number:</strong> {selectedTeacher.contact_number}</p>
                                    <p className="text-gray-800"><strong>Current Address:</strong> {selectedTeacher.current_address}</p>
                                    <p className="text-gray-800"><strong>Date of Birth:</strong> {selectedTeacher.date_of_birth}</p>
                                </div>

                                <div className="w-full lg:w-1/3 ">
                                    <h4 className="text-lg font-bold underline">Experience & Qualifications</h4>
                                    <p className="text-gray-800"><strong>Experience in Quran:</strong> {selectedTeacher.experience_Quran}</p>
                                    <p className="text-gray-800"><strong>Gender:</strong> {selectedTeacher.gender}</p>
                                    <p className="text-gray-800"><strong>Institution:</strong> {selectedTeacher.institution}</p>
                                    <p className="text-gray-800"><strong>Languages Spoken:</strong> {selectedTeacher.languages_spoken}</p>
                                    <p className="text-gray-800"><strong>Nationality:</strong> {selectedTeacher.nationality}</p>
                                    <p className="text-gray-800"><strong>Other Experience:</strong> {selectedTeacher.other_experience}</p>
                                    <p className="text-gray-800"><strong>Qualification:</strong> {selectedTeacher.qualification}</p>
                                    <p className="text-gray-800"><strong>Status:</strong> {selectedTeacher.status}</p>
                                </div>

                                <div>
                                    <h4 className="text-lg font-bold underline flex items-start">Class Timings</h4>
                                    <div className="space-y-2 w-full flex items-start flex-col">
                                        {selectedTeacher.class_timings?.map((ct: any, index: number) => (
                                            <div key={index} className="w-auto p-2 bg-gray-200 rounded-md">
                                                <span className="block ">
                                                   <strong>Course:</strong>  {ct.course?.name ?? "No Course Assigned"}
                                                </span>
                                                 <span>
                                                 <strong>Timings: </strong> 
                                                    {ct.preferred_time_from} - {ct.preferred_time_to}</span>
                                            </div>
                                        ))}
                                    </div>

                                    <div>
                                        <h4 className="text-lg font-bold underline mt-3 flex items-start">Action buttons</h4>
                                        <div className="flex flex-row gap-2" >
                                            <div className="flex gap-2" >
                                                <Button onClick={deleteUser} >
                                                    Delete
                                                </Button>
                                                <Button variant="outline" >
                                                    Edit
                                                </Button>
                                            </div>
                                            <div className="flex gap-2" >
                                                <Button
                                                    onClick={blockUser}
                                                    variant="destructive" >
                                                    Block
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>


                    {
                        selectedTeacher.status === "pending" &&
                        (
                            <Card className="shadow-none mt-6">
                                <CardHeader>
                                    <CardTitle className="text-xl font-bold underline">Assign Login Credentials</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        <div>
                                            <Label className="block text-sm font-medium">
                                                Name
                                            </Label>
                                            <Input
                                                id="teacherName"
                                                type="text"
                                                value={teacherName}
                                                onChange={(e) => setTeacherName(e.target.value)}
                                                className="w-full mt-2"
                                            />
                                        </div>
                                        <div>
                                            <Label className="block text-sm font-medium">
                                                Email
                                            </Label>
                                            <Input
                                                id="teacherEmail"
                                                type="email"
                                                value={teacherEmail}
                                                onChange={(e) => setTeacherEmail(e.target.value)}
                                                className="w-full mt-2"
                                            />
                                        </div>
                                        <div>
                                            <Label className="block text-sm font-medium">
                                                Password
                                            </Label>
                                            <Input
                                                id="teacherPassword"
                                                type="password"
                                                value={teacherPassword}
                                                onChange={(e) => setTeacherPassword(e.target.value)}
                                                className="w-full mt-2"
                                            />
                                        </div>
                                        <div className="mt-4">
                                            <Button onClick={handleSaveDetails} >
                                                Assign
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                        )

                    }

                </div>
            )}
        </div>
    );
};

export default Teacher;
