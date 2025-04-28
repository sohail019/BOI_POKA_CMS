import * as React from "react";
import { Book, LogOut, SquareTerminal, Users } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import { NavMenu } from "./nav-menu";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { logout } from "@/store/slices/auth-slice";
import { useNavigate } from "react-router";

const data = {
  menu: [
    {
      name: "Dashboard",
      url: "/dashboard",
      icon: SquareTerminal,
    },
    {
      name: "Admins",
      url: "/admins",
      icon: Users,
    },
    {
      name: "Users",
      url: "/users",
      icon: Users,
    },
    {
      name: "Books",
      url: "/books",
      icon: Book,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { userType } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const navigateTo = useNavigate();
  const filteredNavMain = data.menu.filter((item) => {
    if (userType === "SuperAdmin") {
      return true;
    }
    if (userType === "Admin") {
      return item.name !== "Admins";
    }
    return false;
  });

  const handleLogout = () => {
    console.log("Logout button clicked");

    dispatch(logout());
    console.log("User type:", userType);
    const redirectPath =
      userType === "SuperAdmin" ? "/superadmin-login" : "/admin-login";
    console.log(`Redirecting to ${redirectPath}`);
    navigateTo(redirectPath);
    // if (userType === "SuperAdmin") {
    //   console.log("Redirecting to /superadmin-login");
    //   navigateTo("/superadmin-login");
    // } else  {
    //   console.log("Redirecting to /admin-login");
    //   navigateTo("/admin-login");
    // }
  };

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <img
          src="/logo.png"
          alt="Logo"
          className="w-12 bg-none dark:bg-white"
        />
      </SidebarHeader>
      <SidebarContent>
        {/* <NavMain items={filteredNavMain} /> */}
        <NavMenu menu={filteredNavMain} />
      </SidebarContent>
      <SidebarFooter>
        {/* <NavUser user={data.user} /> */}
        <button
          className="flex items-center p-2 mt-4 text-sm font-medium rounded-md"
          onClick={handleLogout}
        >
          <LogOut className="w-5 h-5 mr-2" />
          <span>Logout</span>
        </button>
        {/* <UserNav /> */}
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
