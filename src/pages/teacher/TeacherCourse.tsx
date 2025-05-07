import CourseOutlineScreen from "@/components/CourseOutlineScreen";
import SpinnerLoader from "@/components/SpinLoader";
import { Button } from "@/components/ui/button";
import useGetAndDelete from "@/hooks/useGetAndDelete";
import axios from "axios";
import { useEffect, useState } from "react";

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
    const getOutlines = useGetAndDelete(axios.get);

    const [showOutlines, setShowOutlines] = useState(false)

    const getCourseData = async () => {
        const response = await getCourses.callApi("teacher/get-teacher-course", false, false);
        console.log(response);
    };

    const fetchCourseOutlines = async (courseId: React.Key | null) => {
        console.log(courseId)
        await getOutlines.callApi(`course/outlines/${courseId}`, true, false)
        setShowOutlines(!showOutlines)
    }

    useEffect(() => {
        getCourseData();
    }, []);

    return (
        <div className="p-5">
            {
                !showOutlines &&
                <div className=" w-full">
                    {getCourses.loading ? (
                        <SpinnerLoader color="black" />
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            {
                                getCourses?.response?.course?.length > 0 ?
                                    getCourses?.response?.course?.map((course: Course) => (
                                        <div
                                            key={course.course.id}
                                            className="bg-white rounded-2xl border overflow-hidden"
                                        >
                                            <img
                                                src={course.course.image}
                                                alt={course.course.name}
                                                className="w-full h-48 object-none"
                                            />
                                            <div className="p-4">
                                                <h2 className="text-lg font-bold text-gray-800">{course.course.name}</h2>
                                                <p className="text-gray-600 mt-1 text-sm">{course.course.description}</p>
                                                <div className="mt-3 flex flex-col justify-between items-start">
                                                    <div className="flex flex-row items-center justify-between px-1 w-full">
                                                        <span className="text-gray-600 font-semibold">${course.course.price}</span>
                                                        <span className="text-sm text-gray-500">{course.course.course_duration}</span>
                                                    </div>
                                                    <div className="flex mt-2 items-center justify-between w-full">
                                                        <Button
                                                            onClick={() => fetchCourseOutlines(course.course.id)}
                                                            size="sm">See outlines</Button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                    )
                                    :
                                    <div>
                                        No courses assigned
                                    </div>

                            }
                        </div>
                    )}
                </div>
            }

            {
                showOutlines &&
                <CourseOutlineScreen
                    outlines={getOutlines?.response?.outlines}
                    setShowOutlines={setShowOutlines}
                    showOutlines={showOutlines}
                />
            }
        </div>
    );
};

export default TeacherCourse;