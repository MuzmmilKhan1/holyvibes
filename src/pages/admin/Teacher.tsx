import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import useGetAndDelete from "@/hooks/useGetAndDelete";
import usePostAndPut from "@/hooks/usePostAndPut";
import axios from "axios";
import { useEffect, useState } from "react";
import TeacherClassTimings from "@/components/TeacherClassTimings";
import TeacherTable from "@/components/TeacherTable";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import SpinnerLoader from "@/components/SpinLoader";
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

type Teacher = {
    id: number;
    teach_id?: string;
    name: string;
    application_date: string;
    contact_number: string;
    current_address: string;
    date_of_birth: string;
    email: string;
    experience_Quran: string;
};


const Teacher = () => {
    const getTeacher = useGetAndDelete(axios.get);
    const postTeacherData = usePostAndPut(axios.post);
    const getTeacherClassTime = useGetAndDelete(axios.get);
    const getCourses = useGetAndDelete(axios.get);
    const postCourse = usePostAndPut(axios.post);
    const getTeacCourse = useGetAndDelete(axios.get);
    const removeCourse = useGetAndDelete(axios.delete);
    const getFilteredTeacher = useGetAndDelete(axios.get);


    const [showTeacherDetails, setShowTeacherDetails] = useState(false);
    const [selectedTeacher, setSelectedTeacher] = useState<any>(null);
    const [teacherName, setTeacherName] = useState<string>("");
    const [teacherEmail, setTeacherEmail] = useState<string>("");
    const [teacherPassword, setTeacherPassword] = useState<string>("");
    const [teacherID, setTeacherID] = useState<string>("");
    const [activeTab, setActiveTab] = useState("teacher-details");
    const [courseID, setCourseID] = useState<Number | null>(null);
    const [studentID, setStudentID] = useState<Number | null>(null);
    const [teachers, setTeachers] = useState<Teacher[]>([]);

    
    const getStd = useGetAndDelete(axios.get);

    const [assignCourse, setAssignCourse] = useState({
        courseId: "",
    });

    const getRequestedTeacher = async () => {
        const response = await getTeacher.callApi("teacher/get", false, false);
        setTeachers(response.teachers);
    };

    const fetchCourses = async () => {
        try {
            await getCourses.callApi("course/get", false, false);
        } catch (error) {
            console.error("Error fetching courses:", error);
        }
    };

    const getStudents = async () => {
        await getStd.callApi("student/get", true, false);
    };


    const handleTeacherDetails = (teacher: any) => {
        setTeacherID(teacher.teach_id);
        setSelectedTeacher(teacher);
        setTeacherName(teacher.name);
        setTeacherEmail(teacher.email);
        setShowTeacherDetails(true);
        setActiveTab("teacher-details");
    };

    const handleSaveDetails = async (isEdit: boolean) => {
        const response = await postTeacherData.callApi(
            "teacher/assign_login_credentials",
            {
                id: teacherID,
                name: teacherName,
                email: teacherEmail,
                password: teacherPassword,
                teacherID: selectedTeacher.id,
                isEdit,
            },
            true,
            false,
            true
        );
        if (response.status === 200) {
            setActiveTab("teacher-details");
            setShowTeacherDetails(true);
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
            setShowTeacherDetails(false);
            setActiveTab("teacher-details");
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
            setShowTeacherDetails(false);
            setActiveTab("teacher-details");
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
        const response = await getTeacCourse.callApi(`course/get-teacher-assiged-course/${selectedTeacher.id}`, true, false);
        console.log(response);
    };

    const handleAssignCourse = async () => {
        const payload = {
            teacherID: selectedTeacher.id,
            courseID: assignCourse.courseId,
        };
        const response = await postCourse.callApi('course/assign-course', payload, true, false, true);
        getTeacherAssignedCourses();
        console.log(response);
    };

    const handleTabChange = async (value: string) => {
        setActiveTab(value);
        if (value === "class-timings") {
            await handleTeacherClassTimeManagement();
        } else if (value === "assign-course") {
            await getTeacherAssignedCourses();
        }
    };

    useEffect(() => {
        fetchCourses();
        getRequestedTeacher();
        getStudents()
    }, []);

    const renderTabs = () => (
        <div className="p-3 border w-full  rounded-xl mb-4">
            <Tabs value={activeTab} onValueChange={handleTabChange} className=" overflow-auto">
                <TabsList className="lg:grid lg:w-full grid-cols-4 ">
                    <TabsTrigger value="teacher-details">Teacher Details</TabsTrigger>
                    <TabsTrigger value="class-timings">Class Timings</TabsTrigger>
                    <TabsTrigger value="assign-course">Assign Course</TabsTrigger>
                    <TabsTrigger value="login-credentials">
                        {selectedTeacher?.status === "pending" ? "Assign Login Credentials" : "Edit Login Credentials"}
                    </TabsTrigger>
                </TabsList>
            </Tabs>
        </div>
    );

    return (
        <div className="p-5">
            {!showTeacherDetails && (
                <div>
                    {getTeacher.loading || getFilteredTeacher.loading ? (
                        <SpinnerLoader color="black" />
                    ) : (
                        <>
                            <div className="mb-3 p-3 rounded-xl border" >
                                <div className="mb-1 font-semibold" >
                                    Filters
                                </div>
                                <div className="space-x-2 flex items-center " >

                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="outline" >
                                                {courseID
                                                    ? getCourses?.response?.course?.find((c: { id: Number; }) => c.id === courseID)?.name
                                                    : "Courses"}
                                            </Button>
                                        </DropdownMenuTrigger>

                                        <DropdownMenuContent className="w-56">
                                            {getCourses?.response?.course?.map(
                                                (course: { id: number; name: string }) => (
                                                    <DropdownMenuCheckboxItem
                                                        key={course.id}
                                                        checked={courseID === course.id}
                                                        onCheckedChange={checked =>
                                                            setCourseID(checked ? course.id : null)
                                                        }
                                                    >
                                                        {course.name}
                                                    </DropdownMenuCheckboxItem>
                                                )
                                            )}
                                        </DropdownMenuContent>
                                    </DropdownMenu>

                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="outline" >
                                                {studentID
                                                    ? getStd?.response?.students?.find((s: { id: Number; }) => s.id === studentID)?.name
                                                    : "Students"}
                                            </Button>
                                        </DropdownMenuTrigger>

                                        <DropdownMenuContent className="w-56">
                                            {getStd?.response?.students?.map(
                                                (student: { id: number; name: string; std_id: string }) => (
                                                    <DropdownMenuCheckboxItem
                                                        key={student.id}
                                                        checked={studentID === student.id}
                                                        onCheckedChange={checked => {
                                                            setStudentID(checked ? student.id : null)
                                                        }
                                                        }
                                                    >
                                                        {`${student.name} - ${student.std_id}`}
                                                    </DropdownMenuCheckboxItem>
                                                )
                                            )}
                                        </DropdownMenuContent>
                                    </DropdownMenu>

                                    <Button
                                        onClick={
                                            async () => {
                                                const response = await getFilteredTeacher.callApi(`teacher/get-filtered-teacher/${studentID}/${courseID}`, true, false)
                                                setTeachers(response.teachers)
                                            }
                                        }
                                    >
                                        Apply
                                    </Button>
                                    <Button
                                        onClick={
                                            () => {
                                                getRequestedTeacher()
                                            }
                                        }
                                    >
                                        Refresh
                                    </Button>
                                </div>
                            </div>
                            <TeacherTable
                                teachers={teachers}
                                handleTeacherDetails={handleTeacherDetails}
                            />
                        </>
                    )}
                </div>
            )}
            {showTeacherDetails && (
                <div className="w-full">
                    {renderTabs()}
                    <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
                        <TabsContent value="teacher-details">
                            <Card className="shadow-none w-full">
                                <CardHeader>
                                    <CardTitle className="text-xl font-bold underline ">
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
                                            <div className="flex flex-row gap-2">
                                                <div className="flex gap-2 flex-wrap">
                                                    <Button variant="secondary" onClick={() => setShowTeacherDetails(false)}>Close</Button>
                                                    <Button variant="destructive" onClick={deleteUser}>Delete</Button>
                                                </div>
                                                {selectedTeacher.status !== "pending" && (
                                                    <div className="flex gap-2">
                                                        <Button
                                                            onClick={() => blockUser(selectedTeacher.status, selectedTeacher.id)}
                                                        >
                                                            {selectedTeacher.status === "blocked" ? "Unblock" : "Block"}
                                                        </Button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>
                        <TabsContent value="class-timings">
                            {JSON.parse(selectedTeacher?.class_timings) > 0 ? (
                                <SpinnerLoader color="black" />
                            ) : (
                                <TeacherClassTimings
                                    classTimings={JSON.parse(selectedTeacher?.class_timings)}
                                    setShowClassManagement={() => setShowTeacherDetails(false)}
                                />
                            )}
                        </TabsContent>
                        <TabsContent value="assign-course">
                            <Card className="shadow-none w-full">
                                <CardHeader>
                                    <CardTitle className="text-xl font-bold underline">
                                        Assign Course to Teacher
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid gap-4">
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
                                                        <TableHead>Course Name</TableHead>
                                                        <TableHead>Action</TableHead>
                                                    </TableRow>
                                                </TableHeader>
                                                <TableBody>
                                                    {getTeacCourse.response?.courses.map((course: { course: { id: number, name: string }, id: number }) => (
                                                        <TableRow key={course.id}>
                                                            <TableCell>{course.course.name}</TableCell>
                                                            <TableCell>
                                                                <Button
                                                                    onClick={async () => {
                                                                        const response = await removeCourse.callApi(`teacher/remove-allocated-course/${course.course.id}`, true, false);
                                                                        console.log(response);
                                                                        await getTeacherAssignedCourses();
                                                                    }}
                                                                    variant='destructive'
                                                                    size='sm'
                                                                    className="ml-2"
                                                                >
                                                                    Delete
                                                                </Button>
                                                            </TableCell>
                                                        </TableRow>
                                                    ))}
                                                </TableBody>
                                            </Table>
                                        </div>
                                        <div className="flex gap-4 mt-4">
                                            <Button
                                                variant="outline"
                                                onClick={() => setShowTeacherDetails(false)}
                                            >
                                                Cancel
                                            </Button>
                                            <Button onClick={handleAssignCourse}>Assign</Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>
                        <TabsContent value="login-credentials">
                            <Card className="shadow-none w-full">
                                <CardHeader>
                                    <CardTitle className="text-xl font-bold underline">
                                        {selectedTeacher?.status === "pending" ? "Assign Login Credentials & Teacher ID" : "Update Login Credentials & Teacher ID"}
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
                                        <div className="flex gap-4 mt-4">
                                            <Button
                                                variant="outline"
                                                onClick={() => setShowTeacherDetails(false)}
                                            >
                                                Cancel
                                            </Button>
                                            <Button onClick={() => handleSaveDetails(selectedTeacher?.status !== "pending")}>
                                                {selectedTeacher?.status === "pending" ? "Assign" : "Update"}
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

export default Teacher;