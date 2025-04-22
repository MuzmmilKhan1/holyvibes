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
import { Button } from "./ui/button";
import React from "react";

type Teacher = {
    id: number;
    teach_id?: string;
    name: string;
    application_date: string;
    contact_number: string;
    current_address: string;
    date_of_birth: string;
    email: string;
    experience_Quran: string;
};

type TeacherTableProps = {
    teachers: Teacher[];
    handleTeacherDetails: (teacher: Teacher) => void;
};

const TeacherTable: React.FC<TeacherTableProps> = ({ teachers, handleTeacherDetails }) => {
    return (
        <Card className="shadow-none">
            <CardHeader>
                <CardTitle className="text-xl font-bold underline">Teachers</CardTitle>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableCaption>List of all teachers</TableCaption>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Teacher ID</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Application Date</TableHead>
                            <TableHead>Contact Number</TableHead>
                            <TableHead>Current Address</TableHead>
                            <TableHead>Date of Birth</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Experience in Quran</TableHead>
                            <TableHead>Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {teachers?.map((teacher) => (
                            <TableRow key={teacher.id}>
                                <TableCell>{teacher.teach_id || "N/A"}</TableCell>
                                <TableCell>{teacher.name}</TableCell>
                                <TableCell>{teacher.application_date}</TableCell>
                                <TableCell>{teacher.contact_number}</TableCell>
                                <TableCell>{teacher.current_address}</TableCell>
                                <TableCell>{teacher.date_of_birth}</TableCell>
                                <TableCell>{teacher.email}</TableCell>
                                <TableCell>{teacher.experience_Quran}</TableCell>
                                <TableCell>
                                    <Button onClick={() => handleTeacherDetails(teacher)}>
                                        See more
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
};

export default TeacherTable;
