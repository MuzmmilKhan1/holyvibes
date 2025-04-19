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
import { useEffect } from "react";

type Course = {
    course: {
        id: React.Key | null;
        image: string;
        name: string;
        description: string;
        price: string | number;
        course_duration: string;
    };
};

const TeacherCourse = () => {
    const getCourses = useGetAndDelete(axios.get);
    const getCourseData = async () => {
        const response = await getCourses.callApi("teacher/get-teacher-course", false, false);
        console.log(response);
    };

    useEffect(() => {
        getCourseData();
    }, []);

    return (
        <div className="p-6">
            <div className=" w-full">
                {getCourses.loading ? (
                    <SpinnerLoader color="black" />
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-5 gap-4">

                        {getCourses?.response?.course?.map((course: Course) => (
                            <Card
                                key={course.course.id}
                                className="w-full shadow-none"
                            >
                                <CardHeader>
                                    <img
                                        src={course.course.image}
                                        alt={course.course.name}
                                        className="w-full h-40 object-cover rounded-md"
                                    />
                                    <CardTitle className="text-lg mt-1">{course.course.name}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm "><strong>Description:</strong> {course.course.description}</p>
                                    <p className="text-sm mt-1">
                                        <strong className="text-foreground">Price:</strong> ${course.course.price}
                                    </p>
                                    <p className="text-sm  mt-1">
                                        <strong className="text-foreground">Duration:</strong>{" "}
                                        {course.course.course_duration}
                                    </p>
                                </CardContent>
                                <CardFooter>
                                    <Button size="sm" className="w-full">
                                        See outlines
                                    </Button>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default TeacherCourse;