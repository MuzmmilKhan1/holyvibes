import { useEffect, useState, FormEvent } from 'react';
import axios from 'axios';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import usePostAndPut from '@/hooks/usePostAndPut';
import useGetAndDelete from '@/hooks/useGetAndDelete';
import SpinnerLoader from '@/components/SpinLoader';

interface Policy {
    id: number;
    title: string;
    description: string;
}

const StudentPolicy = () => {
    const getPolicy = useGetAndDelete(axios.get);
    const postPolicy = usePostAndPut(axios.post);
    const deletePolicy = useGetAndDelete(axios.delete);

    const [formData, setFormData] = useState<Policy>({
        id: 0,
        title: '',
        description: ''
    });

    const fetchPolicies = async () => {
        await getPolicy.callApi('student-policy/get', true, false);
    };

    useEffect(() => {
        fetchPolicies();
    }, []);

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const response = await postPolicy.callApi('student-policy/create-and-edit', formData, true, false, true);
            if (response.status == 201 || response.status == 200) {
                setFormData({ id: 0, title: '', description: '' });
                await fetchPolicies();
            }
        } catch (error) {
            console.error('Error saving policy:', error);
        }
    };

    const handleEdit = (policy: Policy) => {
        setFormData({
            id: policy.id,
            title: policy.title,
            description: policy.description
        });
    };

    const handleDelete = async (id: number) => {
        await deletePolicy.callApi(`student-policy/delete/${id}`, true, false);
        await fetchPolicies()
    }

    return (
        <div className="max-w-full mx-auto p-6 space-y-6">
            <Card className='shadow-none' >
                <CardHeader>
                    <CardTitle className='underline' >{formData.id === 0 ? 'Create New Policy' : 'Edit Policy'}</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <Input
                            type="text"
                            placeholder="Policy Title"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            required
                        />
                        <Textarea
                            placeholder="Policy Description"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            required
                        />
                        {
                            postPolicy?.loading ?
                                <div className='flex'  >
                                    <div className='px-4 py-1.5 bg-black text-white rounded-lg' >
                                        {formData.id === 0 ? 'Creating...' : 'Updating...'}
                                    </div>
                                </div> :
                                <Button type="submit">
                                    {formData.id === 0 ? 'Create Policy' : 'Update Policy'}
                                </Button>
                        }
                    </form>
                </CardContent>
            </Card>

            {
                getPolicy?.loading ?
                    <SpinnerLoader color='black' /> :
                    <Card className='shadow-none' >
                        <CardHeader>
                            <CardTitle className="text-xl font-bold underline ">Policies</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>ID</TableHead>
                                        <TableHead>Title</TableHead>
                                        <TableHead  >Description</TableHead>
                                        <TableHead>Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {
                                        getPolicy?.response?.policy?.length > 0 &&
                                        getPolicy?.response?.policy.map((policy: Policy) => (
                                            <TableRow key={policy.id}>
                                                <TableCell>{policy.id}</TableCell>
                                                <TableCell>{policy.title}</TableCell>
                                                <TableCell className='truncate ' >
                                                    {policy.description}
                                                </TableCell>
                                                <TableCell>
                                                    <Button onClick={() => handleEdit(policy)}>
                                                        Edit
                                                    </Button>
                                                    <Button className='ml-2' variant="destructive" onClick={() => handleDelete(policy.id)}>
                                                        Delete
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
            }
        </div>
    );
};

export default StudentPolicy;
