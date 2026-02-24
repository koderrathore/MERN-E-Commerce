import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "/store/cartSlice";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useLocation, useNavigate } from "react-router-dom";
import { productReview } from "/store/reviewsSlice";
import { useAuth } from "@clerk/clerk-react";

const ShoppingProductTile = ({
  products,
  filteredProducts,
  prodDets,
  setProdDets,
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate()
  const { toast } = useToast();
  const location = useLocation();
  const { userId } = useAuth();
  const handleAddTOCart = (prod) => {
    console.log(prod);
    if (!userId) {
      console.log("object");
      return navigate("/auth/login");
    }
    dispatch(addToCart({ productId: prod._id, userId }))
      .then((data) => {
        if (data.payload.data.success) {
          toast({
            title: data.payload.data.message,
          });
        }
      })
      .catch((err) => console.log(err));
  };
  function handleProductDetails(e) {
    console.log(e);
    setProdDets(e);
    dispatch(productReview({ productId: e?._id }))
      .then((data) => console.log(data))
      .catch((err) => console.log(err));
  }
  return (
    <div className="flex flex-col px-1 py-1 border-dotted border-muted-foreground  transition-all ease-in w-32 lg:w-fit my-2 mx-1 border-2 hover:border-dashed hover:border-black lg:p-3 rounded-md lg:mx-1 lg:my-4">
      <div
        onClick={() => {
          !location.pathname.includes("/home")
            ? handleProductDetails(products)
            : null;
        }}
        className=""
      >
        <div className="flex flex-col gap-2">
          <div className="flex relative w-20 h-28 overflow-hidden rounded-lg lg:w-52 lg:h-72">
            <img
              className="w-full h-full object-cover"
              src={products?.image || filteredProducts?.image}
              alt=""
            />
            {products.totalStock &&
            products.totalStock <= 0 ? null : products.totalStock <= 5 &&
              !products.totalStock == 0 ? (
              <div className="bg-red-600 text-[1.3vh] lg:text-sm text-white font-semibold absolute top-0 left-0 z-10 rounded-xl px-2">
                only {products?.totalStock} left
              </div>
            ) : null}
          </div>
          <h1 className="w-28 overflow-hidden h-5 lg:text-xl lg:h-8 lg:w-52">
            {products?.title}
          </h1>
        </div>
        <div className="flex flex-col w-fit lg:text-xl">
          <h1 className="uppercase text-muted-foreground">
            {products?.category}
          </h1>
          <h1 className="uppercase text-muted-foreground">{products?.brand}</h1>
          <div className="flex font-semibold gap-2 ">
            {products?.salePrice == 0 ? (
              <h1>{products?.price}Rs.</h1>
            ) : (
              <h1 className="text-red-600 divide-x relative line-through flex items-center">
                {products?.price}Rs.
              </h1>
            )}
            {products?.salePrice == 0 ? null : (
              <h1>{products?.salePrice}Rs.</h1>
            )}
          </div>
        </div>
      </div>
      <div className="flex gap-2 mt-1 justify-start lg:mt-3">
        {(products.totalStock && products.totalStock > 0) ||
        location.pathname.includes("/home") ? (
          <Button
            onClick={() => {
              !location.pathname.includes("home")
                ? handleAddTOCart(products)
                : setProdDets(products);
            }}
            className="h-fit w-full lg:h-auto lg:w-auto lg:text-xl"
          >
            {!location.pathname.includes("/home")
              ? "Add to cart"
              : "View Details"}
          </Button>
        ) : (
          <Button className="bg-red-600 text-white h-fit w-fit lg:h-auto lg:w-auto lg:text-xl">
            Out of stock
          </Button>
        )}
      </div>
    </div>
  );
};

export default ShoppingProductTile;
