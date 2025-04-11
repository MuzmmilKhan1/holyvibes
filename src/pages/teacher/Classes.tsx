import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import useGetAndDelete from "@/hooks/useGetAndDelete";
import axios from "axios";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import usePostAndPut from "@/hooks/usePostAndPut";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

const Classes = () => {
    const [title, setTitle] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [selectedCourseId, setSelectedCourseId] = useState<string>("");
    const [courses, setCourses] = useState<any[]>([]);
    const [availableTimings, setAvailableTimings] = useState<any[]>([]);
    const [selectedTimingID, setSelectedTimingID] = useState<string>("");
    const [allClasses, setAllClasses] = useState<any[]>([]);

    const getCourse = useGetAndDelete(axios.get);
    const postClass = usePostAndPut(axios.post);
    const getClass = useGetAndDelete(axios.get);

    const createClass = async () => {
        const response = await postClass.callApi(
            'class/create',
            {
                title,
                description,
                selectedCourseId,
                selectedTimingID,
            },
            false,
            false,
            true
        );
        if (response) {
            setAvailableTimings(prev =>
                prev.filter(time => time.id !== Number(response.data.classTimingID))
            );
            fetchClasses();
            setTitle("");
            setDescription("");
            setSelectedTimingID("");
        }
    };

    const fetchClasses = async () => {
        const response = await getClass.callApi("class/get", false, false);
        if (response?.data) {
            setAllClasses(Array.isArray(response.data) ? response.data : [response.data]);
        }
    };

    useEffect(() => {
        fetchClasses();
    }, []);

    useEffect(() => {
        const getCourses = async () => {
            const response = await getCourse.callApi("course/get-teacher-courses-time", false, false);
            if (response?.courses) {
                setCourses(response.courses);
            }
        };
        getCourses();
    }, []);

    useEffect(() => {
        const selected = courses.find(course => course.id === Number(selectedCourseId));
        if (selected) {
            const filteredTimings = (selected.class_timings || []).filter((t: { classID: null; }) => t.classID == null);
            setAvailableTimings(filteredTimings);
        } else {
            setAvailableTimings([]);
        }
    }, [selectedCourseId, courses]);

    return (
        <div className="w-full p-6 space-y-10">
            <Card className="shadow-none">
                <CardHeader>
                    <CardTitle className="text-xl font-bold underline">Create Class</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label>Course</Label>
                            <Select
                                onValueChange={(val) => setSelectedCourseId(val)}
                                value={selectedCourseId}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select course" />
                                </SelectTrigger>
                                <SelectContent>
                                    {getCourse?.loading ? (
                                        <div className="p-2 text-center">Loading...</div>
                                    ) : (
                                        courses.map((course) => (
                                            <SelectItem key={course.id} value={course.id.toString()}>
                                                {course.name}
                                            </SelectItem>
                                        ))
                                    )}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label>Class Timing</Label>
                            <Select
                                onValueChange={(val) => setSelectedTimingID(val)}
                                value={selectedTimingID}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select timing" />
                                </SelectTrigger>
                                <SelectContent>
                                    {availableTimings?.length > 0 ? (
                                        availableTimings.map((timing, index) => (
                                            <SelectItem
                                                key={index}
                                                value={timing.id.toString()}
                                            >
                                                {timing.preferred_time_from} - {timing.preferred_time_to}
                                            </SelectItem>
                                        ))
                                    ) : (
                                        <div className="p-2 text-center text-sm text-gray-500">
                                            No timings available
                                        </div>
                                    )}
                                </SelectContent>
                            </Select>
                        </div>

                        <div>
                            <Label className="block text-sm font-medium">Title</Label>
                            <Input
                                id="title"
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="w-full mt-2"
                                placeholder="Enter class name"
                            />
                        </div>

                        <div>
                            <Label className="block text-sm font-medium">Description</Label>
                            <Input
                                id="description"
                                type="text"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="w-full mt-2"
                                placeholder="Enter description of class"
                            />
                        </div>

                        <div className="mt-4">
                            <Button onClick={createClass}>
                                Create
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="text-xl font-bold underline">Your Classes</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Title</TableHead>
                                <TableHead>Description</TableHead>
                                <TableHead>Course ID</TableHead>
                                <TableHead>Total Seats</TableHead>
                                <TableHead>Filled Seats</TableHead>
                                <TableHead>Link</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {allClasses.map((cls) => (
                                <TableRow key={cls.id}>
                                    <TableCell>{cls.title}</TableCell>
                                    <TableCell>{cls.description}</TableCell>
                                    <TableCell>{cls.courseID}</TableCell>
                                    <TableCell>{cls.total_seats ?? "N/A"}</TableCell>
                                    <TableCell>{cls.filled_seats ?? "0"}</TableCell>
                                    <TableCell className="text-blue-600 underline">
                                        {cls.classLink ?? "N/A"}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
};

export default Classes;
