"use client"

import {Category} from "@prisma/client";
import {FcFlowChart ,FcServices,FcSynchronize,FcIdea,FcSteam,FcSmartphoneTablet,FcCommandLine} from "react-icons/fc"
import {IconType} from "react-icons";
import CategoryItem from "@/components/categories/category-item";



interface CategoriesProps{
    items:Category[]
}
const iconMap : Record<Category["name"], IconType> = {
   "FRONT END" : FcSmartphoneTablet,
    "BACK END" : FcServices,
    "FULL STACK" : FcFlowChart ,
    "CLOUD" : FcSynchronize,
    "DATABASE" : FcCommandLine,
    "MACHINE LEARNING" : FcSteam,
    "ARTIFICIAL INTELLIGENCE" : FcIdea
}

const Categories = ({items}:CategoriesProps) => {
        return(
            <div className="flex items-center gap-x-2 overflow-x-auto pb-2">
                {items.map((item) => (
                    <CategoryItem key={item.id} label={item.name} icon={iconMap[item.name]} value={item.id}/>
                ))}
            </div>
        )
}
export default Categories