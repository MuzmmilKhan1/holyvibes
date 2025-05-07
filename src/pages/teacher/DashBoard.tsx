import useGetAndDelete from "@/hooks/useGetAndDelete";
import axios from "axios";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FaChalkboardTeacher, FaBook, FaUsers, FaFileAlt } from "react-icons/fa";
import SpinnerLoader from "@/components/SpinLoader";

const DashBoard = () => {
    const defaultDashboardData = {
        classes: 0,
        enrolledCourses: 0,
        allotedStudents: 0,
        reports: [],
    };
    const [dashboardData, setDashboardData] = useState(defaultDashboardData);

    const getCourse = useGetAndDelete(axios.get);
    const getClass = useGetAndDelete(axios.get);
    const getStdPerformance = useGetAndDelete(axios.get);
    const getAllottedStudents = useGetAndDelete(axios.get);

    const getCourseData = async () => {
        try {
            const response = await getCourse.callApi("teacher/get-teacher-course", false, false);
            setDashboardData((prev) => ({
                ...prev,
                enrolledCourses: response.course.length,
            }));
        } catch (error) {
            console.error("Error fetching courses", error);
        }
    };

    const getClassData = async () => {
        try {
            const response = await getClass.callApi("class/get", false, false);
            setDashboardData((prev) => ({
                ...prev,
                classes: response.data.length,
            }));
        } catch (error) {
            console.error("Error fetching classes", error);
        }
    };

    const getAllottedStudentsData = async () => {
        try {
            const response = await getAllottedStudents.callApi(
                "teacher-allotment/get-teacher-allotment",
                false,
                false
            );
            setDashboardData((prev) => ({
                ...prev,
                allotedStudents: response.teacherAllotment.length,
            }));
        } catch (error) {
            console.error("Error fetching allotments", error);
        }
    };

    const getStdPerformanceData = async () => {
        try {
            const response = await getStdPerformance.callApi(
                "teacher/get-std-performance",
                false,
                false
            );
            setDashboardData((prev) => ({
                ...prev,
                reports: response.data || [],
            }));
        } catch (error) {
            console.error("Error fetching performance", error);
        }
    };

    useEffect(() => {
        getClassData();
        getCourseData();
        getStdPerformanceData();
        getAllottedStudentsData();
    }, []);

    return (
        <div className="p-5 min-h-auto">
            {
                getCourse.loading || getClass.loading || getAllottedStudents.loading || getStdPerformance.loading ?
                    <SpinnerLoader color="black" /> :
                    <>
                        <h1 className="text-xl font-bold underline mb-4" >
                            Dashboard
                        </h1>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
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
                                    <CardTitle>Enrolled Courses</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-xl font-semibold">{dashboardData.enrolledCourses}</p>
                                </CardContent>
                            </Card>

                            <Card className="shadow-none">
                                <CardHeader className="flex flex-row items-center gap-2">
                                    <FaUsers className="text-2xl text-purple-500" />
                                    <CardTitle>Allotted Students</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-xl font-semibold">{dashboardData.allotedStudents}</p>
                                </CardContent>
                            </Card>

                            <Card className="shadow-none">
                                <CardHeader className="flex flex-row items-center gap-2">
                                    <FaFileAlt className="text-2xl text-orange-500" />
                                    <CardTitle>Reports</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-xl font-semibold">{dashboardData.reports.length}</p>
                                </CardContent>
                            </Card>
                        </div>
                    </>
            }
        </div>
    );
};

export default DashBoard;