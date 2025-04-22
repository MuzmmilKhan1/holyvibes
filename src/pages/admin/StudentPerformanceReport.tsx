import useGetAndDelete from "@/hooks/useGetAndDelete";
import axios from "axios"
import { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";


const StudentPerformanceReport = () => {

    const getStdPerformance = useGetAndDelete(axios.get);

    const getStdPerformanceData = async () => {
        const response = await getStdPerformance.callApi('student-performance/get', false, false)
        console.log(response)
    }

    useEffect(() => {
        getStdPerformanceData()
    }, [])


    return (
        <div className='p-6'>



            <Card className="mx-auto shadow-none">
                <CardHeader className="text-xl font-bold underline " >
                    <CardTitle>
                        Student Performance Report
                    </CardTitle>
                </CardHeader>
                <CardContent className=" space-y-4">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Student ID</TableHead>
                                <TableHead>Teacher ID</TableHead>
                                <TableHead>Course</TableHead>
                                <TableHead>Class</TableHead>
                                <TableHead>Attendence</TableHead>
                                <TableHead>Oral/Written Test Remarks</TableHead>
                                <TableHead>Participation</TableHead>
                                <TableHead>Suggestions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {
                                getStdPerformance?.response?.data?.length > 0 &&
                                getStdPerformance.response?.data.map((items: any) => (
                                    <TableRow >
                                        <TableCell>{items.student.std_id}</TableCell>
                                        <TableCell>{items.teacher.teach_id}</TableCell>
                                        <TableCell className="text-wrap" >{items.course.name}</TableCell>
                                        <TableCell className="text-wrap" >{items?.class?.title || 'N/A'}</TableCell>
                                        <TableCell>{items.attendance}</TableCell>
                                        <TableCell className="text-wrap" >{items.test_remarks || 'N/A'}</TableCell>
                                        <TableCell className="text-wrap" >{items.participation || 'N/A'}</TableCell>
                                        <TableCell className="text-wrap" >{items.suggestions || 'N/A'}</TableCell>
                                      
                                    </TableRow>
                                ))
                            }
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>



        </div>
    )
}

export default StudentPerformanceReport