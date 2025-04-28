import { usePathname } from "@/routes/hooks";
import Heading from "./heading";
import UserNav from "./user-nav";
import { ModeToggle } from "./theme-toggle";
import { useMatchedPath } from "@/hooks/use-matched-path";
import { SidebarTrigger } from "../ui/sidebar";

export default function MobileHeader() {
  const pathname = usePathname();
  const headingText = useMatchedPath(pathname);

  return (
    <div className="flex flex-1 items-center justify-between bg-secondary px-4 ">
      {/* <Heading title={headingText} /> */}
      <SidebarTrigger />
       {/* <img src="/logo.svg" alt="Logo" className="w-24 h-16 bg-red-500" /> */}
      <div className="flex items-center ">
        <UserNav />
        <ModeToggle />
      </div>
    </div>
  );
}
