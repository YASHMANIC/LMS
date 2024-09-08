import * as z from 'zod'

export const CreateSchema = z.object({
    title: z.string().min(1,{
        message:"Title Is Required"
    })
})

export const FormSchema = z.object({
     title: z.string().min(1,{
        message:"Title Is Required"
    })
})

export const DescriptionSchema = z.object({
     description: z.string().min(1,{
        message:"Description Is Required"
    })
})

export const ImageSchema = z.object({
        imageUrl: z.string().min(1,{
        message:"ImageUrl Is Required"
    })
})

export const CategorySchema = z.object({
        categoryId: z.string().min(1,{
        message:"ImageUrl Is Required"
    })
})

export const PriceSchema = z.object({
        price:z.coerce.number(),
})

export const AttachmentSchema = z.object({
        Url: z.string().min(1,{
        message:"Url Is Required"
    })
})

export const ChapterSchema = z.object({
    title: z.string().min(1,{
        message:"Title Is Required"
    })
})

export const ChapterTitle = z.object({
    title:z.string().min(1)
})

export const ChapterDescription = z.object({
    description:z.string().min(1)
})

export const ChapterAccess = z.object({
    isFree:z.boolean().default(false)
})

export const ChapterVideo = z.object({
    videoUrl: z.string().min(1)
})
