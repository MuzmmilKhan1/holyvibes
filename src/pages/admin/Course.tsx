import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import usePostAndPut from "@/hooks/usePostAndPut";
import axios from "axios";
import useGetAndDelete from "@/hooks/useGetAndDelete";
import Helpers from "@/config/Helpers";
import SpinnerLoader from "@/components/SpinLoader";


type Course = {
    id: React.Key | null;
    image: string;
    name: string;
    description: string;
    price: string | number;
    course_duration: string;
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
    // const deleteCourse = useGetAndDelete(axios.delete);

    const [courseData, setCourseData] = useState(defaultCourseData);


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
        const response = await getCourse.callApi("course/get", false, false);
        if (response.course) {
            console.log(response.course)
        }
    };



    useEffect(() => {
        getCourses();
    }, []);

    return (
        <div className="p-5">
            <div className="mx-auto p-6 border rounded-xl">
                <h1 className="text-2xl font-bold mb-4">Add New Course</h1>
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
                        <SpinnerLoader color="black"  /> :
                        <div className="flex items-start justify-start flex-row flex-wrap gap-4">
                            {getCourse?.response?.course?.map((course: Course) => (
                                <div key={course.id} className="border border-gery-100 rounded-lg p-4  lg:w-[23%]">
                                    <img
                                        src={Helpers.imageUrl + course.image}
                                        className="w-full h-40 object-cover rounded-md mb-4 border"
                                    />
                                    <h3 className="text-lg font-semibold mt-1">{course.name}</h3>
                                    <p className="text-sm text-gray-600 mt-1">{course.description}</p>
                                    <p className="text-sm text-gray-600 mt-1">Price: ${course.price}</p>
                                    <p className="text-sm text-gray-600 mt-1">Duration: {course.course_duration}</p>
                                    <div className="flex justify-between mt-4">
                                        <Button size="sm">Edit</Button>
                                        <Button
                                            variant="destructive"
                                            size="sm"
                                        >
                                            Delete
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                }
            </div>
        </div>
    );
};

export default Course;
