import {NextResponse} from "next/server";
import {auth} from "@clerk/nextjs/server";
import {db} from "@/lib/db";

export async function PATCH(
    req:Request,
    {params}:{params:{courseId:string,chapterId:string}}
){
    try{
        const {userId} = auth()

        if(!userId){
            return new NextResponse("Unauthorized",{status:401})
        }
        const courseOwner = await db.course.findUnique({
            where:{
                id:params.courseId,
                userId:userId,
            }
        })
        if(!courseOwner){
            return new NextResponse("Unauthorized",{status:401})
        }

        const chapter = await db.chapter.findUnique({
            where:{
                id:params.chapterId,
                courseId:params.courseId
            }
        })
        const unPublishedChapter = await db.chapter.update({
            where:{
                id:params.chapterId,
                courseId:params.courseId,
            },
            data:{
              isPublished:false,
            }
        })

        const publishedChaptesInCourse = await db.chapter.findMany({
            where:{
                courseId:params.courseId,
                isPublished:true
            }
        })
        if(!publishedChaptesInCourse.length){
            await db.course.update({
                where:{
                    id:params.courseId
                },
                data:{
                    isPublished:false
                }
            })
        }

        return NextResponse.json(unPublishedChapter)
    }
    catch(err){
        console.log("[UNPUBLISH]",err)
        return new  NextResponse("Internal Server Error",{status:500})
    }
}