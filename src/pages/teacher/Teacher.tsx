import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import useGetAndDelete from "@/hooks/useGetAndDelete";
import axios from "axios";
import { useEffect } from "react";
import SpinnerLoader from "@/components/SpinLoader";


const CourseTable = () => {

    const getTeacher = useGetAndDelete(axios.get);
    const getRequestedTeacher = async () => {
        const response = await getTeacher.callApi("teacher/get", false, false);
        console.log(response)
    };

    useEffect(() => {
        getRequestedTeacher();
    }, []);


    return (
        <div className="p-6" >

            {
                getTeacher.loading ? <SpinnerLoader color="black" /> :

                    <Card className="shadow-none" >
                        <CardHeader>
                            <CardTitle>Requested Teacher</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableCaption>list of all teachers.</TableCaption>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Name</TableHead>
                                        <TableHead>Application Date</TableHead>
                                        <TableHead>Contact Number</TableHead>
                                        <TableHead>Current Address</TableHead>
                                        <TableHead>Date of Birth</TableHead>
                                        <TableHead>Email</TableHead>
                                        <TableHead>Experience in Quran</TableHead>
                                        <TableHead>Gender</TableHead>
                                        <TableHead>Institution</TableHead>
                                        <TableHead>Languages Spoken</TableHead>
                                        <TableHead>Nationality</TableHead>
                                        <TableHead>Other Experience</TableHead>
                                        <TableHead>Qualification</TableHead>
                                        <TableHead>Status</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {getTeacher?.response?.teachers?.map((teacher: any) => (
                                        <TableRow>
                                            <TableCell>{teacher.name}</TableCell>
                                            <TableCell>{teacher.application_date}</TableCell>
                                            <TableCell>{teacher.contact_number}</TableCell>
                                            <TableCell>{teacher.current_address}</TableCell>
                                            <TableCell>{teacher.date_of_birth}</TableCell>
                                            <TableCell>{teacher.email}</TableCell>
                                            <TableCell>{teacher.experience_Quran}</TableCell>
                                            <TableCell>{teacher.gender}</TableCell>
                                            <TableCell>{teacher.institution}</TableCell>
                                            <TableCell>{teacher.languages_spoken}</TableCell>
                                            <TableCell>{teacher.nationality}</TableCell>
                                            <TableCell>{teacher.other_experience}</TableCell>
                                            <TableCell>{teacher.qualification}</TableCell>
                                            <TableCell>{teacher.status}</TableCell>
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

export default CourseTable
