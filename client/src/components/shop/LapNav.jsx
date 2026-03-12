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
import { Link, useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { useDispatch, useSelector } from "react-redux";
import { Skeleton } from "@/components/ui/skeleton";

import { cartProducts } from "/store/cartSlice";
import { updateQuantity } from "/store/cartSlice";
import { removeItem } from "/store/cartSlice";

import { SignedIn, SignedOut, useAuth, useUser } from "@clerk/clerk-react";

const LapNav = ({ handleCart, handleQuantity, handleDeleteCartItem }) => {
  const { isSignedIn } = useUser();
  const userName = "kunal";
  const { cart, isLoading } = useSelector((state) => state.cart);

  const [openCart, setOpenCart] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);

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

  useEffect(() => {}, [cart]);

  return (
    <div className="hidden lg:flex lg:justify-between px-4 py-2 items-center justify-center">
      <div className="flex items-center gap-2">
        <Command className="w-10 h-10" />
        <Link to={"/shop/home"}>
          <span className="font-semibold text-4xl">E-commerce</span>
        </Link>
      </div>
      <div className="flex gap-4 text-2xl font-semibold">
        <Link to={"/shop/home"}>
          <div className="cursor-pointer text-muted-foreground hover:text-black">
            <h1>Home</h1>
          </div>
        </Link>
        <div
          className="cursor-pointer text-muted-foreground hover:text-black"
          onClick={() =>
            navigate("/shop/listing", {
              state: { homeFilter: "men" },
            })
          }
        >
          <h1>Men</h1>
        </div>
        <div
          className="cursor-pointer text-muted-foreground hover:text-black"
          onClick={() =>
            navigate("/shop/listing", {
              state: { homeFilter: "women" },
            })
          }
        >
          <h1>Women</h1>
        </div>
        <div
          className="cursor-pointer text-muted-foreground hover:text-black"
          onClick={() =>
            navigate("/shop/listing", {
              state: { homeFilter: "kids" },
            })
          }
        >
          <h1>Kids</h1>
        </div>
        <div
          className="cursor-pointer text-muted-foreground hover:text-black"
          onClick={() =>
            navigate("/shop/listing", {
              state: { homeFilter: "footwear" },
            })
          }
        >
          <h1>Footwear</h1>
        </div>
        <div
          className="cursor-pointer text-muted-foreground hover:text-black"
          onClick={() =>
            navigate("/shop/listing", {
              state: { homeFilter: "accessories" },
            })
          }
        >
          <h1>Accessories</h1>
        </div>
      </div>
      <SignedOut>
        <Button onClick={() => navigate("/auth/login")}>Login</Button>
      </SignedOut>
      <SignedIn>
        <div className="flex items-center gap-3">
          <Sheet open={openCart} onOpenChange={setOpenCart}>
            <SheetTrigger>
              <div
                onClick={() => {
                  handleCart();
                  setOpenCart(true);
                }}
                className="text-muted-foreground hover:text-foreground"
              >
                <ShoppingCart size={30} />{" "}
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
                {cart && cart.length > 0 ? (
                  cart.map((e, i) => {
                    return (
                      <div className="flex justify-between py-1 -ml-5 my-1 relative border-b-2 border-gray-300 pb-2">
                        <div className="flex flex-col gap-1">
                          <div className="w-28 h-32">
                            <img
                              className="w-full h-full object-cover"
                              src={e.products?.image}
                              alt=""
                            />
                          </div>
                          <div className="flex items-center gap-2 justify-center">
                            <Button
                              disabled={e.quantity === 1}
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
                        <div className="flex flex-col justify-between pt-4 ml-10 mt-4 text-xl  w-full">
                          <div className="flex flex-col gap-0 text-xl justify-start items-start">
                            <h1 className=" leading-6 w-full font-semibold line-clamp-2">
                              {e?.products?.title}
                            </h1>
                            <span className="text-black font-semibold ">
                              {e?.products?.salePrice > 0
                                ? e?.products?.salePrice * e?.quantity
                                : e?.products?.price * e?.quantity}
                              Rs.
                            </span>
                          </div>
                          <div className="flex flex-col gap-1">
                            <Button
                              disabled={isLoading || !cart?.length > 0}
                              onClick={() => {
                                setOpenCart(false);
                                navigate("/shop/checkOut", {
                                  state: { CheckOutProduct: [e] },
                                });
                              }}
                              className=" text-xl"
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
                        {totalAmount} Rs.
                      </span>
                    </div>
                    <Button
                      disabled={isLoading || !cart?.length > 0}
                      onClick={() => {
                        setOpenCart(false);
                        navigate("/shop/checkOut", {
                          state: { CheckOutProduct: cart },
                        });
                      }}
                      className=" text-xl"
                    >
                      check out
                    </Button>
                  </div>
                ) : null}
              </div>
            </SheetContent>
          </Sheet>{" "}
          <div className="flex items-center justify-center gap-4">
            {/* <UserButton/> */}
            <div className="flex gap-1 items-center">
              <CircleUserRound onClick={() => navigate("/shop/account")} />
            </div>
          
         
          </div>
        </div>
      </SignedIn>
    </div>
  );
};

export default LapNav;
