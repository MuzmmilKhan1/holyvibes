'use client';

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

// Interfaces
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
        std_id: string;
        name: string;
    };
    payment_status: string;
    is_member: boolean;
}


const Event = () => {
    const getEvent = useGetAndDelete(axios.get);
    const getEventMembers = useGetAndDelete(axios.get);
    const postEvent = usePostAndPut(axios.post);

    const [formData, setFormData] = useState<Omit<EventType, 'id'>>({
        title: '',
        description: '',
        price: null,
        time: '',
        link: '',
    });
    const [eventId, setEventId] = useState<number>(0);
    const [showMembers, setShowMembers] = useState<boolean>(false);

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

    const getEventMembersData = async (eventId: number) => {
        try {
            await getEventMembers.callApi(`event/get-event-members/${eventId}`, true, false);
            setShowMembers(true);
        } catch (error) {
            console.error('Error fetching event members:', error);
        }
    };

    return (
        <div className="w-full mx-auto p-6">
            {!showMembers && (
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
                        <Card className='shadow-none' >
                            <CardHeader>
                                <CardTitle className="text-xl font-bold underline ">All Events</CardTitle>
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
                                        {getEvent?.response?.event.map((event: EventType) => (
                                            <TableRow key={event.id}>
                                                <TableCell>{event.title}</TableCell>
                                                <TableCell>
                                                    <span className="lg:text-wrap">
                                                        {event.description}
                                                    </span>
                                                </TableCell>
                                                <TableCell>{event.price !== null ? `$${event.price}` : 'Free'}</TableCell>
                                                <TableCell>{new Date(event.time).toLocaleString()}</TableCell>
                                                <TableCell className='lg:text-wrap' >{event.link || '—'}</TableCell>
                                                <TableCell>
                                                    <Button size="sm" onClick={() => handleEdit(event)}>
                                                        Edit
                                                    </Button>
                                                    <Button variant='destructive' className='ml-2' size="sm" onClick={() => handleEdit(event)}>
                                                        Delete
                                                    </Button>
                                                    <Button variant='outline' className='ml-2' size="sm" onClick={
                                                        async () => {
                                                            await getEventMembersData(event.id);
                                                        }
                                                    }>
                                                        Members
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    )}
                </div>
            )}

            {showMembers && (
                <>
                    {getEventMembers?.loading ? (
                        <SpinnerLoader color="black" />
                    ) : (
                        <Card className="shadow-none">
                            <CardHeader>
                                <CardTitle className="text-xl font-bold underline">Event Members</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Table>
                                    <TableCaption>List of event members.</TableCaption>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Student ID</TableHead>
                                            <TableHead>Name</TableHead>
                                            <TableHead>Payment Status</TableHead>
                                            <TableHead>Is Member</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {getEventMembers?.response?.event?.map((member: EventMember) => (
                                            <TableRow key={member.id}>
                                                <TableCell>{member.student.std_id}</TableCell>
                                                <TableCell>{member.student.name}</TableCell>
                                                <TableCell>{member.payment_status}</TableCell>
                                                <TableCell>{member.is_member ? 'Yes' : 'No'}</TableCell>
                                            </TableRow>
                                        )) || (
                                                <TableRow>
                                                    <TableCell colSpan={4}>No members found.</TableCell>
                                                </TableRow>
                                            )}

                                        <Button
                                            onClick={() => setShowMembers(false)}
                                            className="mt-5"
                                        >
                                            Back
                                        </Button>
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    )}
                </>
            )}
        </div>
    );
};

export default Event;