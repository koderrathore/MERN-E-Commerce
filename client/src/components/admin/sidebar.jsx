import {
  BadgeCheck,
  ChartNoAxesCombined,
  LayoutDashboard,
  ShoppingBasket,
} from "lucide-react";
import React from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "../ui/sheet";

const AdminSidebar = ({ open, setOpen }) => {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="left" className="w-72">
          <SheetHeader>
            <SheetTitle >
                <div className="text-3xl font-extrabold flex items-center justify-start mt-4 gap-2">

              <ChartNoAxesCombined  size={30}/>
              Admin Panel
                </div>
            </SheetTitle>
          </SheetHeader>
          <div className="text-2xl flex flex-col gap-10 mt-20 justify-center">
            <h1
              onClick={() => {
                navigate("/admin/dashboard");
                setOpen(false)
            }}
            className="flex gap-2 text-muted-foreground hover:text-foreground items-center cursor-pointer"
            >
              <LayoutDashboard /> Dashboard
            </h1>
            <h1
              onClick={() => {
                  navigate("/admin/products");
                  setOpen(false)
                }}
                className="flex gap-2 text-muted-foreground hover:text-foreground items-center cursor-pointer"
                >
              <ShoppingBasket /> Products
            </h1>
            <h1
              onClick={() => {
                  navigate("/admin/orders");
                  setOpen(false)
              }}
              className="flex gap-2 text-muted-foreground hover:text-foreground items-center cursor-pointer"
            >
              <BadgeCheck /> Orders
            </h1>
          </div>
        </SheetContent>
      </Sheet>
      <div
        onClick={() => {
          navigate("/admin/dashboard");
        }}
        className="flex flex-col cursor-pointer"
      >
        <h1 className="text-3xl font-extrabold flex items-center text-center justify-center mt-4 gap-2">
          <ChartNoAxesCombined size={30}/>
          Admin Panel
        </h1>
      </div>

      <div className="text-2xl flex flex-col gap-10 mt-20 pl-10">
        <h1
          onClick={() => {
            navigate("/admin/dashboard");
          }}
          className="flex gap-2 text-muted-foreground hover:text-foreground items-center cursor-pointer"
        >
          <LayoutDashboard /> Dashboard
        </h1>
        <h1
          onClick={() => {
            navigate("/admin/products");
          }}
          className="flex gap-2 text-muted-foreground hover:text-foreground items-center cursor-pointer"
        >
          <ShoppingBasket /> Products
        </h1>
        <h1
          onClick={() => {
            navigate("/admin/orders");
          }}
          className="flex gap-2 text-muted-foreground hover:text-foreground items-center cursor-pointer"
        >
          <BadgeCheck /> Orders
        </h1>
      </div>
    </div>
  );
};

export default AdminSidebar;
