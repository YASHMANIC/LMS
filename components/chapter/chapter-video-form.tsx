"use client"

import * as z from 'zod'
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Button} from "@/components/ui/button";
import {ImageIcon, Pencil, PlusCircle, VideoIcon} from "lucide-react";
import {useState} from "react";
import toast from "react-hot-toast";
import axios from "axios";
import {useRouter} from "next/navigation";
import {ChapterVideo, ImageSchema} from "@/schemas";
import {Chapter,MuxData} from "@prisma/client";
import Image from "next/image";
import FileUpload from "@/components/file-upload";
import MuxPlayer from "@mux/mux-player-react";

interface ChapterVideoFormProps{
         initialData:Chapter & {muxData? : MuxData | null},
         courseId:string,
         chapterId:string
}

const ChapterVideoForm = ({initialData, courseId, chapterId}:ChapterVideoFormProps) => {
    const [isEditing,setIsEditing] = useState(false)
    const toggleEdit = () => setIsEditing((current) => !current)
    const router = useRouter()
    const onSubmit =async (values:z.infer<typeof ChapterVideo>) =>{
       try {
        await axios.patch(`/api/courses/${courseId}/chapters/${chapterId}`,values)
           toast.success("Chapter Updated")
           toggleEdit()
           router.refresh()
       }catch{
           toast.error("Something Went Wrong")
       }
    }
    return (
        <div className="mt-6 border bg-slate-100 rounded-md p-4">
            <div className="font-medium flex items-center justify-between">
                Course Video
                  <Button onClick={toggleEdit} variant={"ghost"}>
                      {isEditing && (
                    <>
                        Cancel
                    </>
                )}
                      {!isEditing && !initialData.videoUrl && (
                          <>
                              <PlusCircle className="h-4 w-4 mr-2"/>
                              Add an Video
                          </>
                      )}
                      {!isEditing && initialData.videoUrl &&(
                    <>
                        <Pencil className="h-4 w-4 mr-2"/>
                    Edit Video
                    </>
                      )}
                </Button>
            </div>
            {!isEditing && (
                !initialData.videoUrl ? (
                    <div className="flex items-center justify-center h-60 bg-slate-200 rounded-md">
                        <VideoIcon className={"h-10 w-10 text-slate-500"}/>
                    </div>
                ) :(
                    <div className="relative aspect-video mt-2">
                   <MuxPlayer playbackId={initialData?.muxData?.playbackId || ""}/>
                </div>
                )
            )}
            {isEditing && (
               <div>
                   <FileUpload onChange={(url)=>{
                       if (url){
                           onSubmit({videoUrl: url})
                       }
                   }} endpoint={'courseVideo'}/>
                   <div className="text-xs text-muted-foreground mt-4">
                      Upload this chapter&apos; video
                   </div>
               </div>
            )}
            {initialData.videoUrl && !isEditing  && (
                <div className="text-sm text-muted-foreground mt-2">
                    Video can Minutes few minutes to upload to upload. Refresh the page if video doesn&apos; appear
                </div>
            )}
        </div>
    )
}
export default ChapterVideoForm