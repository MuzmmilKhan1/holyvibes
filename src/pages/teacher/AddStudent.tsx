import useGetAndDelete from "@/hooks/useGetAndDelete";
import usePostAndPut from "@/hooks/usePostAndPut";
import axios from "axios";
import { useEffect, useState } from "react";
import Select from "react-select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import { Trash } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import SpinnerLoader from "@/components/SpinLoader";

interface OptionType {
    value: string;
    label: string;
}

interface ClassTiming {
    id: string;
    preferred_time_from: string;
    preferred_time_to: string;
}

interface FormData {
    selectedClass: OptionType | null;
    students: Array<{
        selectedStudent: OptionType | null;
        timings: ClassTiming[];
        selectedTimings: OptionType[];
    }>;
}

interface Class {
    id: string;
    title: string;
}

const AddStudent = () => {
    const getAllottedStudents = useGetAndDelete(axios.get);
    const getClass = useGetAndDelete(axios.get);
    const assignStudents = usePostAndPut(axios.post);
    const getStdWithClass = useGetAndDelete(axios.get);
    const deleteStdClass = useGetAndDelete(axios.delete);


    const [studentOptions, setStudentOptions] = useState<OptionType[]>([]);
    const [classOptions, setClassOptions] = useState<OptionType[]>([]);
    const [allotments, setAllotments] = useState<any[]>([]);
    const [showForm, setShowForm] = useState<boolean>(false);

    const [formData, setFormData] = useState<FormData>({
        selectedClass: null,
        students: [{ selectedStudent: null, timings: [], selectedTimings: [] }],
    });

    const getAllottedStudentsData = async () => {
        try {
            const response = await getAllottedStudents.callApi(
                "teacher-allotment/get-teacher-allotment",
                false,
                false
            );
            if (response?.teacherAllotment) {
                setAllotments(response.teacherAllotment);
                const students = response.teacherAllotment.map((allotment: any) => ({
                    id: allotment.student.id,
                    std_id: allotment.student.std_id,
                    name: allotment.student.name,
                }));
                const uniqueStudents = Array.from(
                    new Map(students.map((student: any) => [student.id, student])).values()
                );
                const mappedOptions = uniqueStudents.map((student: any) => ({
                    value: student.id,
                    label: `${student.std_id} - ${student.name}`,
                }));
                setStudentOptions(mappedOptions);
            }
        } catch (error) {
            console.error("Error fetching allotments", error);
            toast.error("Failed to load students");
        }
    };

    const getClassData = async () => {
        try {
            const response = await getClass.callApi('class/get', false, false);
            if (response?.data) {
                const mappedOptions = response.data.map((classItem: Class) => ({
                    value: classItem.id,
                    label: classItem.title,
                }));
                setClassOptions(mappedOptions);
            }
        } catch (error) {
            console.error("Error fetching classes", error);
            toast.error("Failed to load classes");
        }
    };

    const handleStudentChange = (index: number, selected: OptionType | null) => {
        setFormData(prev => {
            const newStudents = [...prev.students];
            newStudents[index].selectedStudent = selected;
            if (selected) {
                const studentAllotments = allotments.filter(a => a.student.id === selected.value);
                const timings = studentAllotments.flatMap((a: any) => a.student_class_timings || []);
                newStudents[index].timings = timings.map((t: any) => ({
                    id: t.id,
                    preferred_time_from: t.preferred_time_from,
                    preferred_time_to: t.preferred_time_to,
                }));
                newStudents[index].selectedTimings = [];
            } else {
                newStudents[index].timings = [];
                newStudents[index].selectedTimings = [];
            }
            return { ...prev, students: newStudents };
        });
    };

    const handleTimingSelection = (index: number, selected: OptionType[]) => {
        setFormData(prev => {
            const newStudents = [...prev.students];
            newStudents[index].selectedTimings = selected;
            return { ...prev, students: newStudents };
        });
    };

    const handleAddMore = () => {
        setFormData(prev => ({
            ...prev,
            students: [...prev.students, { selectedStudent: null, timings: [], selectedTimings: [] }],
        }));
    };

    const handleRemoveStudent = (index: number) => {
        setFormData(prev => {
            const newStudents = [...prev.students];
            newStudents.splice(index, 1);
            return { ...prev, students: newStudents };
        });
    };

    const handleAssignStudents = async () => {
        if (!formData.selectedClass) {
            toast.error("Please select a class");
            return;
        }

        const validStudents = formData.students.filter(s => s.selectedStudent);
        if (validStudents.length === 0) {
            toast.error("Please select at least one student");
            return;
        }

        const hasNoSelectedTimings = validStudents.some(student => student.selectedTimings.length === 0);
        if (hasNoSelectedTimings) {
            toast.error("Please select at least one class timing for each student");
            return;
        }

        const payload = {
            classId: formData.selectedClass.value,
            students: validStudents.map(student => ({
                studentId: student.selectedStudent!.value,
                classTimings: student.selectedTimings.map(timing => ({
                    id: timing.value,
                    preferred_time_from: student.timings.find(t => t.id === timing.value)!.preferred_time_from,
                    preferred_time_to: student.timings.find(t => t.id === timing.value)!.preferred_time_to,
                })),
            })),
        };

        try {
            const response = await assignStudents.callApi(
                "class/assign-students",
                payload,
                true,
                false,
                true
            );
            if (response?.status === 200) {
                toast.success("Students assigned to class successfully");
                setFormData({
                    selectedClass: null,
                    students: [{ selectedStudent: null, timings: [], selectedTimings: [] }],
                });
                getStudents();
            }
        } catch (error) {
            console.error("Error assigning students", error);
            toast.error("Failed to assign students to class");
        }
    };


    const getStudents = async () => {
        const response = await getStdWithClass.callApi('class/get-students', false, false)
        console.log(response.students)
    }


    useEffect(() => {
        getStudents();
        getClassData();
        getAllottedStudentsData();
    }, []);

    return (
        <div className="p-5 space-y-4">
            <Card className="w-full shadow-none">
                <CardHeader>
                    <div className="flex items-center justify-between" >
                        <CardTitle className="text-xl font-bold underline">
                            {
                                showForm ?
                                    "Assign Students to Class" :
                                    "Assigned Students to Classes"
                            }
                        </CardTitle>
                        <Button
                            onClick={
                                () => {
                                    setShowForm(!showForm)
                                }
                            }
                        >
                            {
                                showForm ?
                                    "Cancel" :
                                    "Assign"
                            }

                        </Button>
                    </div>
                </CardHeader>
                {
                    showForm &&
                    <CardContent className="space-y-6">
                        {formData.students.map((studentData, index) => (
                            <div key={index} className="space-y-4 border p-5 rounded-xl relative">
                                <div>
                                    <label className="block mb-1 text-sm font-medium">Select Student {index + 1}</label>
                                    <Select
                                        options={studentOptions}
                                        value={studentData.selectedStudent}
                                        onChange={(selected) => handleStudentChange(index, selected as OptionType | null)}
                                        placeholder="Select student..."
                                        isSearchable
                                        className="basic-single-select"
                                        classNamePrefix="select"
                                    />
                                </div>

                                {studentData.selectedStudent && studentData.timings.length > 0 && (
                                    <div>
                                        <label className="block mb-1 text-sm font-medium">Select Timings to Assign</label>
                                        <Select
                                            options={studentData.timings.map(timing => ({
                                                value: timing.id,
                                                label: `${timing.preferred_time_from} - ${timing.preferred_time_to}`,
                                            }))}
                                            value={studentData.selectedTimings}
                                            onChange={(selected) => handleTimingSelection(index, selected as OptionType[])}
                                            placeholder="Select timings..."
                                            isMulti
                                            isSearchable
                                            className="basic-multi-select"
                                            classNamePrefix="select"
                                        />
                                    </div>
                                )}

                                {studentData.selectedStudent && studentData.timings.length === 0 && (
                                    <p className="text-sm text-gray-500">No class timings available for this student.</p>
                                )}

                                {formData.students.length > 1 && (
                                    <Button
                                        variant="destructive"
                                        size="icon"
                                        onClick={() => handleRemoveStudent(index)}
                                    >
                                        <Trash size={16} />
                                    </Button>
                                )}
                            </div>
                        ))}

                        <Button variant="outline" onClick={handleAddMore}>
                            Add More
                        </Button>

                        <div>
                            <label className="block mb-1 text-sm font-medium">Select Class</label>
                            <Select
                                options={classOptions}
                                value={formData.selectedClass}
                                onChange={(selected) => {
                                    setFormData(prev => ({ ...prev, selectedClass: selected as OptionType | null }));
                                    console.log(selected);
                                }}
                                placeholder="Select class..."
                                isSearchable
                                className="basic-single-select"
                                classNamePrefix="select"
                            />
                        </div>

                        <div className="w-full flex justify-start">
                            <Button
                                onClick={handleAssignStudents}
                                disabled={assignStudents.loading}
                            >
                                {assignStudents.loading ? "Assigning..." : "Assign Students"}
                            </Button>
                        </div>
                    </CardContent>
                }
            </Card>


            {
                getStdWithClass.loading ?
                    <SpinnerLoader color="black" /> :
                    <Card className="w-full shadow-none ">
                        <CardHeader>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Student ID</TableHead>
                                        <TableHead>Class</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {getStdWithClass?.response?.students?.length > 0 &&
                                        getStdWithClass.response.students.map((items: any) => (
                                            <TableRow key={items.id}>
                                                <TableCell>{items?.student?.std_id}</TableCell>
                                                <TableCell>{items?.class.title}</TableCell>
                                                <TableCell>
                                                    {
                                                        deleteStdClass.loading ?
                                                            <Button
                                                                variant='destructive'
                                                                disabled={true}
                                                            >
                                                                Remove
                                                            </Button> :
                                                            <Button
                                                                variant='destructive'
                                                                onClick={
                                                                    async () => {
                                                                        await deleteStdClass.callApi(`class/remove-std/${items.classID}/${items.student.id}/${items.id}`, true, false)
                                                                        await getStudents();
                                                                    }
                                                                }
                                                            >
                                                                Remove
                                                            </Button>
                                                    }
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
            }

        </div>
    );
};

export default AddStudent;