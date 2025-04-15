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
    const [showClassData, setShowClassData] = useState<boolean>(false);
    const [singleClass, setSingleClass] = useState<any>(null);
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [link, setLink] = useState<string>("");

    const getCourse = useGetAndDelete(axios.get);
    const postClass = usePostAndPut(axios.post);
    const getClass = useGetAndDelete(axios.get);
    const getSingleClass = useGetAndDelete(axios.get);
    const editClass = usePostAndPut(axios.put);



    const getSingleClassData = async (classID: number) => {
        const response = await getSingleClass.callApi(`class/get/single-class-data/${classID}`, true, false);
        setAvailableTimings(response.class.course.class_timings);
        if (response?.class) {
            setSingleClass(response.class);
            setShowClassData(true);
            setIsEditing(false);
            setTitle(response.class.title);
            setDescription(response.class.description);
            setLink(response.class.classLink || "");
            setSelectedTimingID(response.class.class_timings?.[0]?.id?.toString() || "");
        }
        console.log(response.class)
        if (response?.class) {
            setSingleClass(response.class);
            setShowClassData(true);
        }
    }

    const createClass = async () => {
        const response = await postClass.callApi(
            'class/create',
            {
                title,
                description,
                selectedCourseId,
                selectedTimingID,
                link,
            },
            false,
            false,
            true
        );
        if (response) {

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

    function shortenSentence(sentence: string, wordLimit = 15) {
        const words = sentence.trim().split(/\s+/);
        if (words.length <= wordLimit) {
            return sentence;
        }
        return words.slice(0, wordLimit).join(' ') + '...';
    }

    const handleEdit = async () => {
        const response = await editClass.callApi('class/edit/by-teacher',
            {
                id: singleClass.id,
                title,
                description,
                link,
                selectedTimingID,
            },
            true,
            false,
            true,
        )
        if (response.status) {
            fetchClasses();
            setIsEditing(!isEditing)
        }
    }
    
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
            {
                !showClassData && (
                    <>
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
                                    <div>
                                        <Label className="block text-sm font-medium">Link</Label>
                                        <Input
                                            id="link"
                                            type="text"
                                            value={link}
                                            onChange={(e) => setLink(e.target.value)}
                                            className="w-full mt-2"
                                            placeholder="Enter link"
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

                        <Card className="shadow-none" >
                            <CardHeader>
                                <CardTitle className="text-xl font-bold underline">Your Classes</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Title</TableHead>
                                            <TableHead>Description</TableHead>
                                            <TableHead>Course</TableHead>
                                            <TableHead>Total Seats</TableHead>
                                            <TableHead>Filled Seats</TableHead>
                                            <TableHead>Link</TableHead>
                                            <TableHead>Action</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {allClasses.map((cls) => (
                                            <TableRow key={cls.id}>
                                                <TableCell>{cls.title}</TableCell>
                                                <TableCell>{shortenSentence(cls.description)}</TableCell>
                                                <TableCell>{cls.course.name}</TableCell>
                                                <TableCell>{cls.total_seats ?? "N/A"}</TableCell>
                                                <TableCell>{cls.filled_seats ?? "0"}</TableCell>
                                                <TableCell className="text-blue-600 underline">
                                                    {cls.classLink ?? "N/A"}
                                                </TableCell>
                                                <TableCell>
                                                    <Button onClick={() => getSingleClassData(cls.id)} >
                                                        See more
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    </>
                )
            }

            {
                showClassData && singleClass && (
                    <Card className="shadow-none">
                        <CardHeader>
                            <CardTitle className="text-2xl">{isEditing ? "Edit Class" : singleClass.title}</CardTitle>
                            <p className="text-sm">Course: {singleClass.course?.name ?? "N/A"}</p>
                        </CardHeader>

                        <CardContent className="space-y-4">
                            {isEditing ? (
                                <>
                                    <div>
                                        <Label>Title</Label>
                                        <Input value={title} onChange={(e) => setTitle(e.target.value)} />
                                    </div>
                                    <div>
                                        <Label>Description</Label>
                                        <Input value={description} onChange={(e) => setDescription(e.target.value)} />
                                    </div>
                                    <div>
                                        <Label>Link</Label>
                                        <Input value={link} onChange={(e) => setLink(e.target.value)} />
                                    </div>
                                    <div>
                                        <Label>Class Timing</Label>
                                        <Select
                                            onValueChange={(val) => setSelectedTimingID(val)}
                                            value={selectedTimingID}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select timing" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {availableTimings.map((timing, index) => (
                                                    <SelectItem
                                                        key={index}
                                                        value={timing.id.toString()}
                                                    >
                                                        {timing.preferred_time_from} - {timing.preferred_time_to}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div>
                                        <h4 className="font-semibold">Description</h4>
                                        <p className="text-sm text-gray-700">{singleClass.description}</p>
                                    </div>

                                    <div className="grid grid-cols-2 gap-2">
                                        <div>
                                            <h4 className="font-semibold">Timings</h4>
                                            {
                                                singleClass.class_timings?.length > 0 ? (
                                                    <p className="text-sm">
                                                        {singleClass.class_timings[0].preferred_time_from} - {singleClass.class_timings[0].preferred_time_to}
                                                    </p>
                                                ) : (
                                                    <p className="text-sm text-gray-500">No timing available</p>
                                                )
                                            }
                                        </div>
                                        <div>
                                            <h4 className="font-semibold">Teacher</h4>
                                            <p className="text-sm">{singleClass.teacher?.name}</p>
                                        </div>
                                        <div>
                                            <h4 className="font-semibold">Total Seats</h4>
                                            <p className="text-sm">{singleClass.total_seats ?? "N/A"}</p>
                                        </div>
                                        <div>
                                            <h4 className="font-semibold">Link</h4>
                                            <p className="text-sm">{singleClass.classLink ?? "N/A"}</p>
                                        </div>
                                        <div>
                                            <h4 className="font-semibold">Filled Seats</h4>
                                            <p className="text-sm">{singleClass.filled_seats ?? "0"}</p>
                                        </div>
                                    </div>
                                </>
                            )}
                        </CardContent>

                        <div className="flex items-center justify-end gap-2 px-4 pb-4">
                            <Button variant="outline" onClick={() => {
                                setShowClassData(false);
                                setIsEditing(false);
                            }}>
                                Back
                            </Button>

                            {isEditing ? (
                                <Button onClick={handleEdit}>
                                    Save
                                </Button>
                            ) : (
                                <Button onClick={() => setIsEditing(true)}>
                                    Edit
                                </Button>
                            )}

                            <Button variant="destructive">
                                Delete
                            </Button>
                        </div>
                    </Card>

                )
            }

        </div>
    );
};

export default Classes;
