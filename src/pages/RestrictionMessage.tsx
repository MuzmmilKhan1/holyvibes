import NavBar from '@/components/navbar';

const RestrictionMessage = () => {

    return (
        <div >
            <NavBar />
            <div className='flex items-center justify-center min-h-[90vh] p-10' >
                <div className='font-bold text-xl ' >
                    It looks like your access has been restricted. Please reach out to the administrator for assistance
                </div>
            </div>
        </div>
    );
};

export default RestrictionMessage;
