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
import React from "react";

type ClassTiming = {
    id: number;
    course_name: string;
    from: string;
    to: string;
};

type TeacherClassTimingsProps = {
    classTimings: ClassTiming[];
    setShowClassManagement: (value: boolean) => void;
};

const TeacherClassTimings: React.FC<TeacherClassTimingsProps> = ({ classTimings, }) => {
    return (
        <Card className="shadow-none">
            <CardHeader>
                <CardTitle className="text-xl font-bold underline -mb-3">Class Time</CardTitle>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableCaption>List of all teacher's class timings</TableCaption>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Course</TableHead>
                            <TableHead>Preferred Time From</TableHead>
                            <TableHead>Preferred Time To</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {classTimings.map((ct) => (
                            <TableRow key={ct.id}>
                                <TableCell>{ct.course_name}</TableCell>
                                <TableCell>{ct.from}</TableCell>
                                <TableCell>{ct.to}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
};

export default TeacherClassTimings;
