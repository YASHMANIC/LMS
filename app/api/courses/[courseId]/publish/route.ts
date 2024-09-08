import {NextResponse} from "next/server";
import {auth} from "@clerk/nextjs/server";
import {db} from "@/lib/db";

export async function PATCH(
    req:Request,
    {params}:{params:{courseId:string}}
){
    try {
        const {userId} = auth();
        if(!userId){
            return new NextResponse("Unauthorized",{status:401});
        }
        const course = await db.course.findUnique({
            where:{
                id:params.courseId,
                userId
            },
            include:{
                chapters:{
                    include:{
                        muxData:true
                    }
                }
            }
        })
        if(!course){
            return new NextResponse("Not Found",{status:404});
        }
        const hasPublished = course.chapters.some((chapter) => chapter.isPublished)
        if(!course.title || !course.description || !course.imageUrl || !course.categoryId || !hasPublished){
            return new NextResponse("Missing Fields",{status:401})
        }
        const publishedCourse = await db.course.update({
            where: {
                id: params.courseId,
                userId
            },
            data:{
                isPublished:true
            }
        })
        return NextResponse.json(publishedCourse)
    }catch (err){
        console.log("[COURSE_ID_PUBLISH]",err)
        return new NextResponse("Internal Server Error",{status:500})
    }
}