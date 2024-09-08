"use client"

import {BarChart, CircleIcon, Compass, LayoutIcon} from "lucide-react";
import SidebarItems from "@/components/sidebar/sidebar-items";
import {usePathname} from "next/navigation";

const guestRoutes = [
    {
        icon:LayoutIcon,
        label:"Dashboard",
        href:'/',
    },
     {
        icon:Compass,
        label:"Browse",
        href:'/search',
    }
]
const teacherRoutes = [
    {
        icon: CircleIcon,
        label:"Courses",
        href:'/teacher/courses',
    },
     {
        icon:BarChart,
        label:"Analytics",
        href:'/teacher/analytics',
    }
]

const SidebarRoutes = () => {
    const pathname = usePathname()
    const routes = pathname?.startsWith('/teacher') ? teacherRoutes : guestRoutes;
    return (
        <div className="flex flex-col w-full">
            {routes.map((route) => (
                <SidebarItems key={route.label} icon={route.icon} label={route.label} href={route.href}/>
            ))}
        </div>
    )
}
export default SidebarRoutes