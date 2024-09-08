import {auth} from "@clerk/nextjs/server";
import {redirect} from "next/navigation";
import {GetChapter} from "@/actions/get-chapter";
import Banner from "@/components/banner";
import VideoPlayer from "@/components/video-player";
import CourseEnroll from "@/components/course-enroll";
import {Separator} from "@/components/ui/separator";
import Preview from "@/components/preview";
import {File} from "lucide-react";
import CourseProgressButton from "@/components/course-progress-button";

const ChapterIdPage =async ({params}:{params:{courseId:string,chapterId:string}}) => {
    const {userId} = auth()
    if(!userId){
        return redirect('/')
    }
    const {
        chapter,
                course,
                muxData,
                attachments,
                nextChapter,
                userProgress,
                purchase
    } =await GetChapter({userId,chapterId:params.chapterId,courseId:params.courseId})
    if (!chapter || !course){
                return redirect("/")
            }
    const isLocked = !chapter.isFree && !purchase;
    const completeOnEnd = !!purchase && !userProgress?.isCompleted

    return(
        <div>
            {userProgress?.isCompleted && (
                <Banner variant={"success"} label={"You are Already Completed"}/>
            )}
            {isLocked && (
                <Banner variant={"warning"} label={"You need to Purchase This Course "}/>
            )}
            <div className="flex flex-col mx-w-4xl pb-20 mx-auto">
                <div className="p-4">
                    <VideoPlayer chapterId={params.chapterId}
                                 title={chapter.title}
                                 courseId={params.courseId}
                                 nextChapterId={nextChapter?.id}
                                 playbackId={muxData?.playbackId!}
                                 isLocked={isLocked}
                                 completeOnEnd={completeOnEnd}
                    />
                </div>
                <div>
                    <div className="flex flex-col md:flex-col items-center justify-between p-4">
                        <h2 className={"text-2xl font-medium mb-2"}>{chapter.title}</h2>
                        {purchase ? (
                            <div>
                                <CourseProgressButton chapterId={params.chapterId} courseId={params.courseId}
                                nextChapterId={nextChapter?.id} isCompleted={!!userProgress?.isCompleted}/>
                            </div>
                        ) : (
                            <CourseEnroll courseId={params.courseId} price={course.price!}/>
                        )}
                    </div>
                    <Separator/>
                    <div>
                        <Preview value={chapter.description!}/>
                    </div>
                    {!!attachments.length && (
                       <>
                            <Separator/>
                        <div className="p-4">
                            {attachments.map((attachment) => (
                                <a key={attachment.id} href={attachment.url} target={"_blank"}
                                className={"flex items-center p-3 w-full bg-sky-200 border text-sky-700 rounded-md hover:underline"}>
                                    <File/>
                                    <p className="line-clamp-1">{attachment.name}</p>
                                </a>
                            ))}
                        </div>
                       </>
                        )}
                </div>
            </div>
        </div>
    )
}
export default ChapterIdPage