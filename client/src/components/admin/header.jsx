import React from "react";
import { Button } from "../ui/button";
import { AlignJustify, LogOut } from "lucide-react";
import { useDispatch } from "react-redux";
import { useToast } from "@/hooks/use-toast";
// import { resetTokenAndCredentials } from "/store/authSlice";
import { useNavigate } from "react-router-dom";
import { SignedIn, SignedOut, UserButton } from "@clerk/clerk-react";

const AdminHeader = ({ setOpen }) => {
  const dispatch = useDispatch();
  const { toast } = useToast();
  const navigate = useNavigate();
  const handleLogOut = () => {
    dispatch(resetTokenAndCredentials());
    sessionStorage.removeItem("token");
    sessionStorage.clear();
    navigate("/auth/login");
    toast({
      title: "Logged out successfully",
    });
    // dispatch(authLogOut()).then((data)=>{
    //   if(data){
    //     console.log(data)
    //     toast({
    //       title:data.payload.data?.message
    //     })
    //   }
    // }).catch((err)=>console.log(err))
  };
  return (
    <div className="flex justify-between px-4 py-2">
      <Button
        onClick={() => {
          setOpen(true);
        }}
        className="lg:hidden sm:block"
      >
        <AlignJustify />
      </Button>
      <div className="flex justify-end flex-1 items-center">
        <SignedIn>
          <UserButton/>
        </SignedIn>
      </div>
    </div>
  );
};

export default AdminHeader;
