"use client"


import * as z from 'zod'
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Button} from "@/components/ui/button";
import {Pencil} from "lucide-react";
import {useState} from "react";
import {Form, FormControl, FormDescription, FormField, FormItem, FormMessage} from "@/components/ui/form";
import toast from "react-hot-toast";
import axios from "axios";
import {useRouter} from "next/navigation";
import {cn} from "@/lib/utils";
import {Chapter} from "@prisma/client";
import Editor from "@/components/editor";
import Preview from "@/components/preview";
import {ChapterAccess} from "@/schemas";
import {Checkbox} from "@/components/ui/checkbox";

interface ChapterAccessFormProps{
         initialData:Chapter,
    courseId:string,
    chapterId:string
}

const ChapterAccessForm = ({initialData, courseId,chapterId}:ChapterAccessFormProps) => {
    const [isEditing,setIsEditing] = useState(false)
    const toggleEdit = () => setIsEditing((current) => !current)
    const router = useRouter()
    const form = useForm<z.infer<typeof ChapterAccess>>({
        resolver:zodResolver(ChapterAccess),
        defaultValues: {
            isFree: Boolean(initialData.isFree)
        },
    })
    const {isSubmitting,isValid} = form.formState
    const onSubmit =async (values:z.infer<typeof ChapterAccess>) =>{
       try {
        await axios.patch(`/api/courses/${courseId}/chapters/${chapterId}`,values)
           toast.success("Chapter Access Updated")
           toggleEdit()
           router.refresh()
       }catch{
           toast.error("Something Went Wrong")
       }
    }
    return (
        <div className="mt-6 border bg-slate-100 rounded-md p-4">
            <div className="font-medium flex items-center justify-between">
                Chapter Access
                  <Button onClick={toggleEdit} variant={"ghost"}>
                      {isEditing ? (
                    <>
                        Cancel
                    </>
                ): (
                    <>
                        <Pencil className="h-4 w-4 mr-2"/>
                    Edit Access
                    </>
                      )}
                </Button>
            </div>
            {!isEditing && (
                <div className={cn("text-sm mt-2",!initialData.description && "text-slate-500 italic")}>
                    {!initialData.description && "No description"}
                    {initialData.isFree ? (
                        <>
                            This Chapter is Free to Everyone
                        </>
                    ) : (
                        <>This Chapter is Not Free</>
                    )}
                </div>
            )}
            {isEditing && (
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
                        <FormField control={form.control} name={"isFree"}
                        render={({field}) => (
                            <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-4">
                                <FormControl>
                                    <Checkbox checked={field.value} onCheckedChange={field.onChange}/>
                                </FormControl>
                                <div className="space-y-1">
                                    <FormDescription>
                                        Check this Box if you want to free this course
                                    </FormDescription>
                                </div>
                                <FormMessage/>
                            </FormItem>
                        )}
                        />
                        <div className="flex items-center gap-x-2">
                            <Button disabled={!isValid || isSubmitting} type={"submit"}>
                                Save
                            </Button>
                        </div>
                    </form>
                </Form>
            )}
        </div>
    )
}
export default ChapterAccessForm