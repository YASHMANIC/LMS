import {UserButton} from "@clerk/nextjs";
import {auth} from "@clerk/nextjs/server";
import {redirect} from "next/navigation";
import {GetDashboardCourses} from "@/actions/get-dashboard-courses";
import CoursesList from "@/components/courses-list";
import {CheckCircle, Clock} from "lucide-react";
import InfoCard from "@/components/Dashboard/info-card";

const Page =async () => {
    const {userId} = auth()
    if(!userId){
        return redirect("/");
    }
    const {completedCourses,courseInProgress} = await GetDashboardCourses(userId)
    return(
        <div className="p-6 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2">
                <InfoCard icon={Clock} numberOfItems={courseInProgress.length} label={"In Progress"} />
                <InfoCard icon={CheckCircle} numberOfItems={completedCourses.length} label={"Completed"} variant={"success"}/>
            </div>
            <CoursesList items={[...courseInProgress,...completedCourses]}/>
        </div>
    )
}

export default Page