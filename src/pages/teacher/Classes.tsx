import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import useGetAndDelete from "@/hooks/useGetAndDelete";
import axios from "axios";
import { useEffect, useState } from "react";
import SpinnerLoader from "@/components/SpinLoader";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Label } from "@radix-ui/react-dropdown-menu";
import { Input } from "@/components/ui/input";
import usePostAndPut from "@/hooks/usePostAndPut";


const Classes = () => {
    const [teacherName, setTeacherName] = useState<string>("");
    const [teacherEmail, setTeacherEmail] = useState<string>("");
    const [teacherPassword, setTeacherPassword] = useState<string>("");
    const [courses, setCourses] = useState<{ id: string, name: string }[]>([]);
    const getCourse = useGetAndDelete(axios.get);

    useEffect(() => {
        const getCourses = async () => {
            const response = await getCourse.callApi("course/get-teacher-courses-time", true, false);
            console.log(response)
            if (response?.course) {
                setCourses(response.course);
            }
        };
        getCourses();
    }, []);
    return (
        <div className="w-full p-6" >
            <Card className="shadow-none ">
                <CardHeader>
                    <CardTitle className="text-xl font-bold underline">Create Class</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div>
                            <Label className="block text-sm font-medium">
                                Title
                            </Label>
                            <Input
                                id="teacherName"
                                type="text"
                                value={teacherName}
                                onChange={(e) => setTeacherName(e.target.value)}
                                className="w-full mt-2"
                                placeholder="Enter class name"
                            />
                        </div>
                        <div>
                            <Label className="block text-sm font-medium">
                                Description
                            </Label>
                            <Input
                                id="teacherEmail"
                                type="email"
                                value={teacherEmail}
                                onChange={(e) => setTeacherEmail(e.target.value)}
                                className="w-full mt-2"
                                placeholder="Enter description of class"
                            />
                        </div>
                        <div className="mt-4">
                            <Button  >
                                Create
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

export default Classes