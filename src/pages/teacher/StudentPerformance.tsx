'use client'

import { useEffect, useState } from 'react'
import Select from 'react-select'
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import useGetAndDelete from '@/hooks/useGetAndDelete'
import axios from 'axios'
import usePostAndPut from '@/hooks/usePostAndPut'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import SpinnerLoader from '@/components/SpinLoader'

// Types
interface Option {
    value: string
    label: string
}

interface Allotment {
    student: {
        id: string
        std_id: string
    }
}

interface Course {
    id: string
    courseName: string
}

interface StudentApiResponse {
    teacherAllotment: Allotment[]
}

interface CourseApiResponse {
    course: Course[]
}

const StudentPerformance = () => {
    const [formData, setFormData] = useState({
        id: 0,
        classId: '',
        studentId: '',
        courseId: '',
        attendance: '',
        testRemarks: '',
        classParticipation: '',
        suggestions: '',
    })

    const [isEditing, setIsEditing] = useState(false)
    const [studentOptions, setStudentOptions] = useState<Option[]>([])
    const [courseOptions, setCourseOptions] = useState<Option[]>([])
    const [classOptions, setClassOptions] = useState<Option[]>([])

    const getAllottedStudents = useGetAndDelete(axios.get)
    const getCourses = useGetAndDelete(axios.get)
    const getStdPerformance = useGetAndDelete(axios.get)
    const postPerformance = usePostAndPut(axios.post)
    const deletePerformance = useGetAndDelete(axios.delete)
    const getClass = useGetAndDelete(axios.get)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleStudentChange = (selected: Option | null) => {
        setFormData({ ...formData, studentId: selected ? selected.value : '' })
    }

    const handleCourseChange = (selected: Option | null) => {
        setFormData({ ...formData, courseId: selected ? selected.value : '' })
    }

    const handleClassChange = (selected: Option | null) => {
        setFormData({ ...formData, classId: selected ? selected.value : '' })
    }

    const getAllottedStudentsData = async (): Promise<void> => {
        try {
            const response: StudentApiResponse = await getAllottedStudents.callApi(
                "teacher-allotment/get-teacher-allotment",
                false,
                false
            );
            const uniqueStudentsMap: Map<number, Option> = new Map();
            response.teacherAllotment.forEach((allotment) => {
                const studentId: number = Number(allotment.student.id);
                const studentStdId: string = allotment.student.std_id;
                if (!uniqueStudentsMap.has(studentId)) {
                    uniqueStudentsMap.set(studentId, {
                        value: studentId.toString(),
                        label: studentStdId,
                    });
                }
            });
            const options: Option[] = Array.from(uniqueStudentsMap.values());
            console.log(response.teacherAllotment);
            setStudentOptions(options);
        } catch (error) {
            console.error("Error fetching allotments", error);
        }
    };


    const getCourseData = async () => {
        try {
            const response: CourseApiResponse = await getCourses.callApi(
                "teacher/get-teacher-course",
                false,
                false
            )
            const options = response.course.map((course: any) => ({
                value: course.course.id,
                label: course.course.name,
            }))
            setCourseOptions(options)
        } catch (error) {
            console.error("Error fetching courses", error)
        }
    }

    const getStdPerformanceData = async () => {
        const response = await getStdPerformance.callApi('teacher/get-std-performance', false, false)
        console.log(response)
    }

    const getClassData = async () => {
        const response = await getClass.callApi('class/get', false, false);
        const options = response.data.map((classes: any) => ({
            value: classes.id,
            label: classes.title,
        }))
        setClassOptions(options)
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            await postPerformance.callApi(
                'student-performance/add-edit',
                formData,
                false,
                false,
                true
            )
            resetForm()
            getStdPerformanceData()
        } catch (error) {
            console.error("Error submitting performance", error)
        }
    }

    const handleEdit = (performance: any) => {
        setIsEditing(true)
        setFormData({
            id: performance.id,
            classId: performance.class?.id || '',
            studentId: performance.student.id,
            courseId: performance.course.id,
            attendance: performance.attendance,
            testRemarks: performance.test_remarks,
            classParticipation: performance.participation,
            suggestions: performance.suggestions || '',
        })
    }

    const handleDelete = async (id: string) => {
        try {
            await deletePerformance.callApi(
                `student-performance/delete/${id}`,
                false,
                false
            )
            getStdPerformanceData()
        } catch (error) {
            console.error("Error deleting performance", error)
        }
    }

    const resetForm = () => {
        setFormData({
            id: 0,
            classId: '',
            studentId: '',
            courseId: '',
            attendance: '',
            testRemarks: '',
            classParticipation: '',
            suggestions: '',
        })
        setIsEditing(false)
    }

    useEffect(() => {
        getClassData()
        getCourseData()
        getStdPerformanceData()
        getAllottedStudentsData()
    }, [])

    return (
        <div className="p-5 space-y-5">
            <Card className="mx-auto shadow-none">
                <CardHeader className="text-xl font-bold underline">
                    <CardTitle>
                        Student Performance Report
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <Label htmlFor="courseId">Course</Label>
                            <Select
                                id="courseId"
                                options={courseOptions}
                                onChange={handleCourseChange}
                                value={courseOptions.find(option => option.value === formData.courseId)}
                                placeholder="Select course"
                            />
                        </div>

                        <div>
                            <Label htmlFor="studentId">Student</Label>
                            <Select
                                id="studentId"
                                options={studentOptions}
                                onChange={handleStudentChange}
                                value={studentOptions.find(option => option.value === formData.studentId)}
                                placeholder="Select student ID"
                            />
                        </div>

                        <div>
                            <Label htmlFor="classId">Class</Label>
                            <Select
                                id="classId"
                                options={classOptions}
                                onChange={handleClassChange}
                                value={classOptions.find(option => option.value === formData.classId)}
                                placeholder="Select class"
                            />
                        </div>

                        <div>
                            <Label htmlFor="attendance">Attendance</Label>
                            <Input
                                id="attendance"
                                name="attendance"
                                value={formData.attendance}
                                onChange={handleChange}
                                placeholder="e.g. 85%"
                                required
                            />
                        </div>

                        <div>
                            <Label htmlFor="testRemarks">Oral/Written Test Remarks</Label>
                            <Textarea
                                id="testRemarks"
                                name="testRemarks"
                                value={formData.testRemarks}
                                onChange={handleChange}
                                placeholder="Remarks on test performance"
                                required
                            />
                        </div>

                        <div>
                            <Label htmlFor="classParticipation">Class Participation</Label>
                            <Textarea
                                id="classParticipation"
                                name="classParticipation"
                                value={formData.classParticipation}
                                onChange={handleChange}
                                placeholder="Comment on engagement in class"
                                required
                            />
                        </div>

                        <div>
                            <Label htmlFor="suggestions">Suggestions for Improvement</Label>
                            <Textarea
                                id="suggestions"
                                name="suggestions"
                                value={formData.suggestions}
                                onChange={handleChange}
                                placeholder="Areas where the student can improve"
                            />
                        </div>

                        <div className="flex w-full items-start space-x-2">
                            <Button type="submit">
                                {isEditing ? 'Update Report' : 'Submit Report'}
                            </Button>
                            {isEditing && (
                                <Button type="button" variant="outline" onClick={resetForm}>
                                    Cancel
                                </Button>
                            )}
                        </div>
                    </form>
                </CardContent>
            </Card>

            {
                getStdPerformance.loading ?
                    <SpinnerLoader color='black' /> :
                    <Card className="mx-auto shadow-none">
                        <CardHeader className="text-xl font-bold underline">
                            <CardTitle>
                                Student Performance Table
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Student ID</TableHead>
                                        <TableHead>Course</TableHead>
                                        <TableHead>Attendance</TableHead>
                                        <TableHead>Class</TableHead>
                                        <TableHead>Oral/Written Test Remarks</TableHead>
                                        <TableHead>Participation</TableHead>
                                        <TableHead>Suggestions</TableHead>
                                        <TableHead>Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {getStdPerformance?.response?.data?.length > 0 &&
                                        getStdPerformance.response?.data.map((items: any) => (
                                            <TableRow key={items.id}>
                                                <TableCell>{items.student.std_id}</TableCell>
                                                <TableCell>{items.course.name}</TableCell>
                                                <TableCell>{items.attendance}</TableCell>
                                                <TableCell className="text-wrap">{items?.class?.title || 'N/A'}</TableCell>
                                                <TableCell>{items.test_remarks || 'N/A'}</TableCell>
                                                <TableCell>{items.participation || 'N/A'}</TableCell>
                                                <TableCell>{items.suggestions || 'N/A'}</TableCell>
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
                                        ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
            }

        </div>
    )
}

export default StudentPerformance