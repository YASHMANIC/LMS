import {Category, Chapter, Course} from "@prisma/client";
import {NextResponse} from "next/server";
import {db} from "@/lib/db";
import {getProgress} from "@/actions/get-progress";


type CourseWithProgressWithCategory =Course & {
    category : Category,
    chapters:Chapter[]
    progress:number | null
}

type DashboardCourses = {
    completedCourses:CourseWithProgressWithCategory[]
    courseInProgress:CourseWithProgressWithCategory[]
}

export const GetDashboardCourses =async (userId:string):Promise<DashboardCourses> => {
    try{
        const purchasedCourses = await db.purchase.findMany({
            where:{
                userId:userId
            },
            select:{
                course:{
                    include:{
                        category:true,
                        chapters:{
                            where:{
                                isPublished:true
                            }
                        }
                    }
                }
            }
        })
        const courses = purchasedCourses.map((purchase) => purchase.course)as CourseWithProgressWithCategory[];
        for (let course of courses){
            const progress = await getProgress(userId,course.id)
            course["progress"] = progress
        }
        const completedCourses = courses.filter((course) => course.progress === 100)
        const courseInProgress = courses.filter((course) => (course.progress ?? 0) < 100)
        return {
            completedCourses,
            courseInProgress
        }
    }
    catch(error){
        console.log("[DASHBOARD_COURSES]",error);
        return {
            completedCourses:[],
            courseInProgress:[]
        }
    }
}