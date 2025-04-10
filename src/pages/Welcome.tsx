import NavBar from '@/components/navbar';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const Welcome = () => {
    const navigate = useNavigate();

    const handleOptionClick = (path: string) => {
        navigate(path);
    };

    return (
        <div >
            <NavBar />
            <div className='flex items-center justify-center min-h-screen ' >
                <div className="bg-white p-10 rounded-xl border max-w-md w-full text-start">
                    <h1 className="text-3xl font-bold  mb-3">Welcome!</h1>
                    <p className="text-lg text-gray-600 mb-4">Hello</p>
                    <div className="space-y-3">
                        <Button
                            onClick={() => handleOptionClick('/create-teacher-account')}
                            className="w-full px-6 py-4 bg-black text-white rounded-lg  "
                        >
                            Create Teacher Account
                        </Button>
                        <Button
                            onClick={() => handleOptionClick('/create-student-account')}
                            className="w-full px-6 py-4 bg-black text-white rounded-lg  "
                        >
                            Create Student Account
                        </Button>
                        <Button
                            onClick={() => handleOptionClick('/login')}
                            className="w-full px-6 py-4 bg-black text-white rounded-lg  "
                        >
                            Login to Account
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Welcome;
