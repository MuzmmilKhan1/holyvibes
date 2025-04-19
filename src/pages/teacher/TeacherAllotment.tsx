import SpinnerLoader from "@/components/SpinLoader";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import useGetAndDelete from "@/hooks/useGetAndDelete";
import axios from "axios";
import { useEffect } from "react";

interface Student {
  id: string;
  name: string;
  std_id: string;
}

interface Teacher {
  id: string;
  name: string;
}

interface Course {
  id: string;
  name: string;
}

interface TimeSlot {
  preferred_time_from: string;
  preferred_time_to: string;
}

interface Allotment {
  id: string;
  student: Student;
  teacher: Teacher;
  course: Course;
  student_class_timings: TimeSlot[];
}



const TeacherAllotment = () => {
  const getAllottedStudents = useGetAndDelete(axios.get);

  const getAllottedStudentsData = async () => {
    try {
      const response = await getAllottedStudents.callApi(
        "teacher-allotment/get-teacher-allotment",
        false,
        false
      );
      console.log(response.teacherAllotment);
    } catch (error) {
      console.error("Error fetching allotments", error);
    }
  };

  useEffect(() => {
    getAllottedStudentsData();
  }, []);


  return (
    <div className="p-6">
      {getAllottedStudents.loading ? (
        <SpinnerLoader color="black" />
      ) : (
        <Card className="w-full shadow-none">
          <CardHeader className="text-xl font-bold underline " >
            <CardTitle>Students</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student ID</TableHead>
                  <TableHead>Course</TableHead>
                  <TableHead>Student</TableHead>
                  <TableHead>Teacher</TableHead>
                  <TableHead>Class Timings</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {getAllottedStudents?.response?.teacherAllotment?.length > 0 ? (
                  getAllottedStudents?.response?.teacherAllotment?.map((allotment: Allotment, index: number) => (
                    <TableRow key={allotment.id || index}>
                      <TableCell>{allotment?.student?.std_id}</TableCell>
                      <TableCell>{allotment?.course?.name}</TableCell>
                      <TableCell>{allotment?.student?.name}</TableCell>
                      <TableCell>{allotment?.teacher?.name}</TableCell>
                      <TableCell>
                        {allotment.student_class_timings.map(
                          (time: TimeSlot, i: number) => (
                            <div key={i} className="text-sm">
                              From: {time.preferred_time_from} - To:{" "}
                              {time.preferred_time_to}
                            </div>
                          )
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-muted">
                      No data found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default TeacherAllotment;
