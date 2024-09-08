import {auth} from "@clerk/nextjs/server";
import {redirect} from "next/navigation";
import {db} from "@/lib/db";
import {IconBadge} from "@/components/icon-badge";
import {ArrowLeft, FileBadge, IndianRupee, LayoutDashboard, ListChecks} from "lucide-react";
import TitleForm from "@/components/courses/title-form";
import DescriptionForm from "@/components/courses/description-form";
import ImageForm from "@/components/courses/image-form";
import CategoryForm from "@/components/courses/category-form";
import PriceForm from "@/components/courses/price-form";
import AttachmentForm from "@/components/courses/attachment-form";
import ChapterForm from "@/components/courses/chapter-form";
import Banner from "@/components/banner";
import Actions from "@/components/courses/actions";
import Link from "next/link";

const CoursePage =async ({params}:{params:
{
    courseId:string
}}) =>{
    const {userId} = auth()
    if(!userId){
        return redirect("/")
    }
    const course = await db.course.findUnique({
        where:{
            id:params.courseId,
            userId,
        },
        include:{
            chapters:{
                orderBy:{
                    position:"asc"
                }
            },
            attachments:{
                orderBy:{
                    createdAt:"desc"
                }
            }
        }
    })
    const categories = await db.category.findMany({
        orderBy:{
            name:"asc"
        }
    })
    if(!course){
        return redirect("/")
    }
    const requiredFields = [
        course.title,
        course.description,
        course.imageUrl,
        course.price,
        course.categoryId,
        course.chapters.some(chapter => chapter.isPublished)
    ]
    const totalFields = requiredFields.length;
    const completedFields = requiredFields.filter(Boolean).length
    const completionText = `(${completedFields}/${totalFields})`
    const isComplete = requiredFields.every(Boolean)
    return(
        <>
            {!course.isPublished && (
                <Banner label={"This Course Is Unpublished And Not Visible To Students"}/>
            )}
            <div className="p-6 w-full">
                <Link href={'/teacher/courses'} className="flex items-center text-sm hover:opacity-75 mb-6 transition">
                    <ArrowLeft className="h-3 w-3"/>
                Back to Courses
                </Link>
            </div>
            <div className="p-6">
                <div className="flex items-center justify-between">
                    <div className="flex flex-col gap-y-2">
                        <h1 className="text-2xl font-medium">
                            Course SetUp
                        </h1>
                        <span className="text-sm text-slate-700">
                      Complete All Fields {completionText}
                    </span>
                    </div>
                    <Actions disabled={!isComplete} courseId={params.courseId} isPublished={course.isPublished}/>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
                    <div>
                        <div className="flex items-center gap-x-2">
                            <IconBadge icon={LayoutDashboard}/>
                            <h1 className="text-xl">Customize Your Course</h1>
                        </div>
                        <div>
                            <TitleForm initialData={course} courseId={course.id}/>
                            <DescriptionForm initialData={course} courseId={course.id}/>
                            <ImageForm initialData={course} courseId={course.id}/>
                            <CategoryForm initialData={course} courseId={course.id}
                                          options={categories.map((category) => ({
                                              label: category.name,
                                              value: category.id
                                          }))}/>
                        </div>
                    </div>
                    <div className="space-y-8">
                        <div>
                            <div className="flex items-center gap-x2">
                                <IconBadge icon={ListChecks}/>
                                <h2 className="text-xl">Course Chapters</h2>
                            </div>
                            <div>
                                <ChapterForm initialData={course} courseId={course.id}/>
                            </div>
                        </div>
                        <div className="flex items-center gap-x-2">
                            <IconBadge icon={IndianRupee}/>
                            <h2 className="text-xl">Sell This Course</h2>
                        </div>
                        <PriceForm initialData={course} courseId={course.id}/>
                        <div className="flex items-center gap-x-2">
                            <IconBadge icon={FileBadge}/>
                            <h2 className="text-xl">Resources And Attachments</h2>
                        </div>
                        <AttachmentForm initialData={course} courseId={course.id}/>
                    </div>
                </div>
            </div>
        </>
    )
}
export default CoursePage;