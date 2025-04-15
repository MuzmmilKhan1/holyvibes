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
    id: React.Key | null;
    image: string;
    name: string;
    description: string;
    price: string | number;
    course_duration: string;
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
            <div className="mt-3 w-full">
                {getCourses.loading ? (
                    <SpinnerLoader color="black" />
                ) : (
                    <div className="flex items-start justify-start flex-row flex-wrap gap-4">
                        {getCourses?.response?.course?.map((course: Course) => (
                            <Card
                                key={course.id}
                                className="lg:w-[23%] shadow-none"
                            >
                                <CardHeader>
                                    <img
                                        src={course.image}
                                        alt={course.name}
                                        className="w-full h-40 object-cover rounded-md"
                                    />
                                    <CardTitle className="text-lg mt-1">{course.name}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-muted-foreground">{course.description}</p>
                                    <p className="text-sm text-muted-foreground mt-3">
                                        <strong className="text-foreground">Price:</strong> ${course.price}
                                    </p>
                                    <p className="text-sm text-muted-foreground mt-1">
                                        <strong className="text-foreground">Duration:</strong>{" "}
                                        {course.course_duration}
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