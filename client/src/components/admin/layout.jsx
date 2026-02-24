import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import AdminHeader from "./header";
import AdminSidebar from "./sidebar";
import { useAuth } from "@clerk/clerk-react";

const AdminLayout = () => {
  const {getToken} = useAuth()
  const [openSideBar, setOpenSideBar] = useState(false);
  const [token, setToken] = useState(null);

  useEffect(() => {
    async function init() {
      setToken(await getToken());
      if (!token) return;
    }

    init();
  }, []);

  return (
    <div className="w-[100%] h-screen flex overflow-x-hidden">
      <div className="w-1/5 h-full border-2 border-red-50 hidden lg:block">
        <AdminSidebar open={openSideBar} setOpen={setOpenSideBar} />
      </div>
      <div className="w-[100%] h-screen flex flex-col">
        <div>
          <AdminHeader setOpen={setOpenSideBar} />
        </div>
        <div className="w-full h-auto bg-blue-50">
          <Outlet token={token} />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
