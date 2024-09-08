import {auth} from "@clerk/nextjs/server";
import {redirect} from "next/navigation";
import {db} from "@/lib/db";
import Link from "next/link";
import {ArrowLeft, Eye, LayoutDashboard, Video} from "lucide-react";
import {IconBadge} from "@/components/icon-badge";
import ChapterTitleForm from "@/components/chapter/chapter-title-form";
import ChapterDescriptionForm from "@/components/chapter/chapter-description-form";
import ChapterAccessForm from "@/components/chapter/chapter-access-form";
import ChapterVideoForm from "@/components/chapter/chapter-video-form";
import Banner from "@/components/banner";
import ChapterActions from "@/components/chapter/chapter-actions";

const ChapterId =async ({params}:{params:{courseId:string,chapterId:string}}) => {
    const {userId} = auth()
    if(!userId){
        return redirect('/')
    }
    const chapter = await db.chapter.findUnique({
        where:{id:params.chapterId,courseId:params.courseId},
        include:{muxData:true}
    });
    if(!chapter){
        return redirect('/')
    }
    const requiredFields = [
        chapter.title,
        chapter.description,
        chapter.videoUrl
    ]
    const totalLength = requiredFields.length;
    const completedFields = requiredFields.filter(Boolean).length;
    const CompletionText = `(${completedFields}/${totalLength})`
    const isComplete = requiredFields.every(Boolean);
    return (
        <>
            {!chapter.isPublished && (
                <Banner label={"This Chapter is Unpublished And Not Visible In Course"} variant={"warning"}/>
            )}
            <div className="p-6">
                <div className="flex items-center justify-between">
                    <div className="w-full">
                        <Link href={`/teacher/courses/${params.courseId}`}
                              className="flex items-center text-sm hover:opacity-75 mb-6 transition">
                            <ArrowLeft className="h-4 w-4 mr-2"/>
                            Back to Course SetUp
                        </Link>
                        <div className={"flex items-center justify-between w-full"}>
                            <div className="flex flex-col gap-x-2">
                                <h1 className="text-2xl font-medium">Chapter Creation</h1>
                                <span className="text-sm text-slate-700">Complete All Fields - {CompletionText}</span>
                            </div>
                            <ChapterActions disabled={!isComplete} chapterId={params.chapterId} courseId={params.courseId} isPublished={chapter.isPublished}/>
                        </div>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 mt-16 gap-6">
                    <div className="space-y-4">
                        <div>
                            <div className="flex items-center gap-x-2">
                                <IconBadge icon={LayoutDashboard}/>
                                <h2 className="text-xl">Customize Your Chapter</h2>
                            </div>
                            <ChapterTitleForm initialData={chapter} courseId={params.courseId}
                                              chapterId={params.chapterId}/>
                            <ChapterDescriptionForm initialData={chapter} courseId={params.courseId}
                                                    chapterId={params.chapterId}/>
                        </div>
                        <div>
                            <div className="flex items-center gap-x-2">
                                <IconBadge icon={Eye}/>
                                <h2 className="text-xl">Access Settings</h2>
                            </div>
                            <ChapterAccessForm initialData={chapter} courseId={params.courseId}
                                               chapterId={params.chapterId}/>
                        </div>
                    </div>
                    <div>
                        <div className="flex items-center gap-x-2">
                            <IconBadge icon={Video}/>
                            <h2 className="text-xl">Add a Video</h2>
                        </div>
                        <ChapterVideoForm initialData={chapter} courseId={params.courseId}
                                          chapterId={params.chapterId}/>
                    </div>
                </div>
            </div>
        </>
    )
}
export default ChapterId;