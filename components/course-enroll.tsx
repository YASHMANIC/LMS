"use client"
import {Button} from "@/components/ui/button";
import {FormatPrice} from "@/lib/format";
import {useState} from "react";
import toast from "react-hot-toast";
import axios from "axios";

interface CourseEnrollProps{
    courseId:string
    price:number
}
const CourseEnroll = ({courseId,price}:CourseEnrollProps) => {
    const [isLoading, setIsLoading] = useState(false)
    const onClick = async () =>{
        try {
            setIsLoading(true)
            const response = await axios.post(`/api/courses/${courseId}/checkout`)

            window.location.assign(response.data.url);
        }catch{
            toast.error("Something Went Wrong")
        }
        finally {
            setIsLoading(false)
        }
    }
    return(
        <Button onClick={onClick} disabled={isLoading} className="w-full md:w-auto" size="lg">
            Enroll For {FormatPrice(price)}
        </Button>
    )
}
export default CourseEnroll