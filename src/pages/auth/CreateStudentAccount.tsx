import CreateStudentAccountForm from "@/components/CreateStudentAccountForm";
import NavBar from "@/components/navbar";

const CreateStudentAccount = () => {
    return (
        <div>
            <NavBar />
            <div className="flex min-h-svh w-full items-center justify-center ">
                <div className="w-full  ">
                    <CreateStudentAccountForm />
                </div>
            </div>



        </div>
    );
};

export default CreateStudentAccount;
