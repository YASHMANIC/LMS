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
            }
        })
        if(!course){
            return new NextResponse("Not Found",{status:404});
        }
        const unPublishedCourse = await db.course.update({
            where: {
                id: params.courseId,
                userId
            },
            data:{
                isPublished:false
            }
        })
        return NextResponse.json(unPublishedCourse)
    }catch (err){
        console.log("[COURSE_ID_UNPUBLISH]",err)
        return new NextResponse("Internal Server Error",{status:500})
    }
}