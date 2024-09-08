import {NextResponse} from "next/server";
import {auth} from "@clerk/nextjs/server";
import {db} from "@/lib/db";

export async function PUT(req:Request,{params}:{params:{courseId:string,chapterId:string}}){
    try {
       const {userId} = auth()
        const {isCompleted} = await req.json();
        if(!userId){
            return new NextResponse("Unauthorized",{status:401})
        }
        const user_progress = await db.userProgress.upsert({
            where:{
                userId_chapterId:{
                    userId,
                    chapterId:params.chapterId
                }
            },
            update:{
                isCompleted
            },
            create:{
                userId,
                chapterId:params.chapterId,
                isCompleted
            }
        })
        return NextResponse.json(user_progress)
    }catch (err){
        console.log("[PROGRESS_PUT]",err)
        return new NextResponse("Internal Server Error",{status:500})
    }
}