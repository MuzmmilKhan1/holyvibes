import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import useGetAndDelete from "@/hooks/useGetAndDelete";
import usePostAndPut from "@/hooks/usePostAndPut";
import axios from "axios";
import { useEffect, useState } from "react";
import SpinnerLoader from "@/components/SpinLoader";
import TeacherClassTimings from "@/components/TeacherClassTimings";
import TeacherTable from "@/components/TeacherTable";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

const Teacher = () => {
    const getTeacher = useGetAndDelete(axios.get);
    const postTeacherData = usePostAndPut(axios.post);
    const getTeacherClassTime = useGetAndDelete(axios.get);
    const getCourses = useGetAndDelete(axios.get);
    const postCourse = usePostAndPut(axios.post);
    const getTeacCourse = useGetAndDelete(axios.get);


    const [showTeacherDetails, setShowTeacherDetails] = useState(false);
    const [selectedTeacher, setSelectedTeacher] = useState<any>(null);
    const [teacherName, setTeacherName] = useState<string>("");
    const [teacherEmail, setTeacherEmail] = useState<string>("");
    const [teacherPassword, setTeacherPassword] = useState<string>("");
    const [teacherID, setTeacherID] = useState<string>("");
    const [showEditScreen, setShowEditScreen] = useState<boolean>(false);
    const [showClassManagement, setShowClassManagement] = useState<boolean>(false);
    const [showAssignCourseDialog, setShowAssignCourseDialog] = useState<boolean>(false);
    const [assignCourse, setAssignCourse] = useState({
        courseId: "",
    });



    const getRequestedTeacher = async () => {
        const response = await getTeacher.callApi("teacher/get", false, false);
        console.log(response.teachers);
    };

    const fetchCourses = async () => {
        try {
            await getCourses.callApi("course/get", false, false);
        } catch (error) {
            console.error("Error fetching courses:", error);
        }
    };

    const handleTeacherDetails = (teacher: any) => {
        setTeacherID(teacher.teach_id);
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
                isEdit: showEditScreen,
            },
            true,
            false,
            true
        );
        if (response.status === 200) {
            setShowTeacherDetails(!showTeacherDetails);
            setShowEditScreen(!showEditScreen)
            getRequestedTeacher();
        }
    };

    const deleteUser = async () => {
        const response = await postTeacherData.callApi(
            "teacher/delete",
            { teacherID: selectedTeacher.id },
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
            { teacherID: id, status: status },
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
        await getTeacherClassTime.callApi(
            `class-time/get_class_time/${selectedTeacher.id}`,
            true,
            false
        );
    };

    const getTeacherAssignedCourses = async () => {
        const response = await getTeacCourse.callApi(`course/get-teacher-assiged-course/${selectedTeacher.id}`, true, false)
        console.log(response)
    }

    const handleAssignCourse = async () => {
        const payload = {
            teacherID: selectedTeacher.id,
            courseID: assignCourse.courseId
        }
        const response = await postCourse.callApi('course/assign-course', payload, true, false, true)
        console.log(response)
    }


    useEffect(() => {
        fetchCourses();
        getRequestedTeacher();
    }, []);

    return (
        <div className="p-6">
            {!showClassManagement && (
                <div>
                    {getTeacher.loading ? (
                        <SpinnerLoader color="black" />
                    ) : !showTeacherDetails ? (
                        <TeacherTable
                            teachers={getTeacher?.response?.teachers}
                            handleTeacherDetails={handleTeacherDetails}
                        />
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
                                            <h4 className="text-lg font-bold underline">Basic Information</h4>
                                            <p className="text-gray-800"><strong>Name:</strong> {selectedTeacher.name}</p>
                                            <p className="text-gray-800"><strong>Email:</strong> {selectedTeacher.email}</p>
                                            <p className="text-gray-800"><strong>Application Date:</strong> {selectedTeacher.application_date}</p>
                                            <p className="text-gray-800"><strong>Contact Number:</strong> {selectedTeacher.contact_number}</p>
                                            <p className="text-gray-800"><strong>Current Address:</strong> {selectedTeacher.current_address}</p>
                                            <p className="text-gray-800"><strong>Date of Birth:</strong> {selectedTeacher.date_of_birth}</p>
                                        </div>
                                        <div className="w-full lg:w-1/3">
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
                                            <h4 className="text-lg font-bold underline mt-3">Action buttons</h4>
                                            <div className="flex flex-col gap-2">
                                                <div className="flex gap-2 flex-wrap">
                                                <Button variant="secondary" onClick={()=>setShowTeacherDetails(!showTeacherDetails)}>Close</Button>
                                                    <Button variant="destructive" onClick={deleteUser}>Delete</Button>
                                                    <Button onClick={() => {
                                                        handleTeacherClassTimeManagement();
                                                        setShowClassManagement(!showClassManagement);
                                                    }}>
                                                        Class timings
                                                    </Button>
                                                    <Dialog open={showAssignCourseDialog} onOpenChange={setShowAssignCourseDialog}>
                                                        <DialogTrigger asChild>
                                                            <Button
                                                                onClick={() => getTeacherAssignedCourses()}
                                                                variant="outline">Assign course</Button>
                                                        </DialogTrigger>
                                                        <DialogContent className="sm:max-w-[600px]">
                                                            <DialogHeader>
                                                                <DialogTitle>Assign Course to Teacher</DialogTitle>
                                                                <DialogDescription>
                                                                    Select a course and set timings for {selectedTeacher.name}
                                                                </DialogDescription>
                                                            </DialogHeader>
                                                            <div className="grid gap-4 py-4">
                                                                <div className="grid grid-cols-3 gap-4">
                                                                    <div className="space-y-2">
                                                                        <Label htmlFor="course">Course</Label>
                                                                        <Select
                                                                            value={assignCourse.courseId}
                                                                            onValueChange={(value) => setAssignCourse(prev => ({ ...prev, courseId: value }))}
                                                                        >
                                                                            <SelectTrigger id="course">
                                                                                <SelectValue placeholder="Choose a course" />
                                                                            </SelectTrigger>
                                                                            <SelectContent>
                                                                                {getCourses?.response?.course?.map((course: { name: string, id: number }) => (
                                                                                    <SelectItem key={course.id} value={course.id.toString()}>
                                                                                        {course.name}
                                                                                    </SelectItem>
                                                                                ))}
                                                                            </SelectContent>
                                                                        </Select>
                                                                    </div>
                                                                </div>
                                                                <div className="mt-4">
                                                                    <Table>
                                                                        <TableHeader>
                                                                            <TableRow>
                                                                                <TableHead>Id</TableHead>
                                                                                <TableHead>Course Name</TableHead>
                                                                                <TableHead>Action</TableHead>
                                                                            </TableRow>
                                                                        </TableHeader>
                                                                        <TableBody>
                                                                            {getTeacCourse.response?.courses.map((course: { course: { id: number, name: string }, id: number }, index: number) => (
                                                                                <TableRow key={course.id}>
                                                                                    <TableCell>{index}</TableCell>
                                                                                    <TableCell>{course.course.name}</TableCell>
                                                                                    <TableCell>
                                                                                        <Button variant='destructive' size='sm' className="ml-2" >
                                                                                            Delete
                                                                                        </Button>
                                                                                    </TableCell>
                                                                                </TableRow>
                                                                            ))}
                                                                        </TableBody>
                                                                    </Table>
                                                                </div>
                                                            </div>
                                                            <DialogFooter>
                                                                <Button variant="outline" onClick={() => setShowAssignCourseDialog(false)}>
                                                                    Cancel
                                                                </Button>
                                                                <Button onClick={handleAssignCourse}>Assign</Button>
                                                            </DialogFooter>
                                                        </DialogContent>
                                                    </Dialog>
                                                </div>
                                                {selectedTeacher.status !== "pending" && (
                                                    <div className="flex gap-2">
                                                        <Button
                                                            onClick={() => blockUser(selectedTeacher.status, selectedTeacher.id)}
                                                            variant="destructive"
                                                        >
                                                            {selectedTeacher.status === "blocked" ? "Unblock" : "Block"}
                                                        </Button>
                                                        <Button
                                                            onClick={() => setShowEditScreen(!showEditScreen)}
                                                            variant="outline"
                                                        >
                                                            Edit
                                                        </Button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                            {(selectedTeacher.status === "pending" || showEditScreen) && (
                                <Card className="shadow-none mt-6">
                                    <CardHeader>
                                        <CardTitle className="text-xl font-bold underline">
                                            {showEditScreen ? "Update Login Credentials & teacher ID" : "Assign Login Credentials & teacher ID"}
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-4">
                                            <div>
                                                <Label className="block text-sm font-medium">Teacher ID</Label>
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
                                                <Label className="block text-sm font-medium">Password</Label>
                                                <Input
                                                    id="teacherPassword"
                                                    type="password"
                                                    value={teacherPassword}
                                                    onChange={(e) => setTeacherPassword(e.target.value)}
                                                    className="w-full mt-2"
                                                />
                                            </div>
                                            <div className="mt-4">
                                                <Button onClick={handleSaveDetails}>
                                                    {showEditScreen ? "Update" : "Assign"}
                                                </Button>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            )}
                        </div>
                    )}
                </div>
            )}
            {showClassManagement && (
                <div>
                    {JSON.parse(selectedTeacher?.class_timings) > 0 ? (
                        <SpinnerLoader color="black" />
                    ) : (
                        <TeacherClassTimings
                            classTimings={JSON.parse(selectedTeacher?.class_timings)}
                            setShowClassManagement={setShowClassManagement}
                        />
                    )}
                </div>
            )}
        </div>
    );
};

export default Teacher;