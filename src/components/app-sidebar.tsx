import * as React from "react"
import {
  Notebook,
  Plus,
  // School,
  // Settings2,
  User,
  User2Icon,
} from "lucide-react"
import { PiStudentFill } from "react-icons/pi";
import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import { SiCoursera } from "react-icons/si";
import { MdDashboard, MdUpcoming } from "react-icons/md";
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
      title: "Dashboard",
      url: "/admin/dashboard",
      icon: MdDashboard,
      isActive: true,
      items: [

      ],
    },
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
      url: "#",
      icon: User,
      isActive: true,
      items: [
        {
          title: "Classes",
          url: "/admin/classes",
        },
        {
          title: "Teachers",
          url: "/admin/teacher",
        },
      ],
    },

    {
      title: "Student",
      url: "#",
      icon: PiStudentFill,
      isActive: true,
      items: [
        {
          title: "Students",
          url: "/admin/students",
        },
        {
          title: "Allot teachers",
          url: "/admin/allot-teacher",
        },
        {
          title: "Performance report",
          url: "/admin/student-Performance-report",
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
  ],


  // student routers
  stdRoutes: [
    {
      title: "Courses",
      url: "/student/courses",
      icon: Notebook,
      isActive: true,
      items: [
        {
          title: "Enrolled Courses",
          url: "/student/enrolled-courses",
        },
      ],
    },
    {
      title: "Upcomming Events",
      url: "/student/event",
      icon: MdUpcoming,
      items: [
      ],
    },
    {
      title: "Policy",
      url: "/student/policy",
      icon: MdPolicy,
      isActive: false,
      items: [

      ],
    },
  ],

  // teacher routers
  teacherRoutes: [
    {
      title: "Dashboard",
      url: "/teacher/dashboard",
      icon: MdDashboard,
      isActive: true,
      items: [
        
      ],
    },
    {
      title: "Class",
      url: "/teacher/classes",
      icon: Notebook,
      isActive: true,
      items: [
      ],
    },
    {
      title: "Add Students",
      url: "/teacher/add-student",
      icon: Plus,
      isActive: false,
      items: [

      ],
    },
    {
      title: "Course",
      url: "/teacher/course",
      icon: SiCoursera,
      isActive: true,
      items: [
        
      ],
    },
    {
      title: "Students",
      url: "/teacher/alloted-students",
      icon: User2Icon,
      isActive: false,
      items: [

      ],
    },
    {
      title: "Performance Report",
      url: "/teacher/student-performance",
      icon: Notebook,
      isActive: false,
      items: [

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
      <SidebarContent  >
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
