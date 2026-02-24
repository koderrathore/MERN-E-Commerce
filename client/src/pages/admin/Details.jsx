import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import React from "react";

const Details = ({
  products,
  isEdited,
  setIsEdited,
  setProductsDialog,
  currentId,
  setCurrentId,
  editProduct,
  setEditProduct,
  imageEdited,
  setImageEdited,
  isDelete,
  setIsDelete,
  isDetails,
  setIsDetails,
}) => {
  console.log(isDetails);
  return (
    <div>
      <Dialog open={isDetails} onOpenChange={setIsDetails}>
        <DialogContent className="">
          <DialogHeader>
            <DialogTitle></DialogTitle>
          </DialogHeader>
          <div className="flex flex-col">
            <div className="flex justify-center gap-4">
              <div className="flex flex-col">
                <div className="w-24 h-28 lg:w-32 lg:h-32">
                  <img
                    className="w-full h-full object-cover"
                    src={isDetails?.image}
                    alt=""
                  />
                </div>
                <div className="flex flex-col text-sm gap-1 lg:gap-0 mt-2 lg:text-xl">
                  <h1 className="uppercase font-serif">{isDetails?.brand}</h1>
                  <h1 className="uppercase font-serif">{isDetails?.category}</h1>
                  <div className="flex items-center gap-4 lg:font-semibold">
                    {!isDetails?.salePrice > 0 ? (
                      <h1>{isDetails?.price}Rs.</h1>
                    ) : (
                      <>
                        <h1 className="text-red-600 line-through">
                          {isDetails?.price}Rs.
                        </h1>
                        <h1>{isDetails?.salePrice}Rs.</h1>
                      </>
                    )}
                  </div>
                  <h1 className="flex items-center lg:font-semibold">
                    {isDetails?.totalStock <= 5 ? "only" : null}
                    <span
                      className={
                        isDetails?.totalStock <= 5
                          ? "text-red-600 font-semibold"
                          : "text-black"
                      }
                    >
                      &nbsp;{isDetails?.totalStock}&nbsp;
                    </span>
                    left
                  </h1>
                </div>
              </div>
              <div className="flex flex-col gap-2 text-sm lg:text-xl lg:font-semibold lg:font-serif">
                <h1>{isDetails?.title}</h1>
                <p className="w-fit">{isDetails?.description}</p>
              </div>
            </div>
            <div className="flex gap-2 mt-1 justify-start lg:mt-3">
              {/* <Button
                onClick={() => {
                  setIsDetails(null);
                  setProductsDialog(true);
                  setIsEdited(true);
                  setCurrentId(products._id);
                  setEditProduct(isDetails);
                  setImageEdited(true);
                }}
                className="h-5 w-10 lg:h-auto lg:w-auto lg:text-xl"
              >
                Edit
              </Button>
              <Button
                onClick={() => {
                  setIsDelete(true);
                  setCurrentId(products._id);
                  setEditProduct(products);
                }}
                className="h-5 w-12 lg:h-auto lg:w-auto lg:text-xl"
              >
                Delete
              </Button> */}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Details;
