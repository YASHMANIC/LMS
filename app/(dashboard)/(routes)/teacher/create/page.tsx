"use client"

import {useRouter} from "next/navigation";
import * as z from 'zod'
import {useForm} from "react-hook-form";
import {CreateSchema} from "@/schemas";
import {zodResolver} from "@hookform/resolvers/zod";
import {Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import Link from "next/link";
import {Button} from "@/components/ui/button";
import toast from "react-hot-toast";
import axios from "axios";
const CreatePage = () => {
    const router = useRouter()
    const form = useForm<z.infer<typeof CreateSchema>>({
        resolver:zodResolver(CreateSchema),
        defaultValues:{
            title: ""
        }
    })
    const {isSubmitting,isValid} = form.formState
    const onSubmit =async (values:z.infer<typeof CreateSchema>) => {
        try{
            const response = await axios.post('/api/courses',values)
            router.push(`/teacher/courses/${response.data.id}`)
            toast.success("Course successfully created!")
        }catch{
            toast.error("Something went wrong")
        }
    }
    return (
        <div className="max-w-5xl mx-auto flex md:items-center md:justify-center h-full p-6">
            <div>
                <h1 className="text-2xl">Create a Course</h1>
                <p className="text-sm text-zinc-500">What Would you Categorize Don&apos;t Worry You Can Change It Later</p>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 mt-8">
                        <FormField control={form.control} name={"title"}
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>Name a Course</FormLabel>
                                <FormControl>
                                    <Input disabled={isSubmitting} placeholder={"example"} {...field}/>
                                </FormControl>
                                <FormDescription>
                                    What Will You Teach In This Course
                                </FormDescription>
                                <FormMessage/>
                            </FormItem>
                        )}
                        />
                        <div className=" flex items-center gap-x-2">
                            <Link href={'/'}>
                                <Button disabled={isSubmitting} type="button" variant="ghost">
                                    Cancel
                                </Button>
                            </Link>
                            <Button type="submit" disabled={isSubmitting || !isValid}>
                                Continue
                            </Button>
                        </div>
                    </form>
                </Form>
            </div>
        </div>
    )
}
export default CreatePage