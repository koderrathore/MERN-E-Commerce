import { Button } from "@/components/ui/button";
import React from "react";

const ProductTile = ({
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
  return (
    <div className=" flex flex-col px-2 py-1 border-dotted border-muted-foreground  transition-all ease-in w-32 lg:w-fit my-2 mx-1 border-2 hover:border-dashed hover:border-black lg:p-4 rounded-md lg:mx-4 lg:my-4">
      <div onClick={()=>{
        setIsDetails(products)
        // setEditProduct(products)
    }} >
      <div className="flex flex-col gap-2">
        <div className="flex w-20 h-28 overflow-hidden rounded-lg lg:w-52 lg:h-72">
          <img
            className="w-full h-full object-cover"
            src={products?.image}
            alt=""
          />
        </div>
        <h1 className="w-28 overflow-hidden h-5 lg:text-xl lg:h-8 lg:w-52">
          {products?.title}
        </h1>
      </div>
      <div className="flex flex-col w-fit lg:text-xl">
        <h1 className="uppercase">{products?.brand}</h1>
        <div className="flex font-semibold gap-2 ">
          {products?.salePrice == 0 ? (
            <h1>{products?.price}Rs.</h1>
          ) : (
            <h1 className="text-red-600 divide-x relative line-through flex items-center">
              {products?.price}Rs.
            </h1>
          )}
          {products?.salePrice == 0 ? null : <h1>{products?.salePrice}Rs.</h1>}
        </div>
        <h1>in Stock: {products?.totalStock}</h1>
      </div>

      </div>
      <div className="flex gap-2 mt-1 justify-start lg:mt-3">
        <Button
          onClick={() => {
            setProductsDialog(true);
            setIsEdited(true);
            setCurrentId(products._id);
            setEditProduct(products);
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
        </Button>
      </div>
    </div>
  );
};

export default ProductTile;
