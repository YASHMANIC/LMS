"use client"
import * as z from 'zod'
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Button} from "@/components/ui/button";
import {File, Loader2, Pencil, PlusCircle, X} from "lucide-react";
import {useState} from "react";
import toast from "react-hot-toast";
import axios from "axios";
import {useRouter} from "next/navigation";
import {Attachment, Course} from "@prisma/client";
import FileUpload from "@/components/file-upload";
import {AttachmentSchema} from "@/schemas";

interface AttachmwntFormProps{
         initialData:Course & {attachments:Attachment[]} ,
         courseId:string
}

const AttachmwntForm = ({initialData, courseId}:AttachmwntFormProps) => {
    const [isEditing,setIsEditing] = useState(false)
    const [deletingId,setDeletingId] = useState<string | null>(null)
    const toggleEdit = () => setIsEditing((current) => !current)
    const router = useRouter()
    const form = useForm<z.infer<typeof  AttachmentSchema>>({
        resolver:zodResolver(AttachmentSchema),
        defaultValues: {
            Url: initialData?.imageUrl || ""
        },
    })
    const {isSubmitting,isValid} = form.formState
    const onSubmit =async (values:z.infer<typeof AttachmentSchema>) =>{
       try {
        await axios.post(`/api/courses/${courseId}/attachments`,values)
           toast.success("Course Updated")
           toggleEdit()
           router.refresh()
       }catch{
           toast.error("Something Went Wrong")
       }
    }
    const onDelete = async (id:string) => {
        try {
            setDeletingId(id);
            await axios.delete(`/api/courses/${courseId}/attachments/${id}`)
            router.refresh();
            toast.success("Successfully Deleted")
        }catch{
            toast.error("Something Went Wrong");
        }
        finally {
            setDeletingId(null)
        }
    }
    return (
        <div className="mt-6 border bg-slate-100 rounded-md p-4">
            <div className="font-medium flex items-center justify-between">
                Course Attachments
                  <Button onClick={toggleEdit} variant={"ghost"}>
                      {isEditing && (
                    <>
                        Cancel
                    </>
                )}
                      {!isEditing &&  (
                          <>
                              <PlusCircle className="h-4 w-4 mr-2"/>
                              Add an File
                          </>
                      )}
                </Button>
            </div>
            {!isEditing && (
                <>
                    {initialData.attachments.length === 0 && (
                        <p className={"text-sm text-slate-500 mt-2 italic"}>No Attachments Yet</p>
                    )}
                    {initialData.attachments.length > 0 && (
                        <div className="space-y-2">
                            {initialData.attachments.map((attachment) => (
                                <div key={attachment.id} className="flex items-center p-3 w-full bg-sky-100 border-sky-200
                                border text-sky-700 rounded-md">
                                    <File className="h-4 w-4 mr-2 flex-shrink-0"/>
                                    <p className={"text-sm line-clamp-1"}>{attachment.name}</p>
                                    {deletingId === attachment.id && (
                                        <div>
                                            <Loader2 className={"ml-auto h-4 w-4 animate-spin text-red-600"}/>
                                        </div>
                                    )}
                                    {deletingId !== attachment.id && (
                                        <Button onClick={() => onDelete(attachment.id)} variant={"ghost"} className="ml-auto hover:opacity-75 transition">
                                            <X className={"h-4 w-4"}/>
                                        </Button>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </>
            )}
            {isEditing && (
               <div>
                   <FileUpload onChange={(url)=>{
                       if (url){
                           onSubmit({Url: url})
                       }
                   }} endpoint={"courseAttachments"}/>
                   <div className="text-xs text-muted-foreground mt-4">
                       Add anything that students might need to complete
                   </div>
               </div>
            )}
        </div>
    )
}
export default AttachmwntForm