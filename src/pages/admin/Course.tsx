import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import usePostAndPut from "@/hooks/usePostAndPut";
import axios from "axios";
import useGetAndDelete from "@/hooks/useGetAndDelete";
import SpinnerLoader from "@/components/SpinLoader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";


type Course = {
    id: number | null;
    image: string;
    name: string;
    description: string;
    price: string | number;
    course_duration: string;
};

type Outline = {
    id: number;
    title: string;
    description: string;
};

const Course: React.FC = () => {
    const defaultCourseData = {
        name: "",
        description: "",
        price: "",
        courseDuration: "",
        image: null as File | null,
    };

    const postCourse = usePostAndPut(axios.post);
    const getCourse = useGetAndDelete(axios.get);
    const getOutlines = useGetAndDelete(axios.get);
    const postOutlines = usePostAndPut(axios.post);
    const deleteOutline = useGetAndDelete(axios.delete);

    const [courseData, setCourseData] = useState(defaultCourseData);
    const [showOutlines, setShowOutlines] = useState(false);
    const [courseID, setCourseID] = useState<number | null>(null);
    const [outlineID, setOutlineID] = useState<number>(0);
    const [outline, setOutline] = useState({
        title: "",
        description: ""
    })


    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { id, value } = e.target;
        setCourseData(prev => ({
            ...prev,
            [id]: value,
        }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        setCourseData(prev => ({
            ...prev,
            image: file,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const response = await postCourse.callApi("course/create-course", courseData, true, true, true);
        if (response?.status === 201) {
            getCourses()
        }
    };

    const getCourses = async () => {
        await getCourse.callApi("course/get", false, false);
    };


    const fetchCourseOutlines = async (courseId: number | null) => {
        await getOutlines.callApi(`course/outlines/${courseId}`, true, false)
    }

    const addOutline = async () => {
        const response = await postOutlines.callApi(`course/add-outlines/${courseID}/${outlineID}`, outline, true, false, true);
        if (response.status == 200 || 201) {
            fetchCourseOutlines(courseID)
            setOutline({
                title: "",
                description: ""
            })
            setOutlineID(0)
        }
    }

    const handledeleteOutline = async (outlineId: number) => {
        await deleteOutline.callApi(`course/delete-outline/${outlineId}`, true, false);
        fetchCourseOutlines(courseID)
    }

    useEffect(() => {
        getCourses();
    }, []);

    return (
        <div className="p-5">
            {
                !showOutlines &&
                <div>
                    <div className="mx-auto p-6 border rounded-xl">
                        <h1 className="text-xl font-bold underline mb-5">Add New Course</h1>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <Label htmlFor="name">Course Name</Label>
                                <Input
                                    id="name"
                                    type="text"
                                    placeholder="Enter course name"
                                    value={courseData.name}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="mb-4">
                                <Label htmlFor="description">Description</Label>
                                <Textarea
                                    id="description"
                                    placeholder="Enter course description"
                                    value={courseData.description}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="mb-4">
                                <Label htmlFor="price">Price</Label>
                                <Input
                                    id="price"
                                    type="number"
                                    placeholder="Enter course price"
                                    value={courseData.price}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="mb-4">
                                <Label htmlFor="courseDuration">Course Duration</Label>
                                <Input
                                    id="courseDuration"
                                    type="text"
                                    placeholder="Enter course duration"
                                    value={courseData.courseDuration}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="mb-4">
                                <Label htmlFor="image">Course Image</Label>
                                <Input
                                    id="image"
                                    type="file"
                                    onChange={handleFileChange}
                                />
                            </div>
                            {
                                postCourse.loading ?
                                    <div className="flex items-start">
                                        <div className="bg-black w-auto text-white py-1.5 px-3 rounded-md text-center">
                                            loading...
                                        </div>
                                    </div> :
                                    <Button type="submit">Submit</Button>
                            }
                        </form>
                    </div>

                    <div className="mt-8 w-full ">
                        {
                            getCourse.loading ?
                                <SpinnerLoader color="black" /> :
                                <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                                    {getCourse?.response?.course?.map((course: Course) => (
                                        <div
                                            key={course.id}
                                            className="bg-white rounded-2xl border overflow-hidden"
                                        >
                                            <img
                                                src={course.image}
                                                alt={course.name}
                                                className="w-full h-48 object-cover"
                                            />
                                            <div className="p-4">
                                                <h2 className="text-lg font-bold text-gray-800">{course.name}</h2>
                                                <p className="text-gray-600 mt-1 text-sm">{course.description}</p>
                                                <div className="mt-3 flex flex-col justify-between items-start">
                                                    <div className="flex flex-row items-center justify-between px-1 w-full">
                                                        <span className="text-gray-600 font-semibold">${course.price}</span>
                                                        <span className="text-sm text-gray-500">{course.course_duration}</span>
                                                    </div>
                                                    <div className="flex mt-2 items-center gap-3  w-full">
                                                        <Button size="sm"  >Edit</Button>
                                                        <Button size="sm" variant='destructive' >Delete</Button>
                                                        <Button
                                                            onClick={
                                                                async () => {
                                                                    setCourseID(course.id)
                                                                    await fetchCourseOutlines(course.id)
                                                                    setShowOutlines(!showOutlines)
                                                                }
                                                            }
                                                            size="sm" variant='outline' >Outlines</Button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>))}
                                </div>
                        }
                    </div>
                </div>
            }

            {
                showOutlines &&
                <div className="space-y-6">
                    <Card className="shadow-none" >
                        <CardHeader>
                            <CardTitle className="text-xl font-bold underline">Add Outline</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <Label htmlFor="outlineTitle">Title</Label>
                                <Input
                                    value={outline.title}
                                    onChange={(e) => setOutline({ ...outline, title: e.target.value })}
                                    id="outlineTitle" placeholder="Enter outline title" />
                            </div>
                            <div>
                                <Label htmlFor="outlineDescription">Description</Label>
                                <Textarea
                                    value={outline.description}
                                    onChange={(e) => setOutline({ ...outline, description: e.target.value })}
                                    id="outlineDescription" placeholder="Enter outline description" />
                            </div>
                            <Button
                                onClick={addOutline}
                            >Add Outline
                            </Button>
                            <Button
                                variant='outline'
                                className="ml-2"
                                onClick={() => setShowOutlines(!showOutlines)}
                            >Close
                            </Button>
                        </CardContent>
                    </Card>

                    {
                        <Card className="shadow-none" >
                            <CardHeader>
                                <CardTitle className="text-xl font-bold underline">Course Outlines</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="w-[200px]">Title</TableHead>
                                            <TableHead>Description</TableHead>
                                            <TableHead className="text-right">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {getOutlines?.response?.outlines?.map((outline: Outline) => (
                                            <TableRow key={outline.id}>
                                                <TableCell className="font-medium">{outline.title}</TableCell>
                                                <TableCell>{outline.description}</TableCell>
                                                <TableCell className="text-right space-x-2">
                                                    <Button size="sm"
                                                        onClick={
                                                            () => {
                                                                setOutlineID(outline.id);
                                                                setOutline({
                                                                    title: outline.title,
                                                                    description: outline.description,
                                                                })
                                                            }
                                                        }
                                                    >Edit
                                                    </Button>
                                                    <Button size="sm" variant="destructive"
                                                        onClick={() => handledeleteOutline(outline.id)}
                                                    >Delete</Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    }
                </div>
            }

        </div>
    );
};

export default Course;
