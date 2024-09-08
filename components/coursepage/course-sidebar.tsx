import {Chapter, Course, UserProgress} from "@prisma/client";
import {auth} from "@clerk/nextjs/server";
import {redirect} from "next/navigation";
import {db} from "@/lib/db";
import CourseSidebarItem from "@/components/coursepage/course-sidebar-item";
import CourseProgress from "@/components/course-progress";

interface CourseSidebarProps {
    course:Course &{
        chapters:(Chapter & {
            userProgress:UserProgress[] | null
    })[]
};
    progressCount : number
}
const CoursePage =async ({course,progressCount}:CourseSidebarProps) => {
    const {userId} = auth();
    if (!userId){
        return redirect('/')
    }
    const purchase = await db.purchase.findUnique({
        where:{
            courseId_userId:{
                userId,
                courseId:course.id
            }
        }
    });
    return(
        <div className="h-full border-r flex flex-col overflow-y-auto shadow-sm">
           <div className="p-8 flex flex-col border-r">
               <h1 className="font-semibold">
                   {course.title}
               </h1>
               {purchase && (
                   <div className="mt-10">
                    <CourseProgress value={progressCount} variant={"success"}/>
                   </div>
               )}
           </div>
            <div className="flex flex-col w-full">
                {course.chapters.map((chapter)=>(
                    <CourseSidebarItem id={chapter.id} key={chapter.id} label={chapter.title} courseId={course.id}
                    isCompleted={!!chapter.userProgress?.[0]?.isCompleted} isLocked={!chapter.isFree && !purchase}/>
                ))}
            </div>
        </div>
    )
}
export default CoursePage