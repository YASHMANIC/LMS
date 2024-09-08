import {currentUser} from "@clerk/nextjs/server";
import {NextResponse} from "next/server";
import {db} from "@/lib/db";
import Stripe from "stripe";
import {stripe} from "@/lib/stripe";

export async function POST(req:Request,{params}:{params:{courseId:string}}){
    try{
        const user = await currentUser();
        if(!user || !user.id || !user.emailAddresses?.[0]?.emailAddress){
            return new NextResponse("Unauthorized",{status:401})
        }
        const course = await db.course.findUnique({
            where:{
                isPublished:true,
                id:params.courseId
            }
        })

        const purchase = await db.purchase.findUnique({
            where:{
                courseId_userId:{
                    userId:user.id,
                    courseId:params.courseId
                }
            }
        });
        if(purchase){
            return new NextResponse("Already Purchased",{status:400})
        }
        if(!course)
        {
            return new NextResponse("Not Found",{status:400})
        }
        const line_items : Stripe.Checkout.SessionCreateParams.LineItem [] = [
            {
                quantity:1,
                price_data:{
               currency:"INR",
               product_data:{
                   name:course.title,
               },
               unit_amount:Math.round(course.price! * 100)
           }
            }
        ]
        let stripeCustomer = await db.stripeCustomer.findUnique({
            where:{
                userId:user.id
            },
            select:{
                StripeCustomerId:true
            }
        })
        if(!stripeCustomer){
           const customer = await stripe.customers.create({
                email:user.emailAddresses[0].emailAddress
            })
            stripeCustomer = await db.stripeCustomer.create({
                data:{
                    userId:user.id,
                    StripeCustomerId:customer.id
                }
            })
        }
        const session = await stripe.checkout.sessions.create({
            customer:stripeCustomer.StripeCustomerId,
        line_items,
        mode:'payment',
            billing_address_collection:"required",
        phone_number_collection:{
            enabled:true
        },
        success_url:`${process.env.NEXT_PUBLIC_APP_URL}/courses/${course.id}?success=1`,
        cancel_url:`${process.env.NEXT_PUBLIC_APP_URL}/courses/${course.id}?canceled=1`,
        metadata:{
            courseId:course.id,
            userId:user.id
        }
    })
        return NextResponse.json({url:session.url})
    }catch(err){
        console.log("[]",err)
        return new NextResponse("Internal Server Error",{status:500})
    }
}