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

const Classes = () => {
    const getClass = useGetAndDelete(axios.get);
    const getClassData = useGetAndDelete(axios.get);
    const putClass = usePostAndPut(axios.put);


    const [selectedClass, setSelectedClass] = useState<any>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        id: "",
        title: "",
        description: "",
        class_link: "",
        total_seats: "",
        filled_seats: ""
    });

    const getAllClasses = async () => {
        await getClass.callApi("class/get-all", true, false);
    };

    const getSingleClassData = async (id: string) => {
        const response = await getClassData.callApi(`class/get/single-class-data/${id}`, true, false);
        const data = response?.class;
        setSelectedClass(data);
        setIsEditing(false);
        setFormData({
            id: data.id,
            title: data?.title || "",
            description: data?.description || "",
            class_link: data?.classLink || "",
            total_seats: data?.total_seats || "",
            filled_seats: data?.filled_seats || "",
        });
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const editClass = async () => {
        const response = await putClass.callApi(`class/edit`, formData, true, false, true)
        if (response.status == 200) {
            setIsEditing(false);
            setSelectedClass(null);
            getAllClasses()
        }
    }

    function shortenSentence(sentence: string, wordLimit = 15) {
        const words = sentence.trim().split(/\s+/);
        if (words.length <= wordLimit) {
            return sentence;
        }
        return words.slice(0, wordLimit).join(' ') + '...';
    }

    useEffect(() => {
        getAllClasses();
    }, []);

    return (
        <div className="p-6">
            {
                getClass.loading ? (
                    <SpinnerLoader color="black" />
                ) : !selectedClass ? (
                    getClass?.response?.data?.length > 0 &&
                    <Card className="shadow-none">
                        <CardHeader>
                            <CardTitle className="text-xl font-bold underline ">Classes</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableCaption>List of all classes</TableCaption>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Title</TableHead>
                                        <TableHead>Description</TableHead>
                                        <TableHead>Available Seats</TableHead>
                                        <TableHead>Occupied Seats</TableHead>
                                        <TableHead>Class Link</TableHead>
                                        <TableHead>Action</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {getClass?.response?.data?.map((c: any) => (
                                        <TableRow key={c?.id}>
                                            <TableCell>{c?.title}</TableCell>
                                            <TableCell >{shortenSentence(c.description)}</TableCell>
                                            <TableCell>{c?.total_seats || 0}</TableCell>
                                            <TableCell>{c?.filled_seats || 0}</TableCell>
                                            <TableCell>{c?.classLink || "N/A"}</TableCell>
                                            <TableCell>
                                                <Button onClick={() => getSingleClassData(c.id)}>
                                                    See more
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                ) : (
                    <Card className="shadow-none">
                        <CardHeader>
                            <CardTitle className="text-xl font-bold underline ">Class Detail</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {!isEditing ? (
                                <>
                                    <p><strong>Title:</strong> {selectedClass.title}</p>
                                    <p><strong>Description:</strong> {selectedClass.description}</p>
                                    <p><strong>Class Link:</strong> {selectedClass.class_link || "N/A"}</p>
                                    <p><strong>Available Seats:</strong> {selectedClass.total_seats || 0}</p>
                                    <p><strong>Occupied Seats:</strong> {selectedClass.filled_seats || 0}</p>
                                    <p><strong>Teacher:</strong> {selectedClass.teacher?.name || selectedClass.teacher?.email || "N/A"}</p>

                                    <h4 className="mt-4 font-semibold">Class Timings</h4>
                                    {
                                        selectedClass.class_timings?.length > 0 ? (
                                            <ul className="list-disc list-inside">
                                                {selectedClass.class_timings.map((timing: any, idx: number) => (
                                                    <li key={idx}>
                                                        {timing.preferred_time_from} — {timing.preferred_time_to}
                                                    </li>
                                                ))}
                                            </ul>
                                        ) : (
                                            <p>No timings available.</p>
                                        )
                                    }
                                </>
                            ) : (
                                <div className="flex flex-col gap-4">
                                    <Input name="title" value={formData.title} onChange={handleInputChange} placeholder="Title" />
                                    <Input name="description" value={formData.description} onChange={handleInputChange} placeholder="Description" />
                                    <Input name="class_link" value={formData.class_link} onChange={handleInputChange} placeholder="Class Link" />
                                    <Input name="total_seats" value={formData.total_seats} onChange={handleInputChange} placeholder="Total Seats" />
                                    <Input name="filled_seats" value={formData.filled_seats} onChange={handleInputChange} placeholder="Filled Seats" />
                                </div>
                            )}

                            <div className="mt-4 flex flex-row w-full gap-2">
                                <Button variant="outline" onClick={() => setSelectedClass(null)}>
                                    Close
                                </Button>
                                {!isEditing ? (
                                    <>
                                        <Button onClick={() => setIsEditing(true)}>
                                            Edit
                                        </Button>
                                        <Button variant="destructive" >
                                            Delete
                                        </Button>
                                    </>
                                ) : (
                                    <>
                                        <Button onClick={editClass}>
                                            Save
                                        </Button>
                                        <Button variant="destructive" onClick={() => setIsEditing(false)}>
                                            Cancel
                                        </Button>
                                    </>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                )
            }
        </div>
    );
};

export default Classes;
