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
import { Button } from "@/components/ui/button";
import { Label } from "@radix-ui/react-dropdown-menu";
import { Input } from "@/components/ui/input";
import useGetAndDelete from "@/hooks/useGetAndDelete";
import usePostAndPut from "@/hooks/usePostAndPut";
import axios from "axios";
import { useEffect, useState } from "react";
import SpinnerLoader from "@/components/SpinLoader";

const Teacher = () => {
    const getTeacher = useGetAndDelete(axios.get);
    const postTeacherData = usePostAndPut(axios.post);
    const getTeacherClassTime = useGetAndDelete(axios.get);

    const [showTeacherDetails, setShowTeacherDetails] = useState(false);
    const [selectedTeacher, setSelectedTeacher] = useState<any>(null);
    const [teacherName, setTeacherName] = useState<string>("");
    const [teacherEmail, setTeacherEmail] = useState<string>("");
    const [teacherPassword, setTeacherPassword] = useState<string>("");
    const [teacherID, setTeacherID] = useState<string>("");

    const [showClassManagement, setShowClassManagement] = useState<boolean>(false);

    const getRequestedTeacher = async () => {
        const response = await getTeacher.callApi("teacher/get", false, false);
        console.log(response.teachers);
    };

    // const fetchCourses = async () => {
    //     try {
    //         const response = await getCourses.callApi("course/get", false, false);
    //         setCourses(response.course);
    //     } catch (error) {
    //         console.error("Error fetching courses:", error);
    //     }
    // };

    useEffect(() => {
        getRequestedTeacher();
    }, []);

    const handleTeacherDetails = (teacher: any) => {
        console.log(JSON.parse(teacher.class_timings))
        setSelectedTeacher(teacher);
        setTeacherName(teacher.name);
        setTeacherEmail(teacher.email);
        setShowTeacherDetails(!showTeacherDetails);
    };

    const handleSaveDetails = async () => {
        const response = await postTeacherData.callApi(
            "teacher/assign_login_credentials",
            {
                id: teacherID,
                name: teacherName,
                email: teacherEmail,
                password: teacherPassword,
                teacherID: selectedTeacher.id,
                courseIds: JSON.parse(selectedTeacher.class_timings),
            },
            true,
            false,
            true
        );
        if (response.status === 200) {
            setShowTeacherDetails(!showTeacherDetails);
            getRequestedTeacher();
        }
    };

    const deleteUser = async () => {
        const response = await postTeacherData.callApi(
            "teacher/delete",
            {
                teacherID: selectedTeacher.id,
            },
            true,
            false,
            true
        );
        if (response.status === 200) {
            setShowTeacherDetails(!showTeacherDetails);
            getRequestedTeacher();
        }
    };

    const blockUser = async (status: string, id: string) => {
        const response = await postTeacherData.callApi(
            "teacher/block",
            {
                teacherID: id,
                status: status,
            },
            true,
            false,
            true
        );
        if (response.status === 200) {
            setShowTeacherDetails(!showTeacherDetails);
            getRequestedTeacher();
        }
    };

    const handleTeacherClassTimeManagement = async () => {
        //delete this
        await getTeacherClassTime.callApi(
            `class-time/get_class_time/${selectedTeacher.id}`,
            true,
            false
        );
    };


    return (
        <div className="p-6">
            {!showClassManagement && (
                <div>
                    {getTeacher.loading ? (
                        <SpinnerLoader color="black" />
                    ) : !showTeacherDetails ? (
                        <Card className="shadow-none">
                            <CardHeader>
                                <CardTitle className="text-xl font-bold underline " >Teachers</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Table>
                                    <TableCaption>List of all teachers</TableCaption>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Teacher ID</TableHead>
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
                                                <TableCell>{teacher.teach_id || 'N/A'}</TableCell>
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
                            <Card className="shadow-none w-full">
                                <CardHeader>
                                    <CardTitle className="text-xl font-bold underline -mb-3">
                                        Teacher Details
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex flex-wrap w-full space-y-4 lg:space-y-0 lg:flex-row">
                                        <div className="w-full lg:w-1/3">
                                            <h4 className="text-lg font-bold underline">
                                                Basic Information
                                            </h4>
                                            <p className="text-gray-800">
                                                <strong>Name:</strong> {selectedTeacher.name}
                                            </p>
                                            <p className="text-gray-800">
                                                <strong>Email:</strong> {selectedTeacher.email}
                                            </p>
                                            <p className="text-gray-800">
                                                <strong>Application Date:</strong>{" "}
                                                {selectedTeacher.application_date}
                                            </p>
                                            <p className="text-gray-800">
                                                <strong>Contact Number:</strong>{" "}
                                                {selectedTeacher.contact_number}
                                            </p>
                                            <p className="text-gray-800">
                                                <strong>Current Address:</strong>{" "}
                                                {selectedTeacher.current_address}
                                            </p>
                                            <p className="text-gray-800">
                                                <strong>Date of Birth:</strong>{" "}
                                                {selectedTeacher.date_of_birth}
                                            </p>
                                        </div>

                                        <div className="w-full lg:w-1/3">
                                            <h4 className="text-lg font-bold underline">
                                                Experience & Qualifications
                                            </h4>
                                            <p className="text-gray-800">
                                                <strong>Experience in Quran:</strong>{" "}
                                                {selectedTeacher.experience_Quran}
                                            </p>
                                            <p className="text-gray-800">
                                                <strong>Gender:</strong> {selectedTeacher.gender}
                                            </p>
                                            <p className="text-gray-800">
                                                <strong>Institution:</strong> {selectedTeacher.institution}
                                            </p>
                                            <p className="text-gray-800">
                                                <strong>Languages Spoken:</strong>{" "}
                                                {selectedTeacher.languages_spoken}
                                            </p>
                                            <p className="text-gray-800">
                                                <strong>Nationality:</strong> {selectedTeacher.nationality}
                                            </p>
                                            <p className="text-gray-800">
                                                <strong>Other Experience:</strong>{" "}
                                                {selectedTeacher.other_experience}
                                            </p>
                                            <p className="text-gray-800">
                                                <strong>Qualification:</strong>{" "}
                                                {selectedTeacher.qualification}
                                            </p>
                                            <p className="text-gray-800">
                                                <strong>Status:</strong> {selectedTeacher.status}
                                            </p>
                                        </div>

                                        <div>
                                            <div>
                                                <h4 className="text-lg font-bold underline mt-3 flex items-start">
                                                    Action buttons
                                                </h4>
                                                <div className="flex flex-col flex-wrap gap-2">
                                                    <div className="flex gap-2">
                                                        <Button variant="destructive" onClick={deleteUser}>
                                                            Delete
                                                        </Button>
                                                        <Button onClick={() => {
                                                            handleTeacherClassTimeManagement();
                                                            setShowClassManagement(!showClassManagement);
                                                        }}>
                                                            Class timings
                                                        </Button>
                                                        {selectedTeacher.status !== "pending" && (
                                                            <Button variant="outline">Edit</Button>
                                                        )}
                                                        <Button
                                                            onClick={() =>
                                                                setShowTeacherDetails(!showTeacherDetails)
                                                            }
                                                            variant="secondary"
                                                        >
                                                            Close
                                                        </Button>
                                                    </div>
                                                    {selectedTeacher.status !== "pending" && (
                                                        <div className="flex gap-2">
                                                            <Button
                                                                onClick={() =>
                                                                    blockUser(selectedTeacher.status, selectedTeacher.id)
                                                                }
                                                                variant="destructive"
                                                            >
                                                                {selectedTeacher.status === "blocked" && "Unblock"}
                                                                {selectedTeacher.status === "allowed" && "Block"}
                                                            </Button>

                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                            {selectedTeacher.status === "pending" && (
                                <Card className="shadow-none mt-6">
                                    <CardHeader>
                                        <CardTitle className="text-xl font-bold underline">
                                            Assign Login Credentials & teacher ID
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-4">
                                            <div>
                                                <Label className="block text-sm font-medium">teacher ID</Label>
                                                <Input
                                                    id="teacherId"
                                                    type="text"
                                                    value={teacherID}
                                                    onChange={(e) => setTeacherID(e.target.value)}
                                                    className="w-full mt-2"
                                                />
                                            </div>
                                            <div>
                                                <Label className="block text-sm font-medium">Name</Label>
                                                <Input
                                                    id="teacherName"
                                                    type="text"
                                                    value={teacherName}
                                                    onChange={(e) => setTeacherName(e.target.value)}
                                                    className="w-full mt-2"
                                                />
                                            </div>
                                            <div>
                                                <Label className="block text-sm font-medium">Email</Label>
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
                                                <Button onClick={handleSaveDetails}>Assign</Button>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            )}
                        </div>
                    )}
                </div>
            )
            }
            {
                showClassManagement && (
                    <div>
                        {JSON.parse(selectedTeacher?.class_timings) > 0 ? (
                            <SpinnerLoader color="black" />
                        ) : (
                            <>
                                <Card className="shadow-none">
                                    <CardHeader>
                                        <CardTitle className="text-xl font-bold underline -mb-3" >Class Time</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <Table>
                                            <TableCaption>List of all teacher's class timings</TableCaption>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead>Course</TableHead>
                                                    <TableHead>Preferred Time From</TableHead>
                                                    <TableHead>Preferred Time To</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {JSON.parse(selectedTeacher?.class_timings).map((ct: any) => (
                                                    <TableRow key={ct.id}>
                                                        <TableCell>{ct.course_name}</TableCell>
                                                        <TableCell>{ct.from}</TableCell>
                                                        <TableCell>{ct.to}</TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                        <div className="mt-4">
                                            <Button
                                                variant="secondary"
                                                onClick={() => setShowClassManagement(false)}
                                            >
                                                Close
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            </>
                        )}
                    </div>
                )
            }
        </div >
    );
};

export default Teacher;