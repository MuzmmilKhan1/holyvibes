import SpinnerLoader from "@/components/SpinLoader";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardFooter,
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

interface Course {
    id: string | number | null;
    image: string;
    name: string;
    description: string;
    price: string | number;
    course_duration: string;
}

interface Class {
    class: {
        id: string | number;
        title: string;
        classLink: string;
    }
    course?: { name: string };
    preferred_time_from: string;
    preferred_time_to: string;
}


const EnrolledCourses: React.FC = () => {
    const getCourses = useGetAndDelete(axios.get);
    const getCourseClasses = useGetAndDelete(axios.get);
    const [showClasses, setShowClasses] = useState<boolean>(false);

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

    useEffect(() => {
        getStudentCourses();
    }, []);

    return (
        <div className="p-6">
            <div className="w-full">
                {getCourses.loading ? (
                        <SpinnerLoader color="black" />
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                        {!showClasses &&
                            getCourses?.response?.courses?.map((course: Course) => (
                                <Card
                                    key={course.id}
                                    className="w-full bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300"
                                >
                                    <CardHeader >
                                        <img
                                            src={course.image}
                                            alt={course.name}
                                            className="w-full h-48 object-cover rounded-md"
                                        />
                                        <CardTitle className="text-lg font-semibold text-gray-800 mt-3 truncate">
                                            {course.name}
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="text-black" >
                                        <p className="text-md  line-clamp-3">
                                            <span className="font-medium ">Description:</span>{" "}
                                            {course.description}
                                        </p>
                                        <p className="text-md  mt-2">
                                            <span className="font-medium ">Price:</span> ${course.price}
                                        </p>
                                        <p className="text-md  mt-2">
                                            <span className="font-medium ">Duration:</span>{" "}
                                            {course.course_duration}
                                        </p>
                                    </CardContent>
                                    <CardFooter className="p-4 pt-0 flex items-center justify-between">
                                        <Button
                                            size="sm"
                                        >
                                            See outlines
                                        </Button>
                                        <Button
                                            size="sm"
                                            onClick={() => getCourseClassesData(course.id)}
                                        >
                                            Classes
                                        </Button>
                                    </CardFooter>
                                </Card>
                            ))}
                    </div>
                )}

                {showClasses && (
                    <div className="w-full" >
                        <Card className="shadow-none w-full">
                            <CardHeader >
                                <CardTitle className="text-xl font-bold underline " >All Classes</CardTitle>
                            </CardHeader>
                            <CardContent >
                                {getCourseClasses.response?.classes?.length ? (
                                    <div className="overflow-x-auto">
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead className="font-semibold text-gray-800">Title</TableHead>
                                                    <TableHead className="font-semibold text-gray-800">Link</TableHead>
                                                    <TableHead className="font-semibold text-gray-800">Course</TableHead>
                                                    <TableHead className="font-semibold text-gray-800">Time</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {getCourseClasses.response.classes.map((classItem: Class) => (
                                                    <TableRow key={classItem.class.id}>
                                                        <TableCell>{classItem.class.title}</TableCell>
                                                        <TableCell>
                                                            <a
                                                                href={
                                                                    classItem.class.classLink.startsWith('http')
                                                                        ? classItem.class.classLink
                                                                        : `https://${classItem.class.classLink}`
                                                                }
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="text-blue-600 hover:underline"
                                                            >
                                                                {classItem.class.classLink}
                                                            </a>

                                                        </TableCell>
                                                        <TableCell>{classItem.course?.name || "N/A"}</TableCell>
                                                        <TableCell>
                                                            {classItem.preferred_time_from} - {classItem.preferred_time_to}
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </div>
                                ) : (
                                    <p className="text-gray-500">No classes found.</p>
                                )}

                                <div className="w-full mt-4 flex" >
                                    <Button onClick={() => {
                                        setShowClasses(!showClasses);
                                    }}>
                                        Close
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}
            </div>
        </div>
    );
};

export default EnrolledCourses;