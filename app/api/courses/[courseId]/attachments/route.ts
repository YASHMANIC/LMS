import {NextResponse} from "next/server";
import {auth} from "@clerk/nextjs/server";
import {db} from "@/lib/db";
import {isTeacher} from "@/actions/get-teacher";

export async function POST(req:Request,{params}:{params:{courseId:string}}){
    try{
        const {userId} = auth()
        const {Url} = await req.json()

        if(!userId || !isTeacher(userId)){
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
        const attachment = await db.attachment.create({
            data:{
                url:Url,
                name:Url.split("/").pop(),
                courseId:params.courseId
            }
        })
        return NextResponse.json(attachment)
    }catch(err){
        console.log("[ATTACHMENTS_POST]",err);
        return new  NextResponse("Internal Server Error",{status:500})
    }
}