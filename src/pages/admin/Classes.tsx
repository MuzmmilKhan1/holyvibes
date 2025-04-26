import useGetAndDelete from "@/hooks/useGetAndDelete";
import axios from "axios";
import { useEffect, useState } from "react";
import {
    Table, TableBody, TableCaption, TableCell,
    TableHead, TableHeader, TableRow
} from "@/components/ui/table";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import SpinnerLoader from "@/components/SpinLoader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import usePostAndPut from "@/hooks/usePostAndPut";
import toast from "react-hot-toast";

const Classes = () => {
    const getClass = useGetAndDelete(axios.get);
    const putClass = usePostAndPut(axios.put);
    const deleteClass = useGetAndDelete(axios.delete);

    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        id: "",
        title: "",
        link: "",
        classTime: {
            id: 0,
            from: "",
            to: ""
        }
    });

    const getAllClasses = async () => {
        try {
            const response = await getClass.callApi("class/get-all", true, false);
            if (!response?.data) {
                toast.error("Failed to load classes");
            }
        } catch (error) {
            console.error("Error fetching classes", error);
            toast.error("Error fetching classes");
        }
    };

    const handleEditClick = (classData: any) => {
        setIsEditing(true);
        setFormData({
            id: classData.id,
            title: classData.title || "",
            link: classData.classLink || "",
            classTime: classData.teacher_class_timings?.[0] ? {
                id: classData.teacher_class_timings[0].id || 0,
                from: classData.teacher_class_timings[0].preferred_time_from || "",
                to: classData.teacher_class_timings[0].preferred_time_to || ""
            } : {
                id: 0,
                from: "",
                to: ""
            }
        });
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        if (name === "from" || name === "to") {
            setFormData(prev => ({
                ...prev,
                classTime: {
                    ...prev.classTime,
                    [name]: value
                }
            }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const validateForm = () => {
        if (!formData.title.trim()) {
            toast.error("Title is required");
            return false;
        }
        if (formData.title.length > 255) {
            toast.error("Title must not exceed 255 characters");
            return false;
        }
        if (!formData.link.trim()) {
            toast.error("Class link is required");
            return false;
        }
        if (formData.link.length > 255) {
            toast.error("Class link must not exceed 255 characters");
            return false;
        }
        if (!formData.classTime.from || !formData.classTime.to) {
            toast.error("Class timings (from and to) are required");
            return false;
        }
        if (formData.classTime.id <= 0) {
            toast.error("Invalid class timing ID");
            return false;
        }
        return true;
    };

    const editClass = async () => {
        if (!validateForm()) {
            return;
        }

        try {
            const payload = {
                id: formData.id,
                title: formData.title,
                link: formData.link,
                classTime: {
                    id: formData.classTime.id,
                    from: formData.classTime.from,
                    to: formData.classTime.to
                }
            };

            const response = await putClass.callApi(`class/edit/${formData.id}`, payload, true, false, true);
            if (response?.status === 200) {
                toast.success("Class updated successfully");
                setIsEditing(false);
                await getAllClasses();
            } else {
                toast.error("Failed to update class");
            }
        } catch (error) {
            console.error("Error updating class", error);
            toast.error("Error updating class");
        }
    };

    useEffect(() => {
        getAllClasses();
    }, []);

    return (
        <div className="p-6">
            {
                getClass.loading ? (
                    <SpinnerLoader color="black" />
                ) : !isEditing ? (
                    getClass?.response?.data?.length > 0 ? (
                        <Card className="shadow-none">
                            <CardHeader>
                                <CardTitle className="text-xl font-bold underline">Classes</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Table>
                                    <TableCaption>List of all classes</TableCaption>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>TeacherID</TableHead>
                                            <TableHead>Title</TableHead>
                                            <TableHead>Class Link</TableHead>
                                            <TableHead>Class Time</TableHead>
                                            <TableHead>Action</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {getClass?.response?.data?.map((c: any) => (
                                            <TableRow key={c?.id}>
                                                <TableCell>{c?.teacherID || "N/A"}</TableCell>
                                                <TableCell>{c?.title}</TableCell>
                                                <TableCell>{c?.classLink || 'N/A'}</TableCell>
                                                <TableCell>
                                                    {c.teacher_class_timings?.length > 0 ? (
                                                        c.teacher_class_timings.map((ct: any, idx: number) => (
                                                            <div key={idx}>
                                                                {ct.preferred_time_from} - {ct.preferred_time_to}
                                                            </div>
                                                        ))
                                                    ) : (
                                                        "No timings"
                                                    )}
                                                </TableCell>
                                                <TableCell className="space-x-2">
                                                    <Button
                                                        onClick={() => handleEditClick(c)}
                                                        variant='outline'
                                                    >
                                                        Edit
                                                    </Button>
                                                    <Button
                                                     onClick={async () => {
                                                        await deleteClass.callApi(`class/delete/${c.id}`, true, false)
                                                        getAllClasses();
                                                    }}

                                                    variant='destructive'>
                                                        Delete
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    ) : (
                        <p>No classes found.</p>
                    )
                ) : (
                    <Card className="shadow-none">
                        <CardHeader>
                            <CardTitle className="text-xl font-bold underline">Edit Class</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-col gap-4">
                                <Input
                                    name="title"
                                    value={formData.title}
                                    onChange={handleInputChange}
                                    placeholder="Title"
                                    maxLength={255}
                                />
                                <Input
                                    name="link"
                                    value={formData.link}
                                    onChange={handleInputChange}
                                    placeholder="Class Link"
                                    maxLength={255}
                                />
                                <div className="flex gap-4">
                                    <Input
                                        name="from"
                                        type="time"
                                        value={formData.classTime.from}
                                        onChange={handleInputChange}
                                        placeholder="From"
                                    />
                                    <Input
                                        name="to"
                                        type="time"
                                        value={formData.classTime.to}
                                        onChange={handleInputChange}
                                        placeholder="To"
                                    />
                                </div>
                            </div>
                            <div className="mt-4 flex gap-2">
                                <Button
                                    onClick={editClass}
                                    disabled={putClass.loading}
                                >
                                    {putClass.loading ? "Saving..." : "Save"}
                                </Button>
                                <Button
                                    variant="destructive"
                                    onClick={() => {
                                        setIsEditing(false);
                                    }}
                                >
                                    Cancel
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                )
            }
        </div>
    );
};

export default Classes;