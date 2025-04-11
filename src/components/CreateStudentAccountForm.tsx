import { useState } from "react";
import { format } from "date-fns";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
    CardFooter,
} from "@/components/ui/card";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"; 
// import axios from "axios";

const CreateStudentAccountForm = () => {
    const [formData, setFormData] = useState({
        name: "",
        guardian_name: "",
        email: "",
        contact_number: "",
        alternate_contact_number: "",
        preferred_language: "",
        signature: "",
    });

    const [dob, setDob] = useState<Date | undefined>();
    const [registrationDate, setRegistrationDate] = useState<Date | undefined>();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleLanguageChange = (value: string) => {
        setFormData({
            ...formData,
            preferred_language: value,
        });
    };

    const handleSubmit = async () => {
        try {
            const payload = {
                ...formData,
                date_of_birth: dob ? format(dob, "yyyy-MM-dd") : null,
                registration_date: registrationDate ? format(registrationDate, "yyyy-MM-dd") : null,
            };
            console.log(payload)
        } catch (error) {
            console.error("Error submitting form:", error);
        }
    };

    return (
        <div className="max-w-7xl mx-auto p-5">
            <Card>
                <CardHeader>
                    <CardTitle>Create Student Account</CardTitle>
                    <CardDescription>
                        Fill in the information below to request admin for approval.
                    </CardDescription>
                </CardHeader>

                <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <Label>Name</Label>
                            <Input
                                name="name"
                                placeholder="Student Name"
                                value={formData.name}
                                onChange={handleChange}
                            />
                        </div>

                        <div>
                            <Label>Date of Birth</Label>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button variant="outline" className="w-full justify-start text-left">
                                        {dob ? format(dob, "MM/dd/yyyy") : "Pick a date"}
                                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0">
                                    <Calendar mode="single" selected={dob} onSelect={setDob} />
                                </PopoverContent>
                            </Popover>
                        </div>

                        <div>
                            <Label>Guardian Name</Label>
                            <Input
                                name="guardian_name"
                                placeholder="Guardian's Full Name"
                                value={formData.guardian_name}
                                onChange={handleChange}
                            />
                        </div>

                        <div>
                            <Label>Email</Label>
                            <Input
                                name="email"
                                type="email"
                                placeholder="example@email.com"
                                value={formData.email}
                                onChange={handleChange}
                            />
                        </div>

                        <div>
                            <Label>Contact Number</Label>
                            <Input
                                name="contact_number"
                                placeholder="Phone number"
                                value={formData.contact_number}
                                onChange={handleChange}
                            />
                        </div>

                        <div>
                            <Label>Alternate Contact Number</Label>
                            <Input
                                name="alternate_contact_number"
                                placeholder="Optional"
                                value={formData.alternate_contact_number}
                                onChange={handleChange}
                            />
                        </div>

                        <div>
                            <Label>Languages Spoken</Label>
                            <Select onValueChange={handleLanguageChange} value={formData.preferred_language}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select language" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="urdu">Urdu</SelectItem>
                                    <SelectItem value="english">English</SelectItem>
                                    <SelectItem value="arabic">Arabic</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div>
                            <Label>Signature</Label>
                            <Input
                                name="signature"
                                placeholder="Type signature"
                                value={formData.signature}
                                onChange={handleChange}
                            />
                        </div>

                        <div>
                            <Label>Registration Date</Label>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button variant="outline" className="w-full justify-start text-left">
                                        {registrationDate
                                            ? format(registrationDate, "MM/dd/yyyy")
                                            : "Pick a date"}
                                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0">
                                    <Calendar mode="single" selected={registrationDate} onSelect={setRegistrationDate} />
                                </PopoverContent>
                            </Popover>
                        </div>
                    </div>
                </CardContent>

                <CardFooter>
                    <Button className="ml-auto" onClick={handleSubmit}>
                        Submit
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
};

export default CreateStudentAccountForm;
