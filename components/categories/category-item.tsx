"use client"
import {IconType} from "react-icons";
import {cn} from "@/lib/utils";
import {usePathname, useRouter, useSearchParams} from "next/navigation";
import qs from "query-string"
interface CategoryItem{
    label:string,
    value?:string,
    icon?:IconType
}

const CategoryItem = ({label,value,icon:Icon}:CategoryItem) => {
    const pathname = usePathname();
    const router = useRouter();
    const searchParams = useSearchParams()
    const currentCategoryId = searchParams.get("categoryId");
    const currentTitle = searchParams.get("title");
    const IsSelected = currentCategoryId === value;

    const onClick = () => {
        const url = qs.stringifyUrl({url:pathname,
            query:{
                title: currentTitle,
                categoryId: IsSelected ? 'null' : value
            }},{skipNull:true,skipEmptyString:true});
        router.push(url)
    }
    return(
            <button className={cn("py-2 px-3 hover:text-red-800 text-sm border-slate-200 rounded-full flex items-center gap-x-1 transition",
           IsSelected && "border-sky-700 bg-sky-200/70 text-sky-800" )} type={"button"} onClick={onClick}>
            {Icon && <Icon size={20}/>}
            <div className="truncate">{label}</div>
            </button>
    )
}
export default CategoryItem