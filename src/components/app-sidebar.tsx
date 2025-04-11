import * as React from "react"
import {
  BookOpen,
  Bot,
  Notebook,
  Settings2,
  User,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
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
      icon: Notebook,
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
      title: "Student",
      url: "#",
      icon: Bot,
      items: [

      ],
    },
    {
      title: "Upcomming Classes",
      url: "#",
      icon: BookOpen,
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
      url: "/teacher/classes",
      icon: Notebook,
      isActive: true,
      items: [
        // {
        //   title: "Cohort",
        //   url: "#",
        // },
        {
          title: "Live Session",
          url: "#",
        },
        // {
        //   title: "Student",
        //   url: "#",
        // },
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
