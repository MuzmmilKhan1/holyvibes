import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Link } from "react-router-dom"
import useGetAndDelete from "@/hooks/useGetAndDelete"
import axios from "axios"
import usePostAndPut from "@/hooks/usePostAndPut"

const CreateTeacherAccountForm = ({
    className,
    ...props
}: React.ComponentProps<"div">) => {
    const [formData, setFormData] = useState({
        name: "",
        date_of_birth: "",
        gender: "",
        nationality: "",
        contact_number: "",
        email: "",
        languages_spoken: "",
        age_group: "",
        qualification: "",
        institution: "",
        application_date: "",
        current_address: "",
        experience_Quran: "",
        other_experience: "",
        course: "",
        preferred_times: [
            { from: "", to: "" }
        ],
    });

    const getCourse = useGetAndDelete(axios.get);
    const postTeacherApplication = usePostAndPut(axios.post);

    const getCourses = async () => {
        const response = await getCourse.callApi("course/get", false, false);
        if (response.course) {
            console.log(response.course)
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { id, value } = e.target
        setFormData(prev => ({ ...prev, [id]: value }))
    }

    const handleSelectChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }))
    }

    const handleTimeChange = (index: number, field: "from" | "to", value: string) => {
        const updatedTimes = [...formData.preferred_times];
        updatedTimes[index][field] = value;
        setFormData(prev => ({ ...prev, preferred_times: updatedTimes }));
    }

    const addMoreTimeSlot = () => {
        setFormData(prev => ({
            ...prev,
            preferred_times: [...prev.preferred_times, { from: "", to: "" }],
        }));
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        const response = await postTeacherApplication.callApi("teacher/requested-teacher", formData, true, false, true)  
        console.log(response)
    }

    useEffect(() => {
        getCourses();
    }, []);

    return (
        <div>
            <div className={cn("flex items-center justify-center w-full p-6", className)} {...props}>
                <Card className="max-sm:min-w-sm">
                    <CardHeader>
                        <CardTitle>Create Teacher Account</CardTitle>
                        <CardDescription>
                            Fill in the information below to request admin approval.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit}>
                            <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                <div className="grid gap-3">
                                    <Label htmlFor="name">Name</Label>
                                    <Input id="name" type="text" value={formData.name} onChange={handleChange} required />
                                </div>

                                <div className="grid gap-3">
                                    <Label htmlFor="date_of_birth">Date of Birth</Label>
                                    <Input id="date_of_birth" type="date" value={formData.date_of_birth} onChange={handleChange} required />
                                </div>

                                <div className="grid gap-3">
                                    <Label htmlFor="gender">Gender</Label>
                                    <Select onValueChange={(val) => handleSelectChange("gender", val)}>
                                        <SelectTrigger id="gender">
                                            <SelectValue placeholder="Select gender" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="male">Male</SelectItem>
                                            <SelectItem value="female">Female</SelectItem>
                                            <SelectItem value="other">Other</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="grid gap-3">
                                    <Label htmlFor="nationality">Nationality</Label>
                                    <Input id="nationality" type="text" value={formData.nationality} onChange={handleChange} required />
                                </div>

                                <div className="grid gap-3">
                                    <Label htmlFor="contact_number">Contact Number</Label>
                                    <Input id="contact_number" type="tel" value={formData.contact_number} onChange={handleChange} required />
                                </div>

                                <div className="grid gap-3">
                                    <Label htmlFor="email">Email</Label>
                                    <Input id="email" type="email" value={formData.email} onChange={handleChange} required />
                                </div>

                                <div className="grid gap-3">
                                    <Label htmlFor="languages_spoken">Languages Spoken</Label>
                                    <Select onValueChange={(val) => handleSelectChange("languages_spoken", val)}>
                                        <SelectTrigger id="languages_spoken">
                                            <SelectValue placeholder="Select language" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="urdu">Urdu</SelectItem>
                                            <SelectItem value="english">English</SelectItem>
                                            <SelectItem value="arabic">Arabic</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>


                                <div className="grid gap-3">
                                    <Label htmlFor="age_group">Age Group</Label>
                                    <Select onValueChange={(val) => handleSelectChange("age_group", val)}>
                                        <SelectTrigger id="age_group">
                                            <SelectValue placeholder="Select age group" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="children">Children</SelectItem>
                                            <SelectItem value="teenagers">Teenagers</SelectItem>
                                            <SelectItem value="adults">Adults</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>



                                <div className="grid gap-3">
                                    <Label htmlFor="course">Course</Label>
                                    <Select onValueChange={(val) => handleSelectChange("course", val)}>
                                        <SelectTrigger id="course">
                                            <SelectValue placeholder="Select course" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {
                                                getCourse?.loading
                                                    ? <div className="bg-black w-auto text-white py-1.5 px-3 rounded-md text-center">loading...</div>
                                                    : getCourse?.response?.course?.map((course: any) => (
                                                        <SelectItem key={course?.id} value={course.id}>
                                                            {course.name}
                                                        </SelectItem>
                                                    ))
                                            }
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Preferred Time Slots */}
                                <div className="col-span-full">
                                    <Label>Preferred Times</Label>
                                    {formData.preferred_times.map((slot, index) => (
                                        <div key={index} className="grid grid-cols-2 gap-4 mt-2">
                                            <div>
                                                <Label>From</Label>
                                                <Input
                                                    type="time"
                                                    value={slot.from}
                                                    onChange={(e) => handleTimeChange(index, "from", e.target.value)}
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <Label>To</Label>
                                                <Input
                                                    type="time"
                                                    value={slot.to}
                                                    onChange={(e) => handleTimeChange(index, "to", e.target.value)}
                                                    required
                                                />
                                            </div>
                                        </div>
                                    ))}
                                    <Button
                                        type="button"
                                        variant="outline"
                                        className="mt-3"
                                        onClick={addMoreTimeSlot}
                                    >
                                        + Add More Time
                                    </Button>
                                </div>

                                <div className="grid gap-3">
                                    <Label htmlFor="qualification">Qualification</Label>
                                    <Input id="qualification" type="text" value={formData.qualification} onChange={handleChange} required />
                                </div>

                                <div className="grid gap-3">
                                    <Label htmlFor="institution">Institution</Label>
                                    <Input id="institution" type="text" value={formData.institution} onChange={handleChange} required />
                                </div>

                                <div className="grid gap-3">
                                    <Label htmlFor="application_date">Application Date</Label>
                                    <Input id="application_date" type="date" value={formData.application_date} onChange={handleChange} required />
                                </div>

                                <div className="grid gap-3 col-span-full">
                                    <Label htmlFor="current_address">Current Address</Label>
                                    <Textarea id="current_address" value={formData.current_address} onChange={handleChange} required />
                                </div>

                                <div className="grid gap-3 col-span-full">
                                    <Label htmlFor="experience_Quran">Experience with Quran</Label>
                                    <Textarea id="experience_Quran" value={formData.experience_Quran} onChange={handleChange} required />
                                </div>

                                <div className="grid gap-3 col-span-full">
                                    <Label htmlFor="other_experience">Other Experience</Label>
                                    <Textarea id="other_experience" value={formData.other_experience} onChange={handleChange} />
                                </div>

                                <div className="col-span-full">
                                    <Button type="submit" className="w-full mt-6">
                                        Submit Application
                                    </Button>
                                </div>

                                <div className="col-span-full mt-4 text-center text-sm">
                                    Already have an account?{" "}
                                    <Link to="/" className="underline underline-offset-4">
                                        Login
                                    </Link>
                                </div>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

export default CreateTeacherAccountForm
