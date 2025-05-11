import SpinnerLoader from "@/components/SpinLoader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import useGetAndDelete from "@/hooks/useGetAndDelete";
import axios from "axios";
import { NotebookIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { FaChalkboardTeacher } from "react-icons/fa";
import { Link } from "react-router-dom";


interface Course {
    id: number;
    image: string;
    name: string;
    description: string;
    price: string | number;
    course_duration: string;
}


const StudentDashboard = () => {
    const defaultDashboardData = {
        courses: 0,
        classes: 0,
    };
    const [dashboardData, setDashboardData] = useState(defaultDashboardData);

    const getCourses = useGetAndDelete(axios.get);
    const getClasses = useGetAndDelete(axios.get);

    const getStudentCourses = async () => {
        const response = await getCourses.callApi("student/get-std-courses", false, false);
        setDashboardData((prev) => ({
            ...prev,
            courses: response.courses.length,
        }));
        console.log(response.courses.length);
    };


    const getStudentClasses = async () => {
        const response = await getClasses.callApi("student/classes", false, false);
        console.log(response.classes.length);
        setDashboardData((prev) => ({
            ...prev,
            classes: response.classes.length,
        }));
    };


    useEffect(() => {
        getStudentClasses()
        getStudentCourses()
    }, [])

    return (
        <div className='p-5' >
            {
                getCourses.loading || getClasses.loading ?
                    <SpinnerLoader color="black" /> :
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                            <Card className="shadow-none">
                                <CardHeader className="flex flex-row items-center gap-2">
                                    <NotebookIcon className="text-2xl text-blue-500" />
                                    <CardTitle>Enrolled Courses</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-xl font-semibold">{dashboardData.courses}</p>
                                </CardContent>
                            </Card>
                            <Card className="shadow-none">
                                <CardHeader className="flex flex-row items-center gap-2">
                                    <FaChalkboardTeacher className="text-2xl text-red-500" />
                                    <CardTitle>Classes</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-xl font-semibold">{dashboardData.classes}</p>
                                </CardContent>
                            </Card>
                        </div>

                        <div className="mt-4" >
                            <h1 className="text-xl font-bold underline mb-2"   >
                                My Courses
                            </h1>
                            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 ">
                                {
                                    getCourses?.response?.courses?.length > 0 ? (
                                        getCourses?.response?.courses?.map((course: Course) => (
                                            <Link to='/student/enrolled-courses' >
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
                                                        </div>
                                                    </div>
                                                </div>
                                            </Link>
                                        ))
                                    ) : (
                                        <div>No enrolled courses found.</div>
                                    )
                                }
                            </div>
                        </div>
                    </>
            }




        </div>
    )
}

export default StudentDashboard