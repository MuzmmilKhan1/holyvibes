import { useEffect, useState, FormEvent } from 'react';
import axios from 'axios';
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import useGetAndDelete from '@/hooks/useGetAndDelete';
import usePostAndPut from '@/hooks/usePostAndPut';
import SpinnerLoader from '@/components/SpinLoader';
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select";

interface EventType {
    id: number;
    title: string;
    description: string;
    price: number | null;
    time: string;
    link: string | null;
}

interface EventMember {
    id: number;
    student: {
        id: string;
        std_id: string;
        name: string;
    };
    payment_status: string;
    is_member: boolean;
}

interface BillingDetails {
    studentName: string;
    payment_status: string;
    paymentMethod?: string;
    receipt?: string;
}

const Event = () => {
    const getEvent = useGetAndDelete(axios.get);
    const getEventMembers = useGetAndDelete(axios.get);
    const postEvent = usePostAndPut(axios.post);
    const putEvent = usePostAndPut(axios.put);
    const getStdBilling = useGetAndDelete(axios.get);
    const deleteEvent = useGetAndDelete(axios.delete);
    const updateMembership = useGetAndDelete(axios.get);

    const [formData, setFormData] = useState<Omit<EventType, 'id'>>({
        title: '',
        description: '',
        price: null,
        time: '',
        link: '',
    });
    const [eventId, setEventId] = useState<number>(0);
    const [showMembers, setShowMembers] = useState<boolean>(false);
    const [showMemberBilling, setShowMemberBilling] = useState<boolean>(false);

    const [data, setData] = useState(
        {
            studentID: '',
            eventID: '',
            paymentStatus: '',
        }
    );


    const fetchEvents = async () => {
        try {
            await getEvent.callApi('event/get', true, false);
        } catch (error) {
            console.error('Error fetching events:', error);
        }
    };

    useEffect(() => {
        fetchEvents();
    }, []);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        try {
            await postEvent.callApi(
                'event/create-event',
                { id: eventId, ...formData },
                true,
                false,
                true
            );
            setFormData({
                title: '',
                description: '',
                price: null,
                time: '',
                link: '',
            });
            setEventId(0);
            fetchEvents();
        } catch (error) {
            console.error('Error submitting event:', error);
        }
    };

    const handleEdit = (event: EventType) => {
        setEventId(event.id);
        setFormData({
            title: event.title,
            description: event.description,
            price: event.price,
            time: event.time,
            link: event.link,
        });
    };

    const handleDelete = async (eventId: number) => {
        try {
            await deleteEvent.callApi(`event/delete/${eventId}`, true, false);
            fetchEvents();
        } catch (error) {
            console.error('Error deleting event:', error);
        }
    };

    const getEventMembersData = async (eventId: number) => {
        try {
            setData({ ...data, eventID: eventId.toString() });
            await getEventMembers.callApi(`event/get-event-members/${eventId}`, true, false);
            setShowMembers(true);
            setShowMemberBilling(false);
        } catch (error) {
            console.error('Error fetching event members:', error);
        }
    };

    const fetchMemberBillingDetails = async (studentId: string) => {
        setData({ ...data, studentID: studentId.toString() });
        try {
            const response = await getStdBilling.callApi(`event/get-std-event-billing/${studentId}/${data.eventID}`, true, false);
            console.log(response)
            setShowMemberBilling(true);
        } catch (error) {
            console.error('Error fetching billing details:', error);
            setShowMemberBilling(false);
        }
    };

    const saveBillingChanges = async () => {
        await putEvent.callApi('event/update-payemnt-status', data, true, false, true)
        await getEventMembersData(data.eventID as unknown as number);
    }

    const cancelMembershipOrJoin = async (eventID: number, studentID: string) => {
        await updateMembership.callApi(`event/join-cancel-membership/${eventID}/${studentID}`, false, false)
        await getEventMembersData(eventID);
    }

    return (
        <div className="w-full mx-auto p-6">
            {!showMembers && !showMemberBilling && (
                <div className="space-y-6 mx-auto">
                    <Card className="shadow-none">
                        <CardHeader>
                            <CardTitle className="text-xl font-bold underline">
                                {eventId === 0 ? 'Create Event' : 'Edit Event'}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <Input
                                    type="text"
                                    placeholder="Event Title"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    required
                                />
                                <Textarea
                                    placeholder="Event Description"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    required
                                />
                                <Input
                                    type="number"
                                    placeholder="Price (leave blank for free)"
                                    value={formData.price ?? ''}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            price: e.target.value ? parseFloat(e.target.value) : null,
                                        })
                                    }
                                />
                                <Input
                                    type="datetime-local"
                                    value={formData.time}
                                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                                    required
                                />
                                <Input
                                    type="text"
                                    placeholder="Event Link (optional)"
                                    value={formData.link ?? ''}
                                    onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                                />
                                {postEvent?.loading ? (
                                    <Button type="submit" disabled>
                                        {eventId === 0 ? 'Creating...' : 'Updating...'}
                                    </Button>
                                ) : (
                                    <Button type="submit">
                                        {eventId === 0 ? 'Create Event' : 'Update Event'}
                                    </Button>
                                )}
                                {eventId !== 0 && (
                                    <Button
                                        variant="outline"
                                        className="ml-2"
                                        onClick={() => {
                                            setEventId(0);
                                            setFormData({
                                                title: '',
                                                description: '',
                                                price: null,
                                                time: '',
                                                link: '',
                                            });
                                        }}
                                    >
                                        Cancel Edit
                                    </Button>
                                )}
                            </form>
                        </CardContent>
                    </Card>

                    {getEvent?.loading ? (
                        <SpinnerLoader color="black" />
                    ) : (
                        <Card className="shadow-none">
                            <CardHeader>
                                <CardTitle className="text-xl font-bold underline">All Events</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Table>
                                    <TableCaption>List of all created events.</TableCaption>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Title</TableHead>
                                            <TableHead>Description</TableHead>
                                            <TableHead>Price</TableHead>
                                            <TableHead>Time</TableHead>
                                            <TableHead>Link</TableHead>
                                            <TableHead>Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {getEvent?.response?.event?.length > 0 ? (
                                            getEvent.response.event.map((event: EventType) => (
                                                <TableRow key={event.id}>
                                                    <TableCell>{event.title}</TableCell>
                                                    <TableCell>
                                                        <span className="lg:text-wrap">{event.description}</span>
                                                    </TableCell>
                                                    <TableCell>{event.price !== null ? `$${event.price}` : 'Free'}</TableCell>
                                                    <TableCell>{new Date(event.time).toLocaleString()}</TableCell>
                                                    <TableCell className="lg:text-wrap">{event.link || '—'}</TableCell>
                                                    <TableCell>
                                                        <Button size="sm" onClick={() => handleEdit(event)}>
                                                            Edit
                                                        </Button>
                                                        <Button
                                                            variant="destructive"
                                                            className="ml-2"
                                                            size="sm"
                                                            onClick={() => handleDelete(event.id)}
                                                        >
                                                            Delete
                                                        </Button>
                                                        <Button
                                                            variant="outline"
                                                            className="ml-2"
                                                            size="sm"
                                                            onClick={() => getEventMembersData(event.id)}
                                                        >
                                                            Members
                                                        </Button>
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        ) : (
                                            <TableRow>
                                                <TableCell colSpan={6}>No events found.</TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    )}
                </div>
            )}

            {showMembers && !showMemberBilling && (
                <Card className="shadow-none">
                    <CardHeader>
                        <CardTitle className="text-xl font-bold underline">Event Members</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {getEventMembers?.loading ? (
                            <SpinnerLoader color="black" />
                        ) : (
                            <Table>
                                <TableCaption>List of event members.</TableCaption>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Student ID</TableHead>
                                        <TableHead>Name</TableHead>
                                        <TableHead>Payment Status</TableHead>
                                        <TableHead>Is Member</TableHead>
                                        <TableHead>Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {getEventMembers?.response?.event?.length > 0 ? (
                                        getEventMembers.response.event.map((member: EventMember) => (
                                            <TableRow key={member.id}>
                                                <TableCell>{member.student.std_id}</TableCell>
                                                <TableCell>{member.student.name}</TableCell>
                                                <TableCell>{member.payment_status}</TableCell>
                                                <TableCell>{member.is_member ? 'Yes' : 'No'}</TableCell>
                                                <TableCell className='flex gap-3' >
                                                    {
                                                        member.payment_status !== "not_required" &&
                                                        <Button onClick={() => fetchMemberBillingDetails(member.student.id)}>
                                                            See billing details
                                                        </Button>
                                                    }
                                                    {
                                                        member.is_member ? (
                                                            <Button variant='destructive' onClick={() => cancelMembershipOrJoin(eventId, member.student.id)}>
                                                                Leave
                                                            </Button>
                                                        ) : (
                                                            <Button variant='outline' onClick={() => cancelMembershipOrJoin(eventId, member.student.id)}>
                                                                Join
                                                            </Button>
                                                        )
                                                    }
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={5}>No members found.</TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        )}
                        <Button onClick={() => setShowMembers(false)} className="mt-5">
                            Back
                        </Button>
                    </CardContent>
                </Card>
            )}

            {showMemberBilling && (
                <div className="shadow-none border-none space-y-6 ">

                    <Card className="shadow-none">
                        <CardHeader>
                            <CardTitle className="text-xl font-bold underline">
                                Update Event Billing Payment Status
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="font-medium">Payment Status</label>
                                    <Select
                                        onValueChange={(value) => {
                                            setData({ ...data, paymentStatus: value });
                                        }}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select payment status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="pending">Pending</SelectItem>
                                            <SelectItem value="paid">Paid</SelectItem>
                                            <SelectItem value="rejected">Rejected</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="flex gap-2">
                                    <Button onClick={saveBillingChanges} >
                                        Save Changes
                                    </Button>
                                    <Button
                                        onClick={() => {
                                            setShowMemberBilling(false);
                                        }}
                                    >
                                        Back to Members
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {getStdBilling?.loading ? (
                        <SpinnerLoader color="black" />
                    ) : getStdBilling?.response?.billingDetails?.length > 0 ? (
                        <div className="w-full ">
                            <div className="flex flex-row flex-wrap  gap-4">
                                {getStdBilling.response.billingDetails.map((item: BillingDetails, index: number) => (
                                    <div key={index} className="border rounded-xl flex flex-col items-center justify-center  p-3">
                                        {item.receipt ? (
                                            <div>
                                                <img
                                                    src={item.receipt}
                                                    alt="Receipt"
                                                    className="max-w-full border h-auto rounded-md"
                                                />
                                            </div>
                                        ) : (
                                            <p>No receipt image available.</p>
                                        )}
                                        <p className="mt-4">
                                            <strong>Payment Method:</strong> {item.paymentMethod || 'Not specified'}
                                        </p>
                                    </div>
                                ))}
                            </div>

                        </div>
                    ) : (
                        <>
                            <p>Billing details not found for this student.</p>
                        </>
                    )}
                </div>
            )}
        </div>
    );
};

export default Event;