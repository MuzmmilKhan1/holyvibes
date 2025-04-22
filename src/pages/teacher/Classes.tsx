
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import useGetAndDelete from "@/hooks/useGetAndDelete";
import usePostAndPut from "@/hooks/usePostAndPut";
import axios from "axios";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import SpinnerLoader from "@/components/SpinLoader";
import ReactSelect from 'react-select';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface OptionType {
    value: string;
    label: string;
}

const ClassForm = () => {
    const defaultAttendenceData = {
        classId: "",
        studentId: '',
        date: new Date().toISOString().split("T")[0],
        status: "",
    };

    const [title, setTitle] = useState("");
    const [link, setLink] = useState("");
    const [timeFrom, setTimeFrom] = useState("");
    const [timeTo, setTimeTo] = useState("");
    const [selectedCourseIds, setSelectedCourseIds] = useState<OptionType[]>([]);
    const [showAttendenceForm, setShowAttendenceForm] = useState(false);
    const [attendenceData, setAttendenceData] = useState(defaultAttendenceData);
    const [stdOptions, setStdOptions] = useState<OptionType[]>([]);
    const [selectedStudent, setSelectedStudent] = useState<OptionType | null>(null);
    const [isEdit, setIsEdit] = useState<boolean>(false);
    const [attendenceID, setAttendenceID] = useState<number>(0);

    const getCourse = useGetAndDelete(axios.get);
    const postClass = usePostAndPut(axios.post);
    const getClass = useGetAndDelete(axios.get);
    const getStudents = useGetAndDelete(axios.get);
    const postAttendence = usePostAndPut(axios.post);
    const getAttendence = useGetAndDelete(axios.get);

    const handleSubmit = async () => {
        const formData = {
            title,
            link,
            classTime: {
                from: timeFrom,
                to: timeTo,
            },
            courseIds: selectedCourseIds.map(course => course.value), // Send array of course IDs
        };
        console.log(formData)
        await postClass.callApi("class/create", formData, false, false, true);
        await getClassData();
        setTitle("");
        setLink("");
        setTimeFrom("");
        setTimeTo("");
        setSelectedCourseIds([]);
    };

    const getCourseData = async () => {
        await getCourse.callApi("teacher/get-teacher-course", false, false);
    };

    const getClassData = async () => {
        console.log(await getClass.callApi('class/get', false, false))
    };

    const fetchStudentsForClass = async (classId: string) => {
        const response = await getStudents.callApi(`class/${classId}/students`, false, false);
        if (response?.students?.length > 0) {
            const newOptions = response.students.map((std: { std_id: string, id: string }) => ({
                value: std.id,
                label: std.std_id,
            }));
            setStdOptions(newOptions);
        } else {
            setStdOptions([]);
        }
    };

    const fetchAttendeceData = async (classId: string) => {
        await getAttendence.callApi(`attendence/get/${classId}`, false, false);
    };

    const handleAttendenceSubmit = async () => {
        await postAttendence.callApi(
            `attendence/add-edit/${attendenceID}`,
            attendenceData,
            false,
            false,
            true
        );
        await fetchAttendeceData(attendenceData.classId);
    };

    // Prepare course options for React Select
    const courseOptions = getCourse.response?.course?.map((course: any) => ({
        value: course.course.id.toString(),
        label: course.course.name
    })) || [];

    useEffect(() => {
        getCourseData();
        getClassData();
    }, []);

    return (
        <div className="p-6">
            {!showAttendenceForm && (
                <div className="space-y-10">
                    <Card className="shadow-none">
                        <CardHeader>
                            <CardTitle className="text-xl font-bold underline">Create Class</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <Label htmlFor="courses">Select Courses</Label>
                                <ReactSelect
                                    isMulti
                                    options={courseOptions}
                                    value={selectedCourseIds}
                                    onChange={(selected) => setSelectedCourseIds(selected as OptionType[])}
                                    placeholder="Select courses..."
                                    className="basic-multi-select"
                                    classNamePrefix="select"
                                />
                            </div>
                            <div>
                                <Label htmlFor="title">Title</Label>
                                <Input
                                    id="title"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="Enter class title"
                                />
                            </div>
                            <div>
                                <Label htmlFor="link">Link</Label>
                                <Input
                                    id="link"
                                    value={link}
                                    onChange={(e) => setLink(e.target.value)}
                                    placeholder="Enter class link"
                                />
                            </div>
                            <div>
                                <Label>Class Time</Label>
                                <div className="flex items-center space-x-4">
                                    <div className="flex-1">
                                        <Label htmlFor="timeFrom" className="text-sm">From</Label>
                                        <Input
                                            id="timeFrom"
                                            type="time"
                                            value={timeFrom}
                                            onChange={(e) => setTimeFrom(e.target.value)}
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <Label htmlFor="timeTo" className="text-sm">To</Label>
                                        <Input
                                            id="timeTo"
                                            type="time"
                                            value={timeTo}
                                            onChange={(e) => setTimeTo(e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="w-full flex items-start">
                                {postClass.loading ? (
                                    <Button disabled>Please wait...</Button>
                                ) : (
                                    <Button onClick={handleSubmit}>Submit</Button>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                    {getClass.loading ? (
                        <SpinnerLoader color="black" />
                    ) : (
                        <Card className="shadow-none">
                            <CardHeader>
                                <CardTitle className="text-xl font-bold underline">All Classes</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {getClass.response?.data?.length > 0 ? (
                                    <div className="overflow-x-auto">
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead>Title</TableHead>
                                                    <TableHead>Link</TableHead>
                                                    <TableHead>Courses</TableHead>
                                                    <TableHead>Time</TableHead>
                                                    <TableHead>Actions</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {getClass.response.data.map((classItem: any) => (
                                                    <TableRow key={classItem?.id}>
                                                        <TableCell>{classItem?.title}</TableCell>
                                                        <TableCell>
                                                            <a
                                                                href={
                                                                    classItem?.classLink?.startsWith('http://') ||
                                                                        classItem.classLink?.startsWith('https://')
                                                                        ? classItem.classLink
                                                                        : `https://${classItem?.classLink}`
                                                                }
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="text-blue-600 hover:underline"
                                                            >
                                                                {classItem?.classLink}
                                                            </a>
                                                        </TableCell>
                                                        <TableCell>
                                                            {classItem.courses?.map((course: any) => (
                                                                <div>
                                                                    {course.name}
                                                                </div>
                                                            )) || "N/A"}
                                                        </TableCell>
                                                        <TableCell>
                                                            {classItem.timings?.map((time: any, index: number) => (
                                                                <div key={index}>
                                                                    {time.from || "-"} to {time.to || "-"}
                                                                </div>
                                                            ))}
                                                        </TableCell>
                                                        <TableCell className="flex gap-2">
                                                            <Button>Edit</Button>
                                                            <Button variant="destructive">Delete</Button>
                                                            <Button
                                                                variant="outline"
                                                                onClick={async () => {
                                                                    setAttendenceData({
                                                                        ...attendenceData,
                                                                        classId: classItem.id,
                                                                    });
                                                                    await fetchStudentsForClass(classItem.id);
                                                                    await fetchAttendeceData(classItem.id);
                                                                    setShowAttendenceForm(true);
                                                                }}
                                                            >
                                                                Mark attendance
                                                            </Button>
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </div>
                                ) : (
                                    <p className="text-gray-500">No classes found.</p>
                                )}
                            </CardContent>
                        </Card>
                    )}
                </div>
            )}
            {showAttendenceForm && (
                <div className="space-y-6">
                    <Card className="shadow-none">
                        <CardHeader>
                            <CardTitle className="text-xl font-bold underline">
                                {isEdit ? "Edit Attendance" : "Mark Attendance"}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <Label className="block mb-1 text-sm font-medium">Select Student</Label>
                                <ReactSelect
                                    options={stdOptions}
                                    value={selectedStudent}
                                    onChange={(selected) => {
                                        setSelectedStudent(selected);
                                        setAttendenceData((prev) => ({
                                            ...prev,
                                            studentId: selected?.value || "",
                                        }));
                                    }}
                                    placeholder="Search student..."
                                    isSearchable
                                    isDisabled={isEdit}
                                />
                            </div>
                            <div>
                                <Label>Date</Label>
                                <Input
                                    type="date"
                                    value={attendenceData.date}
                                    onChange={(e) =>
                                        setAttendenceData({ ...attendenceData, date: e.target.value })
                                    }
                                />
                            </div>
                            <div>
                                <Label>Status</Label>
                                <Select
                                    onValueChange={(value) =>
                                        setAttendenceData((prev) => ({ ...prev, status: value }))
                                    }
                                    value={attendenceData.status}
                                >
                                    <SelectTrigger >
                                        <SelectValue placeholder="Select status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="present">Present</SelectItem>
                                        <SelectItem value="absent">Absent</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="flex gap-2">
                                {postAttendence.loading ? (
                                    <Button disabled>Please wait...</Button>
                                ) : (
                                    <Button onClick={handleAttendenceSubmit}>Submit</Button>
                                )}
                                <Button
                                    onClick={() => {
                                        setShowAttendenceForm(false);
                                        setAttendenceData(defaultAttendenceData);
                                        setSelectedStudent(null);
                                        setIsEdit(false);
                                        setAttendenceID(0);
                                    }}
                                    variant="outline"
                                >
                                    Cancel
                                </Button>
                                {isEdit && (
                                    <Button
                                        onClick={() => {
                                            setAttendenceData(prev => ({
                                                ...prev,
                                                date: new Date().toISOString().split("T")[0],
                                                status: "",
                                                studentId: ""
                                            }));
                                            setSelectedStudent(null);
                                            setIsEdit(false);
                                            setAttendenceID(0);
                                        }}
                                        variant="secondary"
                                    >
                                        Cancel Edit
                                    </Button>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {getAttendence.loading ? (
                        <SpinnerLoader color="black" />
                    ) : (
                        <Card className="shadow-none">
                            <CardHeader>
                                <CardTitle className="text-xl font-bold underline">Class Attendance</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {getAttendence.response?.attendences?.length > 0 ? (
                                    <div className="overflow-x-auto">
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead>Student ID</TableHead>
                                                    <TableHead>Date</TableHead>
                                                    <TableHead>Status</TableHead>
                                                    <TableHead>Action</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {getAttendence.response.attendences.map((attendence: any) => (
                                                    <TableRow key={attendence.id}>
                                                        <TableCell>{attendence.student.std_id}</TableCell>
                                                        <TableCell>{attendence.date}</TableCell>
                                                        <TableCell>{attendence.status}</TableCell>
                                                        <TableCell className="flex gap-2">
                                                            <Button
                                                                onClick={() => {
                                                                    setAttendenceData({
                                                                        ...attendenceData,
                                                                        date: attendence.date,
                                                                        status: attendence.status,
                                                                        studentId: attendence.student.id,
                                                                    });
                                                                    setSelectedStudent({
                                                                        value: attendence.student.id,
                                                                        label: attendence.student.std_id,
                                                                    });
                                                                    setIsEdit(true);
                                                                    setAttendenceID(attendence.id);
                                                                }}
                                                                variant="outline"
                                                            >
                                                                Edit
                                                            </Button>
                                                            <Button variant="destructive">Delete</Button>
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </div>
                                ) : (
                                    <p className="text-gray-500">No class attendance found.</p>
                                )}
                            </CardContent>
                        </Card>
                    )}
                </div>
            )}
        </div>
    );
};

export default ClassForm;
