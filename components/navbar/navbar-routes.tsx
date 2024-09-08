"use client"

import {useAuth, UserButton} from "@clerk/nextjs";
import {usePathname, useRouter} from "next/navigation";
import {Button} from "@/components/ui/button";
import {LogOut} from "lucide-react";
import Link from "next/link";
import SearchInput from "@/components/search-input";
import {ThemeToggle} from "@/components/theme-toggle";
import {isTeacher} from "@/actions/get-teacher";

const NavbarRoutes = () => {
    const {userId} = useAuth();
    const pathname = usePathname()
    const router = useRouter()
    const isTeacherPage = pathname?.startsWith('/teacher')
    const isPlayer = pathname?.includes('/courses')
    const isSearchPage = pathname === '/search'
    return(
        <>
            {isSearchPage && (
                <div className="hidden md:block ">
                    <SearchInput/>
                </div>
            )}
            <div className="flex gap-x-2 ml-auto">
                {isTeacherPage || isPlayer ? (
                    <Link href={'/'}>
                        <Button size={"sm"} variant={"ghost"}>
                            <LogOut className="h-4 w-4 mr-4"/>
                            Exit
                        </Button>
                    </Link>
                ) : isTeacher(userId) ?(
                    <Link href={'/teacher/courses'}>
                        <Button size={"sm"} variant={"ghost"}>
                            Teacher Mode
                        </Button>
                    </Link>
                ):null}
                <UserButton/>
                <ThemeToggle/>
            </div>

        </>
    )
}
export default NavbarRoutes;