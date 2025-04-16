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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
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

const ClassForm = () => {
    const [title, setTitle] = useState("");
    const [link, setLink] = useState("");
    const [timeFrom, setTimeFrom] = useState("");
    const [timeTo, setTimeTo] = useState("");
    const [selectedCourseId, setSelectedCourseId] = useState("");

    const getCourse = useGetAndDelete(axios.get);
    const postClass = usePostAndPut(axios.post);
    const getClass = useGetAndDelete(axios.get);

    const handleSubmit = async () => {
        const formData = {
            title,
            link,
            classTime: {
                from: timeFrom,
                to: timeTo,
            },
            courseId: selectedCourseId,
        };
        const response = await postClass.callApi(
            "class/create",
            formData,
            false,
            false,
            true
        );
        console.log("Form Submitted:", response);
        await getClassData();
    };

    const getCourseData = async () => {
        await getCourse.callApi("teacher/get-teacher-course", false, false);
    };

    const getClassData = async () => {
        const response = await getClass.callApi("class/get", false, false);
        console.log(response);
    };

    useEffect(() => {
        getCourseData();
        getClassData();
    }, []);

    return (
        <div className="p-6 space-y-10">
            <Card className="shadow-none">
                <CardHeader>
                    <CardTitle>Create Class</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <Label htmlFor="course">Select Course</Label>
                        <Select onValueChange={(value) => setSelectedCourseId(value)}>
                            <SelectTrigger>
                                <SelectValue placeholder="Choose a course" />
                            </SelectTrigger>
                            <SelectContent>
                                {getCourse.response?.course?.length > 0 &&
                                    getCourse.response.course.map((course: any) => (
                                        <SelectItem key={course.course.id} value={course.course.id}>
                                            {course?.course.name}
                                        </SelectItem>
                                    ))}
                            </SelectContent>
                        </Select>
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
                                <Label htmlFor="timeFrom" className="text-sm">
                                    From
                                </Label>
                                <Input
                                    id="timeFrom"
                                    type="time"
                                    value={timeFrom}
                                    onChange={(e) => setTimeFrom(e.target.value)}
                                />
                            </div>
                            <div className="flex-1">
                                <Label htmlFor="timeTo" className="text-sm">
                                    To
                                </Label>
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

            <Card>
                <CardHeader>
                    <CardTitle>All Classes</CardTitle>
                </CardHeader>
                <CardContent>
                    {getClass.response?.data?.length > 0 ? (
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Title</TableHead>
                                        <TableHead>Link</TableHead>
                                        <TableHead>Course</TableHead>
                                        <TableHead>Time</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {getClass.response.data.map((classItem: any) => (
                                        <TableRow key={classItem.id}>
                                            <TableCell>{classItem.title}</TableCell>
                                            <TableCell>
                                                <a
                                                    href={classItem.classLink}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-blue-600 hover:underline"
                                                >
                                                    {classItem.classLink}
                                                </a>
                                            </TableCell>
                                            <TableCell>{classItem.course?.name || "N/A"}</TableCell>
                                            <TableCell>
                                                {classItem.teacher_class_timings?.map((time: any, index: number) => (
                                                    <div key={index}>
                                                        {time.preferred_time_from || "-"} to {time.preferred_time_to || "-"}
                                                    </div>
                                                ))}
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
        </div>
    );
};

export default ClassForm;