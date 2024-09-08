"use client"

import {Button} from "@/components/ui/button";
import {Trash} from "lucide-react";
import ConfirmModal from "@/components/modals/confirm-modal";
import {useState} from "react";
import toast from "react-hot-toast";
import axios from "axios";
import {useRouter} from "next/navigation";

interface ChapterActions{
    disabled:boolean,
    courseId:string,
    chapterId:string,
    isPublished:boolean
}

const ChapterActions = ({disabled,chapterId,courseId,isPublished}:ChapterActions) =>{
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const onDelete = async () => {
        try {
            setIsLoading(true)
            await axios.delete(`/api/courses/${courseId}/chapters/${chapterId}`)
            toast.success("Chapter Deleted Successfully")
            router.push(`/teacher/courses/${courseId}`)
            router.refresh();
        }catch{
            toast.error("Something Went Wrong")
        }
        finally {
            setIsLoading(false);
        }
    }
    const onClick =async () => {
        try {
            setIsLoading(true)
            if (isPublished){
                await axios.patch(`/api/courses/${courseId}/chapters/${chapterId}/unpublish`)
                toast.success("Unpublished Successfully")
            }else{
                await axios.patch(`/api/courses/${courseId}/chapters/${chapterId}/publish`)
                toast.success("Published Successfully")
            }
            router.refresh()
        }catch {
            toast.error("Something Went Wrong")
        }
        finally {
            setIsLoading(false)
        }
    }
    return(
        <div className="flex items-center gap-x-2">
            <Button onClick={onClick} disabled={disabled || isLoading} variant={"outline"} size={"sm"}>
                {isPublished ? "Unpublish" : "Publish"}
            </Button>
            <ConfirmModal onConfirm={onDelete}>
                <Button size={"sm"} variant={"default"} disabled={isLoading}>
                <Trash className="h-4 w-4"/>
            </Button>
            </ConfirmModal>
        </div>
    )
}
export default ChapterActions