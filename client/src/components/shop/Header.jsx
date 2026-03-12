import {
  Baby,
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
// import { authLogOut } from "/store/authSlice";
import { cartProducts } from "/store/cartSlice";
import { useToast } from "@/hooks/use-toast";
import { updateQuantity } from "/store/cartSlice";
import { removeItem } from "/store/cartSlice";

import { searchProduct } from "/store/shopSlice";
import {
  SignedIn,
  SignedOut,
  useAuth,
  UserButton,
  useUser,
} from "@clerk/clerk-react";
import MobileNav from "./MobileNav";
import LapNav from "./LapNav";
import { increaseQuantity } from "/store/cartSlice";
import { decreaseQuantity } from "/store/cartSlice";
const ShoppingHeader = () => {
  const { userId, getToken } = useAuth();
  const { isSignedIn } = useUser();
  const userName = "kunal";
  const { cart, isLoading } = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const { toast } = useToast();

  const [token, setToken] = useState(null);
  let timer;

  const handleCart = async () => {
    if (!token) return;
    dispatch(cartProducts(userId))
     
  };


  const handleQuantity = (e, action) => {
    let quantity = 0;
    action == "plus"
      ? (quantity = e?.quantity + 1)
      : (quantity = e?.quantity - 1);

    if (action == "plus") {
      dispatch(increaseQuantity(e?._id));
    } else {
      dispatch(decreaseQuantity(e?._id));
    }
   clearTimeout(timer);
    timer = setTimeout(() => {
      dispatch(
        updateQuantity({
          productId: e?.products._id,
          quantity: quantity,
          userId,
        }),
      )

    }, 500);
  };

  const handleDeleteCartItem = (e) => {
    dispatch(removeItem({ productId: e?.products?._id, userId }))
      .then(() => dispatch(cartProducts(userId)));
  };

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

  async function createToken(params) {
    setToken(await getToken());
  }
  useEffect(() => {
    createToken();
  }, [userId, totalAmount, cart]);

  return (
    <div className="items-center px-3 lg:px-4 border-b-2 border-gray-200">
      <MobileNav
        handleCart={handleCart}
        handleQuantity={handleQuantity}
        handleDeleteCartItem={handleDeleteCartItem}
        isLoading={isLoading}
      />
      <LapNav
        handleCart={handleCart}
        handleQuantity={handleQuantity}
        handleDeleteCartItem={handleDeleteCartItem}
      />
    </div>
  );
};

export default ShoppingHeader;
