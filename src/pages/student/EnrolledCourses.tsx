import SpinnerLoader from "@/components/SpinLoader";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import useGetAndDelete from "@/hooks/useGetAndDelete";
import axios from "axios";
import { useEffect, useState } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import CourseOutlineScreen from "@/components/CourseOutlineScreen";

interface Course {
    id: number;
    image: string;
    name: string;
    description: string;
    price: string | number;
    course_duration: string;
}

interface Class {
    class: {
        id: number;
        title: string;
        classLink: string;
        teacher_class_timings: {
            preferred_time_from: string;
            preferred_time_to: string;
        }[]
    }
    course?: { name: string };
    preferred_time_from: string;
    preferred_time_to: string;
}

interface Performance {
    attendance: string;
    class: { id: number; name: string };
    student: { id: number; std_id: string };
    teacher: { id: number; name: string };
    test_remarks: string;
    participation: string;
    suggestions: string;
}

const EnrolledCourses: React.FC = () => {
    const getCourses = useGetAndDelete(axios.get);
    const getCourseClasses = useGetAndDelete(axios.get);
    const getOutlines = useGetAndDelete(axios.get);
    const getPerformance = useGetAndDelete(axios.get);

    const [showOutlines, setShowOutlines] = useState(false);
    const [showClasses, setShowClasses] = useState<boolean>(false);
    const [performance, setPerformance] = useState<Performance | undefined>(undefined);

    const fetchCourseOutlines = async (courseId: React.Key | null) => {
        await getOutlines.callApi(`course/outlines/${courseId}`, true, false);
        setShowOutlines(!showOutlines);
    };

    const getStudentCourses = async () => {
        await getCourses.callApi("student/get-std-courses", false, false);
    };

    const getCourseClassesData = async (id: string | number | null) => {
        if (id) {
            const response = await getCourseClasses.callApi(`student/get-course-classes/${id}`, false, false);
            if (response?.classes?.length) {
                setShowClasses(true);
            }
        }
    };

    const getStdPerformance = async (classID: number) => {
        const response = await getPerformance.callApi(`student/get-performance/${classID}`, false, false);
        setPerformance(response?.data)
    };


    useEffect(() => {
        getStudentCourses();
    }, []);

    return (
        <div className="p-6">
            {!showOutlines && (
                <div className="w-full">
                    {getCourses.loading ? (
                        <SpinnerLoader color="black" />
                    ) : (
                        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                            {!showClasses && performance == undefined &&
                                getCourses?.response?.courses?.map((course: Course) => (
                                    <div
                                        key={course.id}
                                        className="bg-white rounded-2xl border overflow-hidden"
                                    >
                                        <img
                                            src={course.image}
                                            alt={course.name}
                                            className="w-full h-48 object-none"
                                        />
                                        <div className="p-4">
                                            <h2 className="text-lg font-bold text-gray-800">{course.name}</h2>
                                            <p className="text-gray-600 mt-1 text-sm">{course.description}</p>
                                            <div className="mt-3 flex flex-col justify-between items-start">
                                                <div className="flex items-center justify-between w-full px-1">
                                                    <span className="text-gray-600 font-semibold">${course.price}</span>
                                                    <span className="text-sm text-gray-500">{course.course_duration}</span>
                                                </div>
                                                <div className="flex mt-2 items-center justify-between w-full">
                                                    <Button
                                                        onClick={() => fetchCourseOutlines(course.id)}
                                                        size="sm"
                                                        variant='outline'
                                                    >
                                                        See outlines
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        onClick={() => getCourseClassesData(course.id)}
                                                    >
                                                        Classes
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                        </div>
                    )}

                    {showClasses && performance == undefined && (
                        <div className="w-full">
                            <Card className="shadow-none w-full">
                                <CardHeader>
                                    <CardTitle className="text-xl font-bold underline">All Classes</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {getCourseClasses.response?.classes?.length ? (
                                        <div className="overflow-x-auto">
                                            <Table>
                                                <TableHeader>
                                                    <TableRow>
                                                        <TableHead className="font-semibold text-gray-800">Title</TableHead>
                                                        <TableHead className="font-semibold text-gray-800">Link</TableHead>
                                                        <TableHead className="font-semibold text-gray-800">Course</TableHead>
                                                        <TableHead className="font-semibold text-gray-800">Time</TableHead>
                                                        <TableHead className="font-semibold text-gray-800">Action</TableHead>
                                                    </TableRow>
                                                </TableHeader>
                                                <TableBody>
                                                    {getCourseClasses.response.classes.map((classItem: Class) => (
                                                        <TableRow key={classItem?.class?.id}>
                                                            <TableCell>{classItem?.class?.title}</TableCell>
                                                            <TableCell>
                                                                <a
                                                                    href={
                                                                        classItem?.class?.classLink?.startsWith('http')
                                                                            ? classItem?.class?.classLink
                                                                            : `https://${classItem?.class?.classLink}`
                                                                    }
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="text-blue-600 hover:underline"
                                                                >
                                                                    {classItem.class.classLink}
                                                                </a>
                                                            </TableCell>
                                                            <TableCell>{classItem?.course?.name || "N/A"}</TableCell>
                                                            <TableCell>
                                                                {classItem?.class.teacher_class_timings[0].preferred_time_from} - {classItem?.class.teacher_class_timings[0].preferred_time_to}
                                                            </TableCell>
                                                            <TableCell>
                                                                <Button onClick={() => getStdPerformance(classItem.class.id)}>
                                                                    See Performance
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

                                    <div className="w-full mt-4 flex">
                                        <Button onClick={() => setShowClasses(false)}>
                                            Close
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    )}

                    {performance !== undefined && (
                        <div className="w-full ">
                            <div className="border p-5 rounded-xl" >
                                <h1 className="text-xl underline font-bold mb-3" >Monthly Performance</h1>
                                <p><strong>Attendance: </strong>{performance?.attendance}</p>
                                <p><strong>Oral/Written Test Remarks: </strong>{performance?.test_remarks}</p>
                                <p><strong>Class Participation: </strong>{performance?.participation}</p>
                                <p><strong>Suggestions: </strong>{performance?.suggestions}</p>
                                <div className="mt-3" >
                                    <Button onClick={
                                        () => setPerformance(undefined)
                                    } >
                                        Close
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}
            {showOutlines && (
                <CourseOutlineScreen
                    outlines={getOutlines?.response?.outlines}
                    setShowOutlines={setShowOutlines}
                    showOutlines={showOutlines}
                />
            )}
        </div>
    );
};

export default EnrolledCourses;