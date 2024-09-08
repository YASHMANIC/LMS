"use client"

import dynamic from "next/dynamic";
import 'react-quill/dist/quill.snow.css';

import {useMemo} from "react";

interface PreviewProps{
    value:string
}

const Preview = ({value}:PreviewProps) =>{
    const ReactQuill = useMemo(() => dynamic(() => import("react-quill"),{ssr:false} )
        ,[])
    return(
            <ReactQuill theme="bubble" value={value} readOnly />
    )
}
export default Preview