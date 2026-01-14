import {
  Baby,
  ClockFading,
  Command,
  Footprints,
  HandMetal,
  House,
  LogOut,
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
import { authLogOut } from "/store/authSlice";
import { cartProducts } from "/store/cartSlice";
import { useToast } from "@/hooks/use-toast";
import { updateQuantity } from "/store/cartSlice";
import { removeItem } from "/store/cartSlice";
import Input from "../ui/input";
import axios from "axios";
import { searchProduct } from "/store/shopSlice";
import { resetTokenAndCredentials } from "/store/authSlice";

const ShoppingHeader = () => {
  const { userName, userId } = useSelector((state) => state.auth);
  const { cart, isLoading } = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const { toast } = useToast();

  const [openCart, setOpenCart] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [CheckOutProduct, setCheckOutProduct] = useState([]);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const handleSerach = (e) => {
    e.preventDefault();
    console.log(search);
    dispatch(searchProduct(search))
      .then((data) => {
        if (data.payload.success) {
          console.log(data);
          toast({
            title: data.payload.data?.message,
          });
        } else {
          toast({
            title: data.payload.data?.message,
          });
        }
      })
      .catch((err) => {
        toast({
          title: data.payload.data?.message,
        });
      });
  };

  const handleLogOut = () => {
    dispatch(resetTokenAndCredentials());
    sessionStorage.removeItem("token");
    sessionStorage.clear();
    navigate("/auth/login");
    toast({
      title: "Logged out successfully",
    });
    // dispatch(authLogOut())
    //   .then((data) => {
    //     if (data) {
    //       console.log(data);
    //       toast({
    //         title: data.payload.data?.message,
    //       });
    //     }
    //   })
    //   .catch((err) => console.log(err));
  };

  const handleCart = () => {
    dispatch(cartProducts(userId));
  };

  const handleQuantity = (e, action) => {
    console.log(e, action);
    let quantity = 0;
    action == "plus"
      ? (quantity = e.quantity + 1)
      : (quantity = e.quantity - 1);
    console.log(quantity);

    dispatch(
      updateQuantity({
        productId: e.products._id,
        quantity: quantity,
        userId,
      })
    )
      .then((data) => {
        console.log(data);
        dispatch(cartProducts(userId));
      })
      .catch((err) => console.log(err));
  };

  const handleDeleteCartItem = (e) => {
    console.log(e);
    dispatch(removeItem({ productId: e?.products?._id, userId }))
      .then((data) => dispatch(cartProducts(userId)))
      .catch((err) => console.log(err));
  };

  const totalAmount =
    cart && cart.length > 0
      ? cart?.reduce(
          (arr, crr) =>
            arr +
            (crr?.products?.salePrice > 0
              ? crr?.products?.salePrice
              : crr?.products?.price) *
              crr.quantity,
          0
        )
      : null;

  useEffect(() => {
    console.log(cart);
  }, [dispatch, totalAmount]);

  return (
    <div className="items-center px-3 lg:px-4 border-b-2 border-gray-200 ">
      <div className="flex items-center justify-between gap-2 lg:hidden py-2 ">
        <div className="flex gap-2">
          <Command className="w-6 h-6" />
          <Link to={"/shop/home"}>
            <span className="font-semibold text-xl">E-commerce</span>
          </Link>
        </div>
        <Separator />
        <Sheet open={openDialog} onOpenChange={setOpenDialog}>
          <SheetTrigger>
            <Button
              onClick={() => {
                setOpenDialog(true);
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
              <Sheet>
                <SheetTrigger open={openCart} onOpenChange={setOpenCart}>
                  <div
                    onClick={() => {
                      handleCart();
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
                          <div className="flex justify-between py-1 -ml-5 my-1 relative">
                            <div className="flex flex-col gap-1">
                              <div className="w-20 h-24">
                                <img
                                  className="w-full h-full object-cover"
                                  src={e.products?.image}
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
                                    ? e?.products?.salePrice * e?.quantity
                                    : e?.products?.price * e?.quantity}
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
                                  disabled={isLoading || !cart?.length > 0}
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
                          </div>
                        );
                      })
                    ) : (
                      <div className="text-2xl text-center">No items</div>
                    )}
                    <div className="fixed bottom-0 gap-2 bg-white right-0 w-[30vh] border-t-2 px-4 border-gray-200 rounded-lg h-24 flex flex-col  py-2">
                      <div className="flex justify-between px-4 items-center">
                        <h1 className="text-4xl font-semibold">Total</h1>
                        <span className="text-xl font-semibold">
                          {totalAmount}Rs.
                        </span>
                      </div>
                      <Button
                        onClick={() => {
                          navigate("/shop/checkOut", {
                            state: { CheckOutProduct: cart },
                          });
                          setOpenCart(false);
                          setOpenDialog(false);
                        }}
                        disabled={isLoading || !cart?.length > 0}
                        className="text-xl"
                      >
                        check out
                      </Button>
                    </div>
                  </div>
                  <Separator />
                </SheetContent>
              </Sheet>
              <DropdownMenu>
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

                  <DropdownMenuItem>
                    <div onClick={handleLogOut}>
                      <LogOut />
                      LogOut
                    </div>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </SheetContent>
        </Sheet>
      </div>
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
                        <div className="flex flex-col justify-between pt-4 ml-10 mt-4 text-xl">
                          <div className="flex flex-col gap-0 text-xl justify-start items-start">
                            <h1 className=" leading-6 w-full font-semibold">
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
                      setOpenCart(false);
                      navigate("/shop/checkOut", {
                        state: { CheckOutProduct: cart },
                      });
                    }}
                    className=" text-xl w-fit"
                  >
                    check out
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>{" "}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="cursor-pointer text-2xl font-serif text-gray-400 w-12 h-12 bg-black rounded-full hover:text-white flex justify-center items-center font-semibold">
                {userName?.[0].toUpperCase()}
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuSeparator />

            <DropdownMenuContent side="right">
              <DropdownMenuLabel>Logged in as {userName}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <Link to={"/shop/account"}>
                <DropdownMenuItem>
                  <User />
                  Account
                </DropdownMenuItem>
              </Link>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <div onClick={handleLogOut}>
                  <LogOut />
                  LogOut
                </div>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div
        className={`${
          !location.pathname.includes("/listing") ? "hidden" : "block"
        }`}
      >
        <form onSubmit={(e) => handleSerach(e)} className="flex">
          <input
            className="w-full shadow-lg"
            onChange={(e) => {
              setSearch(e.target.value.trim());
            }}
            placeholder="Search Bar"
          ></input>
          <Button
            disabled={search.length <= 2}
            className="sm:w-44 sm:text-xl"
            type="submit"
          >
            Search
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ShoppingHeader;
