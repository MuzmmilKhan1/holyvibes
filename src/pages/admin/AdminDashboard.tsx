import useGetAndDelete from "@/hooks/useGetAndDelete";
import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FaChalkboardTeacher, FaBook, FaUsers, FaUserTie, FaCalendarAlt } from "react-icons/fa";
import SpinnerLoader from "@/components/SpinLoader";
import { Link } from "react-router-dom";
type Course = {
    id: number | null;
    image: string;
    name: string;
    description: string;
    price: string | number;
    course_duration: string;
};

const AdminDashboard = () => {
    const defaultDashboardData = {
        classes: 0,
        courses: 0,
        students: 0,
        teachers: 0,
        events: 0,
    };
    const [dashboardData, setDashboardData] = useState(defaultDashboardData);

    const getClass = useGetAndDelete(axios.get);
    const getCourse = useGetAndDelete(axios.get);
    const getStd = useGetAndDelete(axios.get);
    const getTeacher = useGetAndDelete(axios.get);
    const getEvent = useGetAndDelete(axios.get);

    const getAllClasses = async () => {
        try {
            const response = await getClass.callApi("class/get-all", true, false);
            if (response?.data) {
                setDashboardData((prev) => ({
                    ...prev,
                    classes: response.data.length,
                }));
            } else {
                toast.error("Failed to load classes");
            }
        } catch (error) {
            console.error("Error fetching classes", error);
            toast.error("Error fetching classes");
        }
    };

    const getCourses = async () => {
        try {
            const response = await getCourse.callApi("course/get", false, false);
            setDashboardData((prev) => ({
                ...prev,
                courses: response.course.length,
            }));
        } catch (error) {
            console.error("Error fetching courses", error);
            toast.error("Error fetching courses");
        }
    };

    const getStudents = async () => {
        try {
            const response = await getStd.callApi("student/get", true, false);
            setDashboardData((prev) => ({
                ...prev,
                students: response.students.length,
            }));
        } catch (error) {
            console.error("Error fetching students", error);
            toast.error("Error fetching students");
        }
    };

    const getRequestedTeacher = async () => {
        try {
            const response = await getTeacher.callApi("teacher/get", false, false);
            setDashboardData((prev) => ({
                ...prev,
                teachers: response.teachers.length,
            }));
        } catch (error) {
            console.error("Error fetching teachers", error);
            toast.error("Error fetching teachers");
        }
    };

    const fetchEvents = async () => {
        try {
            const response = await getEvent.callApi("event/get", true, false);
            setDashboardData((prev) => ({
                ...prev,
                events: response.event.length,
            }));
        } catch (error) {
            console.error("Error fetching events", error);
            toast.error("Error fetching events");
        }
    };

    useEffect(() => {
        getCourses();
        fetchEvents();
        getStudents();
        getAllClasses();
        getRequestedTeacher();
    }, []);

    return (
        <div className="p-5 min-h-auto">
            {
                getClass.loading || getCourse.loading || getStd.loading || getTeacher.loading || getEvent.loading ?
                    <SpinnerLoader color="black" /> :
                    <div className="space-y-5" >
                        <div>
                            <h1 className="text-xl font-bold underline mb-4" >
                                Dashboard
                            </h1>
                            <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                                <Card className="shadow-none">
                                    <CardHeader className="flex flex-row items-center gap-2">
                                        <FaChalkboardTeacher className="text-2xl text-blue-500" />
                                        <CardTitle>Classes</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-xl font-semibold">{dashboardData.classes}</p>
                                    </CardContent>
                                </Card>

                                <Card className="shadow-none">
                                    <CardHeader className="flex flex-row items-center gap-2">
                                        <FaBook className="text-2xl text-green-500" />
                                        <CardTitle>Courses</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-xl font-semibold">{dashboardData.courses}</p>
                                    </CardContent>
                                </Card>

                                <Card className="shadow-none">
                                    <CardHeader className="flex flex-row items-center gap-2">
                                        <FaUsers className="text-2xl text-purple-500" />
                                        <CardTitle>Students</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-xl font-semibold">{dashboardData.students}</p>
                                    </CardContent>
                                </Card>

                                <Card className="shadow-none">
                                    <CardHeader className="flex flex-row items-center gap-2">
                                        <FaUserTie className="text-2xl text-orange-500" />
                                        <CardTitle>Teachers</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-xl font-semibold">{dashboardData.teachers}</p>
                                    </CardContent>
                                </Card>

                                <Card className="shadow-none">
                                    <CardHeader className="flex flex-row items-center gap-2">
                                        <FaCalendarAlt className="text-2xl text-red-500" />
                                        <CardTitle>Events</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-xl font-semibold">{dashboardData.events}</p>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                        <div>
                            <h1 className="text-xl font-bold underline mb-4" >
                                Courses
                            </h1>
                            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                                {getCourse?.response?.course?.map((course: Course) => (
                                    <Link to='/admin/course' >
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
                                                    <div className="flex flex-row items-center justify-between px-1 w-full">
                                                        <span className="text-gray-600 font-semibold">${course.price}</span>
                                                        <span className="text-sm text-gray-500">{course.course_duration}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>

                        </div>
                    </div>
            }
        </div>
    );
};

export default AdminDashboard;