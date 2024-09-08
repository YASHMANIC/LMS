"use client"
import {Loader2, Lock} from "lucide-react";
import {useState} from "react";
import MuxPlayer from "@mux/mux-player-react";
import {cn} from "@/lib/utils";
import {useRouter} from "next/navigation";
import {useConfettiStore} from "@/hooks/use-confetti-store";
import toast from "react-hot-toast";
import axios from "axios";

interface VideoPlayerProps {
    chapterId: string
    courseId: string
    playbackId: string
    nextChapterId?: string
    isLocked:boolean
    completeOnEnd:boolean
    title:string
}
const VideoPlayer = ({chapterId,courseId,playbackId,nextChapterId,isLocked,completeOnEnd,title}:VideoPlayerProps) => {
    const [isReady, setIsReady] = useState(false)
    const router = useRouter();
    const confetti = useConfettiStore();
    const onEnd = async() => {
        try {
            if(completeOnEnd){
                await axios.put(`/api/courses/${courseId}/chapters/${chapterId}/progress`,{
                    isCompleted:true
                })
                if(!nextChapterId){
                    confetti.onOpen()
                }
                if (nextChapterId){
                router.push(`/courses/${courseId}/chapters/${nextChapterId}`)
            }
                toast.success("Progress Updated")
                router.refresh()
            }
        }catch{
            toast.error("Something Went Wrong")
        }
    }
    return(
        <div className="relative aspect-video">
            {!isReady && !isLocked && (
                <div className="absolute inset-0 flex items-center justify-center bg-slate-800">
                    <Loader2 className="h-8 w-8 animate-spin text-secondary"/>
                </div>
            )}
            {isLocked && (
                <div className="absolute inset-0 flex items-center justify-center bg-slate-800 flex-col gap-x-2 text-secondary">
                    <Lock className="h-8 w-8"/>
                    <p className={"text-sm"}>This Chapter is Locked</p>
                </div>
            )}
            {!isLocked && (
                <MuxPlayer title={title} className={cn(!isReady && "hidden")}
                playbackId={playbackId}
                onCanPlay={() => setIsReady(true)}
                onEnded={onEnd}
                autoPlay
                />
            )}
        </div>
    )
}
export default VideoPlayer