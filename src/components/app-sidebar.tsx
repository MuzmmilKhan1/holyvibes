import * as React from "react"
import {
  Notebook,
  School,
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


const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
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
    {
      title: "Classes",
      url: "/admin/classes",
      icon: School,
      isActive: true,
      items: [

      ],
    },
    {
      title: "Student",
      url: "/admin/students",
      icon: PiStudentFill,
      items: [

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
      title: "Explore",
      url: "#",
      icon: Notebook,
      isActive: true,
      items: [
        {
          title: "Enroll Courses",
          url: "#",
        },
        {
          title: "Upcomming Classes",
          url: "#",
        },
        {
          title: "Cohort",
          url: "#",
        },
      ],
    },
  ],

  // teacher routers
  teacherRoutes: [
    {
      title: "Class",
      url: "#",
      icon: Notebook,
      isActive: true,
      items: [
        {
          title: "Create Class",
          url: "/teacher/classes",
        },
        {
          title: "Live Session",
          url: "#",
        },
      ],
    },

  ],


}

export function AppSidebar({ ...props }: React.ComponentProps<any>) {


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
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
