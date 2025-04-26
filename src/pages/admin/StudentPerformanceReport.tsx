import useGetAndDelete from "@/hooks/useGetAndDelete";
import usePostAndPut from "@/hooks/usePostAndPut";
import axios from "axios";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Select from "react-select";
import toast from "react-hot-toast";

interface OptionType {
    value: string;
    label: string;
}

const StudentPerformanceReport = () => {
    const [formData, setFormData] = useState({
        id: 0,
        classId: '',
        studentId: '',
        teacherId: '',
        courseId: '',
        attendance: '',
        testRemarks: '',
        classParticipation: '',
        suggestions: '',
    });

    const [isEditing, setIsEditing] = useState(false);
    const [studentOptions, setStudentOptions] = useState<OptionType[]>([]);
    const [teacherOptions, setTeacherOptions] = useState<OptionType[]>([]);
    const [classOptions, setClassOptions] = useState<OptionType[]>([]);
    const [courseOptions, setCourseOptions] = useState<OptionType[]>([]);

    const getStdPerformance = useGetAndDelete(axios.get);
    const deletePerformance = useGetAndDelete(axios.delete);
    const updatePerformance = usePostAndPut(axios.put);
    const getCourse = useGetAndDelete(axios.get);
    const getClass = useGetAndDelete(axios.get);
    const getStd = useGetAndDelete(axios.get);
    const getTeacher = useGetAndDelete(axios.get);

    const getStdPerformanceData = async () => {
        try {
            const response = await getStdPerformance.callApi('student-performance/get', false, false);
            if (!response?.data) {
                toast.error("Failed to load student performance data");
            }
        } catch (error) {
            console.error("Error fetching student performance", error);
            toast.error("Error fetching student performance");
        }
    };

    const handleEdit = (performance: any) => {
        setIsEditing(true);
        setFormData({
            id: performance.id,
            classId: performance.class?.id?.toString() || '',
            studentId: performance.student.id.toString(),
            teacherId: performance.teacher.id?.toString() || '',
            courseId: performance.course.id.toString(),
            attendance: performance.attendance || '',
            testRemarks: performance.test_remarks || '',
            classParticipation: performance.participation || '',
            suggestions: performance.suggestions || '',
        });
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSelectChange = (name: string, selected: OptionType | null) => {
        setFormData(prev => ({ ...prev, [name]: selected ? selected.value : '' }));
    };

    const getCourses = async () => {
        try {
            const response = await getCourse.callApi("course/get", false, false);
            if (response?.course) {
                const options = response.course.map((course: any) => ({
                    value: course.id.toString(),
                    label: course.name
                }));
                setCourseOptions(options);
            }
        } catch (error) {
            console.error("Error fetching courses", error);
            toast.error("Error fetching courses");
        }
    };

    const getAllClasses = async () => {
        try {
            const response = await getClass.callApi("class/get-all", true, false);
            if (response?.data) {
                const options = response.data.map((classItem: any) => ({
                    value: classItem.id.toString(),
                    label: classItem.title
                }));
                setClassOptions(options);
            }
        } catch (error) {
            console.error("Error fetching classes", error);
            toast.error("Error fetching classes");
        }
    };

    const getStudents = async () => {
        try {
            const response = await getStd.callApi("student/get", true, false);
            if (response?.students) {
                const options = response.students.map((student: any) => ({
                    value: student.id.toString(),
                    label: `${student.std_id} - ${student.name}`
                }));
                setStudentOptions(options);
            }
        } catch (error) {
            console.error("Error fetching students", error);
            toast.error("Error fetching students");
        }
    };

    const getRequestedTeacher = async () => {
        try {
            const response = await getTeacher.callApi("teacher/get", false, false);
            if (response?.teachers) {
                const options = response.teachers.map((teacher: any) => ({
                    value: teacher.id.toString(),
                    label: `${teacher.teach_id} - ${teacher.name}`
                }));
                setTeacherOptions(options);
            }
        } catch (error) {
            console.error("Error fetching teachers", error);
            toast.error("Error fetching teachers");
        }
    };

    const handleDelete = async (id: string) => {
        try {
            await deletePerformance.callApi(
                `student-performance/delete/${id}`,
                false,
                false
            );
            toast.success("Performance deleted successfully");
            await getStdPerformanceData();
        } catch (error) {
            console.error("Error deleting performance", error);
            toast.error("Error deleting performance");
        }
    };

    const validateForm = () => {
        if (!formData.studentId) {
            toast.error("Student is required");
            return false;
        }
        if (!formData.teacherId) {
            toast.error("Teacher is required");
            return false;
        }
        if (!formData.classId) {
            toast.error("Class is required");
            return false;
        }
        if (!formData.courseId) {
            toast.error("Course is required");
            return false;
        }
        if (!formData.attendance.trim()) {
            toast.error("Attendance is required");
            return false;
        }
        return true;
    };

    const handleUpdate = async () => {
        if (!validateForm()) {
            return;
        }

        try {
            const payload = {
                id: formData.id,
                classId: formData.classId,
                studentId: formData.studentId,
                teacherId: formData.teacherId,
                courseId: formData.courseId,
                attendance: formData.attendance,
                test_remarks: formData.testRemarks,
                participation: formData.classParticipation,
                suggestions: formData.suggestions
            };

            const response = await updatePerformance.callApi(
                `student-performance/edit`,
                payload,
                true,
                false,
                true
            );
            if (response?.status === 200) {
                toast.success("Performance updated successfully");
                setIsEditing(false);
                setFormData({
                    id: 0,
                    classId: '',
                    studentId: '',
                    teacherId: '',
                    courseId: '',
                    attendance: '',
                    testRemarks: '',
                    classParticipation: '',
                    suggestions: '',
                });
                await getStdPerformanceData();
            } else {
                toast.error("Failed to update performance");
            }
        } catch (error) {
            console.error("Error updating performance", error);
            toast.error("Error updating performance");
        }
    };

    useEffect(() => {
        getCourses();
        getStudents();
        getAllClasses();
        getRequestedTeacher();
        getStdPerformanceData();
    }, []);

    return (
        <div className='p-6'>
            {isEditing ? (
                <Card className="mx-auto shadow-none">
                    <CardHeader>
                        <CardTitle className="text-xl font-bold underline">
                            Edit Student Performance
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <label className="block mb-1 text-sm font-medium">Select Student</label>
                            <Select
                                options={studentOptions}
                                value={studentOptions.find(option => option.value === formData.studentId) || null}
                                onChange={(selected) => handleSelectChange('studentId', selected as OptionType | null)}
                                placeholder="Select student..."
                                isSearchable
                                className="basic-single-select"
                                classNamePrefix="select"
                            />
                        </div>
                        <div>
                            <label className="block mb-1 text-sm font-medium">Select Teacher</label>
                            <Select
                                options={teacherOptions}
                                value={teacherOptions.find(option => option.value === formData.teacherId) || null}
                                onChange={(selected) => handleSelectChange('teacherId', selected as OptionType | null)}
                                placeholder="Select teacher..."
                                isSearchable
                                className="basic-single-select"
                                classNamePrefix="select"
                            />
                        </div>
                        <div>
                            <label className="block mb-1 text-sm font-medium">Select Class</label>
                            <Select
                                options={classOptions}
                                value={classOptions.find(option => option.value === formData.classId) || null}
                                onChange={(selected) => handleSelectChange('classId', selected as OptionType | null)}
                                placeholder="Select class..."
                                isSearchable
                                className="basic-single-select"
                                classNamePrefix="select"
                            />
                        </div>
                        <div>
                            <label className="block mb-1 text-sm font-medium">Select Course</label>
                            <Select
                                options={courseOptions}
                                value={courseOptions.find(option => option.value === formData.courseId) || null}
                                onChange={(selected) => handleSelectChange('courseId', selected as OptionType | null)}
                                placeholder="Select course..."
                                isSearchable
                                className="basic-single-select"
                                classNamePrefix="select"
                            />
                        </div>
                        <div>
                            <label className="block mb-1 text-sm font-medium">Attendance</label>
                            <Input
                                name="attendance"
                                value={formData.attendance}
                                onChange={handleInputChange}
                                placeholder="Attendance"
                            />
                        </div>
                        <div>
                            <label className="block mb-1 text-sm font-medium">Test Remarks</label>
                            <Input
                                name="testRemarks"
                                value={formData.testRemarks}
                                onChange={handleInputChange}
                                placeholder="Test Remarks"
                            />
                        </div>
                        <div>
                            <label className="block mb-1 text-sm font-medium">Class Participation</label>
                            <Input
                                name="classParticipation"
                                value={formData.classParticipation}
                                onChange={handleInputChange}
                                placeholder="Class Participation"
                            />
                        </div>
                        <div>
                            <label className="block mb-1 text-sm font-medium">Suggestions</label>
                            <Input
                                name="suggestions"
                                value={formData.suggestions}
                                onChange={handleInputChange}
                                placeholder="Suggestions"
                            />
                        </div>
                        <div className="flex gap-2">
                            <Button
                                onClick={handleUpdate}
                                disabled={updatePerformance.loading}
                            >
                                {updatePerformance.loading ? "Updating..." : "Update"}
                            </Button>
                            <Button
                                variant="destructive"
                                onClick={() => setIsEditing(false)}
                            >
                                Cancel
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            ) : (
                <Card className="mx-auto shadow-none">
                    <CardHeader className="text-xl font-bold underline">
                        <CardTitle>
                            Student Performance Report
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Student ID</TableHead>
                                    <TableHead>Teacher ID</TableHead>
                                    <TableHead>Course</TableHead>
                                    <TableHead>Class</TableHead>
                                    <TableHead>Attendance</TableHead>
                                    <TableHead>Oral/Written Test Remarks</TableHead>
                                    <TableHead>Participation</TableHead>
                                    <TableHead>Suggestions</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {getStdPerformance?.response?.data?.length > 0 ? (
                                    getStdPerformance.response?.data.map((items: any) => (
                                        <TableRow key={items.id}>
                                            <TableCell>{items.student.std_id}</TableCell>
                                            <TableCell>{items.teacher.teach_id}</TableCell>
                                            <TableCell className="text-wrap">{items.course.name}</TableCell>
                                            <TableCell className="text-wrap">{items?.class?.title || 'N/A'}</TableCell>
                                            <TableCell>{items.attendance}</TableCell>
                                            <TableCell className="text-wrap">{items.test_remarks || 'N/A'}</TableCell>
                                            <TableCell className="text-wrap">{items.participation || 'N/A'}</TableCell>
                                            <TableCell className="text-wrap">{items.suggestions || 'N/A'}</TableCell>
                                            <TableCell>
                                                <Button onClick={() => handleEdit(items)}>
                                                    Edit
                                                </Button>
                                                <Button
                                                    className='ml-2'
                                                    variant='destructive'
                                                    onClick={() => handleDelete(items.id)}
                                                >
                                                    Delete
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={9} className="text-center">
                                            No performance records found.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            )}
        </div>
    );
};

export default StudentPerformanceReport;