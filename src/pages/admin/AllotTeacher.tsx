import useGetAndDelete from "@/hooks/useGetAndDelete";
import axios from "axios";
import { useEffect, useState } from "react";
import Select from 'react-select';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import toast from "react-hot-toast";
import { Trash, Pencil } from "lucide-react";
import usePostAndPut from "@/hooks/usePostAndPut";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface OptionType {
    value: string;
    label: string;
}

interface Student {
    id: string;
    std_id: string;
    name: string;
    guardian_name: string;
}

interface Teacher {
    id: string;
    teach_id: string;
    name: string;
    email: string;
}

interface Course {
    id: string;
    name: string;
    description: string;
}

interface TimeSlot {
    from: string;
    to: string;
}

const AllotTeacher = () => {
    const getStudents = useGetAndDelete(axios.get);
    const getTeachers = useGetAndDelete(axios.get);
    const getCourses = useGetAndDelete(axios.get);
    const postAllotment = usePostAndPut(axios.post);
    // const updateAllotment = usePostAndPut(axios.put);
    const getStdAllotment = useGetAndDelete(axios.get);
    const deleteAllotment = useGetAndDelete(axios.delete);

    const [stdOptions, setStdOptions] = useState<OptionType[]>([]);
    const [teacherOptions, setTeacherOptions] = useState<OptionType[]>([]);
    const [courseOptions, setCourseOptions] = useState<OptionType[]>([]);

    const [selectedStudent, setSelectedStudent] = useState<OptionType | null>(null);
    const [selectedTeacher, setSelectedTeacher] = useState<OptionType | null>(null);
    const [selectedCourse, setSelectedCourse] = useState<OptionType | null>(null);
    const [classTimes, setClassTimes] = useState<TimeSlot[]>([{ from: "", to: "" }]);
    const [allotments, setAllotments] = useState<any[]>([]);
    const [editingId, setEditingId] = useState<string | null>(null);

    const getStudentsData = async () => {
        const response = await getStudents.callApi("student/get", true, false);
        const mappedOptions = response.students.map((student: Student) => ({
            value: student.id,
            label: `${student.std_id} - ${student.name}`
        }));
        setStdOptions(mappedOptions);
    };

    const getTeachersData = async () => {
        const response = await getTeachers.callApi("teacher/get", true, false);
        const mappedOptions = response.teachers.map((teacher: Teacher) => ({
            value: teacher.id,
            label: `${teacher.teach_id} - ${teacher.name}`
        }));
        setTeacherOptions(mappedOptions);
    };

    const getCoursesData = async () => {
        const response = await getCourses.callApi("course/get", true, false);
        const mappedOptions = response.course.map((course: Course) => ({
            value: course.id,
            label: course.name
        }));
        setCourseOptions(mappedOptions);
    };

    const getStdAllotmentData = async () => {
        const response = await getStdAllotment.callApi("teacher-allotment/get", true, false);
        setAllotments(response.teacherAllotment);
    };

    const handleTimeChange = (index: number, field: keyof TimeSlot, value: string) => {
        console.log(index, field, value);
        const updatedTimes = [...classTimes];
        updatedTimes[index][field] = value;
        setClassTimes(updatedTimes);
    };

    const handleAddTimeSlot = () => {
        setClassTimes([...classTimes, { from: "", to: "" }]);
    };

    const handleRemoveTimeSlot = (index: number) => {
        const updatedTimes = [...classTimes];
        updatedTimes.splice(index, 1);
        setClassTimes(updatedTimes);
    };

    const handleAllot = async () => {
        if (!selectedStudent || !selectedTeacher || !selectedCourse || classTimes.some(t => !t.from || !t.to)) {
            toast.error("Please fill in all the fields.");
            return;
        }

        const payload = {
            studentId: selectedStudent.value,
            teacherId: selectedTeacher.value,
            courseId: selectedCourse.value,
            classTimes,
        };

        if (editingId) {
            console.log(payload)
            // await updateAllotment.callApi(`teacher-allotment/update/${editingId}`, payload, true, false, true);
        } else {
            await postAllotment.callApi('teacher-allotment/allot', payload, true, false, true);
        }

        resetForm();
        getStdAllotmentData();
    };

    const resetForm = () => {
        setSelectedStudent(null);
        setSelectedTeacher(null);
        setSelectedCourse(null);
        setClassTimes([{ from: "", to: "" }]);
        setEditingId(null);
    };

    const handleDelete = async (id: string) => {
        await deleteAllotment.callApi(`teacher-allotment/delete/${id}`, true, false);
        toast.success("Allotment deleted");
        getStdAllotmentData();
    };

    const handleEdit = (allotment: any) => {

        setEditingId(allotment.id);

        setSelectedStudent({
            value: allotment.student.id,
            label: `${allotment.student.std_id} - ${allotment.student.name}`
        });

        setSelectedTeacher({
            value: allotment.teacher.id,
            label: `${allotment.teacher.teach_id} - ${allotment.teacher.name}`
        });

        setSelectedCourse({
            value: allotment.course.id,
            label: allotment.course.name
        });

        setClassTimes(
            allotment.student_class_timings.map((t: any) => ({
                id: t.id,
                from: t.preferred_time_from,
                to: t.preferred_time_to,
            }))
        );

    };

    useEffect(() => {
        getCoursesData();
        getTeachersData();
        getStudentsData();
        getStdAllotmentData();
    }, []);

    return (
        <div className="p-6 space-y-10">
            <Card className="w-full shadow-none">
                <CardHeader>
                    <CardTitle>{editingId ? "Edit Allotment" : "Allot Teacher to Student"}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <label className="block mb-1 text-sm font-medium">Select Student</label>
                        <Select options={stdOptions} value={selectedStudent} onChange={setSelectedStudent} placeholder="Search student..." isSearchable />
                    </div>
                    <div>
                        <label className="block mb-1 text-sm font-medium">Select Course</label>
                        <Select options={courseOptions} value={selectedCourse} onChange={setSelectedCourse} placeholder="Search course..." isSearchable />
                    </div>
                    <div>
                        <label className="block mb-1 text-sm font-medium">Select Teacher</label>
                        <Select options={teacherOptions} value={selectedTeacher} onChange={setSelectedTeacher} placeholder="Search teacher..." isSearchable />
                    </div>
                    <div>
                        <label className="block mb-2 text-sm font-medium">Class Times</label>
                        {classTimes.map((slot, index) => (
                            <div key={index} className="flex gap-2 items-center mb-2">
                                <Input type="time" value={slot.from} onChange={(e) => handleTimeChange(index, "from", e.target.value)} className="w-[45%]" />
                                <span className="text-gray-500">to</span>
                                <Input type="time" value={slot.to} onChange={(e) => handleTimeChange(index, "to", e.target.value)} className="w-[45%]" />
                                {classTimes.length > 1 && (
                                    <Button variant="destructive" size="icon" onClick={() => handleRemoveTimeSlot(index)}>
                                        <Trash size={16} />
                                    </Button>
                                )}
                            </div>
                        ))}
                        {
                            !editingId &&
                            <Button variant="outline" onClick={handleAddTimeSlot}>
                                Add Time Slot
                            </Button>
                        }
                    </div>

                    <div className="w-full flex justify-start gap-4">
                        <Button onClick={handleAllot}>{editingId ? "Update Allotment" : "Allot"}</Button>
                        {editingId && (
                            <Button variant="secondary" onClick={resetForm}>Cancel Edit</Button>
                        )}
                    </div>
                </CardContent>
            </Card>

            <Card className="w-full shadow-none">
                <CardHeader>
                    <CardTitle>Allotted Teachers</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Course</TableHead>
                                <TableHead>Student</TableHead>
                                <TableHead>Teacher</TableHead>
                                <TableHead>Class Timings</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {allotments?.length > 0 && allotments.map((allotment, index) => (
                                <TableRow key={index}>
                                    <TableCell>{allotment.course.name}</TableCell>
                                    <TableCell>{allotment.student.name}</TableCell>
                                    <TableCell>{allotment.teacher.name}</TableCell>
                                    <TableCell>
                                        {allotment.student_class_timings.map((time: any, i: number) => (
                                            <div key={i} className="text-sm">
                                                From: {time.preferred_time_from} - To: {time.preferred_time_to}
                                            </div>
                                        ))}
                                    </TableCell>
                                    <TableCell className="space-x-2">
                                        <Button size="icon" variant="outline" onClick={() => handleEdit(allotment)}>
                                            <Pencil size={16} />
                                        </Button>
                                        <Button size="icon" variant="destructive" onClick={() => handleDelete(allotment._id)}>
                                            <Trash size={16} />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
};

export default AllotTeacher;
