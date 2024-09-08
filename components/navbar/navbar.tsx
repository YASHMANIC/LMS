import MobileSidebar from "@/components/sidebar/mobile-sidebar";
import NavbarRoutes from "@/components/navbar/navbar-routes";

const Navbar = () => {
    return (
        <div className="p-4 border-b h-full flex items-center bg-white shadow-sm">
             <MobileSidebar/>
            <NavbarRoutes/>
        </div>
    )
}
export default Navbar