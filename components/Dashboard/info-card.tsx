import {LucideIcon} from "lucide-react";
import {IconBadge} from "@/components/icon-badge";

interface InfoCardProps{
    label:string
    numberOfItems:number
    variant? : "default" | "success"
    icon:LucideIcon
}

const InfoCard = ({label,numberOfItems,variant,icon:Icon}:InfoCardProps) =>{
    return(
        <div className="border rounded-md flex items-center gap-x-2 p-3">
            <IconBadge icon={Icon} variant={variant}/>
            <div>
                <p className="font-medium">
                    {label}
                </p>
                <p className="text-slate-500 text-sm">
                    {numberOfItems} {numberOfItems === 1 ? "Course" : "Courses"}
                </p>
            </div>
        </div>
    )
}
export default InfoCard