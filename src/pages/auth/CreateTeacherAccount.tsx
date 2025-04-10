import CreateTeacherAccountForm from "@/components/CreateTeacherAccountForm"
import NavBar from "@/components/navbar"

const CreateTeacherAccount = () => {
  return (
    <div>
      <NavBar />
      <div className="flex min-h-svh w-full items-center justify-center ">
        <div className="w-full  ">
          <CreateTeacherAccountForm />
        </div>
      </div>
    </div>
  )
}

export default CreateTeacherAccount