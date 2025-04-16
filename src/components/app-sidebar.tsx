import * as React from "react"
import {
  Notebook,
  // School,
  Settings2,
  User,
} from "lucide-react"
import { PiStudentFill } from "react-icons/pi";
import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import { SiCoursera } from "react-icons/si";
import { MdUpcoming } from "react-icons/md";
import { MdPolicy } from "react-icons/md";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarRail,
} from "@/components/ui/sidebar"
import useGetAndDelete from "@/hooks/useGetAndDelete";
import axios from "axios";


let data = {
  user: {
    name: "",
    email: "",
    avatar: "/avatars/shadcn.jpg",
  },

  // admin routers
  adminRoutes: [
    {
      title: "Courses",
      url: "/admin/course",
      icon: SiCoursera,
      isActive: true,
      items: [

      ],
    },
    {
      title: "Teacher",
      url: "/admin/teacher",
      icon: User,
      isActive: true,
      items: [

      ],
    },
    // {
    //   title: "Classes",
    //   url: "/admin/classes",
    //   icon: School,
    //   isActive: true,
    //   items: [

    //   ],
    // },
    {
      title: "Student",
      url: "/admin/students",
      icon: PiStudentFill,
      isActive: true,
      items: [
        {
          title: "Allot teachers",
          url: "/admin/allot-teacher",
        },
      ],
    },
    {
      title: "Upcomming Events",
      url: "/admin/event",
      icon: MdUpcoming,
      items: [
      ],
    },
    {
      title: "Policy",
      url: "/admin/policy",
      icon: MdPolicy,
      items: [
      ],
    },
    {
      title: "Settings",
      url: "#",
      icon: Settings2,
      items: [

      ],
    },
  ],


  // student routers
  stdRoutes: [
    {
      title: "Enrolled Courses",
      url: "/student/enrolled-courses",
      icon: Notebook,
      isActive: false,
      items: [
        // {
        //   title: "Enrolled Courses",
        //   url: "#",
        // },
        // {
        //   title: "Upcomming Classes",
        //   url: "#",
        // },
        // {
        //   title: "Cohort",
        //   url: "#",
        // },
      ],
    },
  ],

  // teacher routers
  teacherRoutes: [
    {
      title: "Class",
      url: "/teacher/classes",
      icon: Notebook,
      isActive: false,
      items: [
        // {
        //   title: "Create Class",
        //   url: "/teacher/classes",
        // },
        // {
        //   title: "Live Session",
        //   url: "#",
        // },
      ],
    },

    {
      title: "Course",
      url: "/teacher/course",
      icon: SiCoursera,
      isActive: false,
      items: [
        {
          title: "Students",
          url: "/teacher/alloted-students",
        },
      ],
    },

  ],


}

export function AppSidebar({ ...props }: React.ComponentProps<any>) {
  const getUser = useGetAndDelete(axios.get);
  const getUserData = async () => {
    const response = await getUser.callApi('auth/get', false, false);
    data.user = {
      name: response.user.name,
      email: response.user.email,
      avatar: "",
    };
  }

  React.useEffect(() => {
    getUserData()
  }, [])


  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarContent>
        {
          props.userType?.startsWith("admin") &&
          <NavMain items={data.adminRoutes} />
        }
        {
          props.userType?.startsWith("student") &&
          <NavMain items={data.stdRoutes} />
        }
        {
          props.userType?.startsWith("teacher") &&
          <NavMain items={data.teacherRoutes} />
        }
      </SidebarContent>
      <SidebarFooter  >
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
