import {
  Baby,
  CircleUserRound,
  Command,
  Footprints,
  HandMetal,
  House,
  Logs,
  Mars,
  Minus,
  Plus,
  ShoppingCart,
  User,
  Venus,
  X,
} from "lucide-react";
import React, { use, useEffect, useState } from "react";
import { Button } from "../ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import { Separator } from "@radix-ui/react-select";
import { Link, Navigate, useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { useDispatch, useSelector } from "react-redux";
// import { authLogOut } from "/store/authSlice";
import { cartProducts } from "/store/cartSlice";
import { useToast } from "@/hooks/use-toast";
import { updateQuantity } from "/store/cartSlice";
import { removeItem } from "/store/cartSlice";

import { searchProduct } from "/store/shopSlice";
import { Skeleton } from "@/components/ui/skeleton";
import {
  SignedIn,
  SignedOut,
  useAuth,
  UserButton,
  useUser,
} from "@clerk/clerk-react";
import { isAllOf } from "@reduxjs/toolkit";

const MobileNav = ({ handleCart, handleQuantity, handleDeleteCartItem }) => {
  const { isSignedIn } = useUser();
  console.log(isSignedIn);
  const userName = "kunal";
  const { cart, isLoading } = useSelector((state) => state.cart);

  const [openCart, setOpenCart] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [token, setToken] = useState(null);

  const navigate = useNavigate();

  const totalAmount =
    cart && cart?.length > 0
      ? cart?.reduce(
          (arr, crr) =>
            arr +
            (crr?.products?.salePrice > 0
              ? crr?.products?.salePrice
              : crr?.products?.price) *
              crr.quantity,
          0,
        )
      : null;

  return (
    <div className="flex items-center justify-between gap-2 lg:hidden py-2">
      <div className="flex gap-2">
        <Command className="w-6 h-6" />
        <Link to={"/shop/home"}>
          <span className="font-semibold text-xl">E-commerce</span>
        </Link>
      </div>
      <Separator />

      <div className="flex items-center gap-4 md:gap-8">
        <SignedIn>
          <UserButton />
        </SignedIn>

        <Sheet
          open={openDialog}
          onOpenChange={setOpenDialog}
          className="bg-red-600"
        >
          <SheetTrigger>
            <Button
              onClick={() => {
                setOpenDialog(true);
                handleCart()
                  .then((data) => console.log("mob cart ", data))
                  .catch((err) => console.log(err));
              }}
              className="lg:hidden flex justify-center items-center"
              variant="outline"
              size="icon"
            >
              <Logs size={20} />
            </Button>
          </SheetTrigger>

          <SheetContent>
            <SheetHeader>
              <SheetTitle></SheetTitle>
              <SheetDescription></SheetDescription>
            </SheetHeader>

            <div className="p-4 text-xl gap-5 flex flex-col mt-8">
              <Link
                onClick={() => setOpenDialog(false)}
                to={"/shop/home"}
                className="cursor-pointer"
              >
                <h1 className="text-muted-foreground hover:text-foreground flex gap-1 items-center">
                  <House />
                  Home
                </h1>
              </Link>
              <div
                onClick={() => {
                  navigate("/shop/listing", {
                    state: { homeFilter: "men" },
                  });
                  setOpenDialog(false);
                }}
                className="cursor-pointer"
              >
                <h1 className="text-muted-foreground hover:text-foreground flex gap-1 items-center">
                  <Mars />
                  Men
                </h1>
              </div>
              <div
                className="cursor-pointer"
                onClick={() => {
                  navigate("/shop/listing", {
                    state: { homeFilter: "women" },
                  });
                  setOpenDialog(false);
                }}
              >
                <h1 className="text-muted-foreground hover:text-foreground flex gap-1 items-center">
                  <Venus />
                  Women
                </h1>
              </div>

              <div
                className="cursor-pointer"
                onClick={() => {
                  navigate("/shop/listing", {
                    state: { homeFilter: "kids" },
                  });
                  setOpenDialog(false);
                }}
              >
                <h1 className="text-muted-foreground hover:text-foreground flex gap-1 items-center">
                  <Baby />
                  Kids
                </h1>
              </div>

              <div
                className="cursor-pointer"
                onClick={() => {
                  navigate("/shop/listing", {
                    state: { homeFilter: "footwear" },
                  });
                  setOpenDialog(false);
                }}
              >
                <h1 className="text-muted-foreground hover:text-foreground flex gap-1 items-center">
                  <Footprints />
                  Footwear
                </h1>
              </div>

              <div
                className="cursor-pointer"
                onClick={() => {
                  navigate("/shop/listing", {
                    state: { homeFilter: "accessories" },
                  });
                  setOpenDialog(false);
                }}
              >
                <h1 className="text-muted-foreground hover:text-foreground flex gap-1 items-center">
                  <HandMetal />
                  Accessories
                </h1>
              </div>
              <div
                className="cursor-pointer"
                onClick={() => {
                  navigate("/shop/account");
                  setOpenDialog(false);
                }}
              >
                <h1 className="text-muted-foreground hover:text-foreground flex gap-1 items-center">
                  <CircleUserRound />
                  Accounts
                </h1>
              </div>
              <SignedOut>
                <Button onClick={() => navigate("/auth/login")}>Login</Button>
              </SignedOut>
              <SignedIn>
                <Sheet>
                  <SheetTrigger
                    disabled={isLoading}
                    open={openCart}
                    onOpenChange={setOpenCart}
                  >
                    <div
                      className={`text-muted-foreground hover:text-foreground ${location?.pathname?.includes("checkOut") ? "hidden" : ""}`}
                    >
                      <h1 className="text-muted-foreground hover:text-foreground flex gap-1 items-center">
                        <ShoppingCart size={30} />
                        Cart
                      </h1>
                    </div>
                  </SheetTrigger>
                  <SheetContent className="overflow-auto">
                    <SheetHeader>
                      <SheetTitle className="text-3xl font-extrabold font-serif">
                        Your Cart
                      </SheetTitle>
                      <SheetDescription></SheetDescription>
                    </SheetHeader>
                    <div className="relative pb-16">
                      {cart && cart?.length > 0 ? (
                        cart.map((e, i) => {
                          return (
                            <div className="flex justify-between py-1 -ml-5 my-1 relative">
                              {isLoading ? (
                                <div className="flex w-fit items-center gap-4 my-5">
                                  <Skeleton className="w-20 h-24 shrink-0 rounded-full" />
                                  <div className="grid gap-4">
                                    <Skeleton className="h-8 w-[150px]" />
                                    <Skeleton className="h-8 w-[100px]" />
                                  </div>
                                </div>
                              ) : (
                                <>
                                  <div className="flex flex-col gap-1">
                                    <div className="w-20 h-24">
                                      <img
                                        className="w-full h-full object-cover"
                                        src={e?.products?.image}
                                        alt=""
                                      />
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <Button
                                        disabled={e.quantity === 1 || isLoading}
                                        onClick={() => {
                                          handleQuantity(e, "minus");
                                        }}
                                        className="h-6 w-2"
                                      >
                                        <Minus />
                                      </Button>
                                      <span className="text-lg font-bold">
                                        {e?.quantity}
                                      </span>
                                      <Button
                                        disabled={
                                          isLoading ||
                                          e.products?.totalStock <= e?.quantity
                                        }
                                        onClick={() => {
                                          handleQuantity(e, "plus");
                                        }}
                                        className="h-6 w-2"
                                      >
                                        <Plus />
                                      </Button>
                                    </div>
                                  </div>
                                  <div className="flex flex-col justify-between pt-4 ml-10 mt-4">
                                    <div className="flex flex-col gap-2">
                                      <h1 className="h-8 text-sm leading-3 w-auto font-semibold">
                                        {e?.products?.title}
                                      </h1>
                                      <span className="text-black font-semibold ">
                                        {e?.products?.salePrice > 0
                                          ? e.products?.salePrice * e?.quantity
                                          : e.products?.price * e?.quantity}
                                        Rs.
                                      </span>
                                    </div>
                                    <div className="flex flex-col gap-1">
                                      <Button
                                        onClick={() => {
                                          navigate("/shop/checkOut", {
                                            state: { CheckOutProduct: [e] },
                                          });
                                          setOpenCart(false);
                                          setOpenDialog(false);
                                        }}
                                        disabled={
                                          isLoading || !cart?.length > 0
                                        }
                                        className="w-20 h-8"
                                      >
                                        check out
                                      </Button>
                                    </div>
                                    <div
                                      onClick={() => {
                                        handleDeleteCartItem(e);
                                      }}
                                      className="absolute top-0 right-0"
                                    >
                                      <X />
                                    </div>
                                  </div>
                                </>
                              )}
                            </div>
                          );
                        })
                      ) : (
                        <div className="text-2xl text-center">No items</div>
                      )}
                      {cart && cart?.length > 0 ? (
                        <div className="fixed bottom-0 rounded-lg border-t-2 border-gray-300 right-0 w-96 h-24 flex flex-col  bg-white py-2 px-4 gap-2">
                          <div className="flex justify-between px-4 items-center">
                            <h1 className="text-4xl font-semibold">Total</h1>
                            <span className="text-3xl font-semibold">
                              {totalAmount}
                            </span>
                          </div>
                          <Button
                            disabled={isLoading || !cart?.length > 0}
                            onClick={() => {
                              navigate("/shop/checkOut", {
                                state: { CheckOutProduct: cart }
                              }),
                              setOpenDialog(false)
                              // setOpenCart(false);
                            }}
                            className=" text-xl w-fit"
                          >
                            check out
                          </Button>
                        </div>
                      ) : null}
                    </div>
                    <Separator />
                  </SheetContent>
                </Sheet>

                {/* 
              <DropdownMenu className="">
                <DropdownMenuTrigger asChild>
                  <div className="cursor-pointer font-serif text-gray-400 w-10 h-10 bg-black rounded-full hover:text-white flex justify-center items-center font-semibold">
                    {userName?.[0].toUpperCase()}
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuSeparator />
                <DropdownMenuContent side="right">
                  <DropdownMenuLabel>Logged in as {userName}</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Link
                      onClick={() => {
                          setOpenDialog(false);
                        }}
                        to={"/shop/account"}
                        >
                      <User />
                      Account
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />

                </DropdownMenuContent>
              </DropdownMenu> */}
              </SignedIn>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
};

export default MobileNav;
