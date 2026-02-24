import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import React, { useEffect, useState } from "react";
import ImageUpload from "./ImageUpload";
import { ImageLoader } from "three";
import { useDispatch, useSelector } from "react-redux";
import { addProducts } from "/store/adminSlice/productSlice";
import { useToast } from "@/hooks/use-toast";
import { fetchProducts } from "/store/adminSlice/productSlice";
import ProductTile from "./ProductTile";
import { Edit } from "lucide-react";
import { updateProducts } from "/store/adminSlice/productSlice";
import { deleteProducts } from "/store/adminSlice/productSlice";
import Details from "./Details";

const AdminProducts = () => {
  const [productsDialog, setProductsDialog] = useState(false);
  const [image, setImage] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [brand, setBrand] = useState("");
  const [price, setPrice] = useState("");
  const [salePrice, setSalePrice] = useState("");
  const [totalStock, setTotalStock] = useState(0);
  const [imageFile, setImageFile] = useState(null);
  const [uploadedImageFile, setUploadedImageFile] = useState("");
  const [loader, setLoader] = useState(false);
  const [productLoader, setProductLoader] = useState(false);
  const [isEdited, setIsEdited] = useState(false);
  const [imageEdited, setImageEdited] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [editProduct, setEditProduct] = useState(null);
  const [isDelete, setIsDelete] = useState(false);
  const [isDetails, setIsDetails] = useState(null);

  const dispatch = useDispatch();
  const { toast } = useToast();
  const { productList } = useSelector((state) => state.adminProducts);
  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    if (isEdited) {
      setProductLoader(true);
      formData.append("image", uploadedImageFile || image);
      formData.append("title", title);
      formData.append("description", description);
      formData.append("category", category);
      formData.append("brand", brand);
      formData.append("price", price);
      formData.append("salePrice", salePrice);
      formData.append("totalStock", totalStock);

      if (
        !image &&
        !title &&
        !description &&
        !category &&
        !brand &&
        !price &&
        !totalStock
      )
        return toast({ title: "Every Field must be field except sale price" });

      dispatch(updateProducts({ id: currentId, formData }))
        .then((data) => {
          setProductLoader(false);
          if (data.payload?.success) {
            toast({
              title: data.payload?.message,
            });
          }
          setImage("");
          setImageFile(null);
          setUploadedImageFile("");
          setTitle("");
          setDescription("");
          setCategory("");
          setBrand("");
          setPrice("");
          setSalePrice(0);
          setTotalStock("");

          setProductsDialog(false);
          setIsDetails(null);
          setIsEdited(false);
          dispatch(fetchProducts());
        })
        .catch((err) => {
          toast({
            title: "something Went Wrong",
          });
          console.log(err);
        });
    } else {
      setProductLoader(true);
      formData.append("image", uploadedImageFile);
      formData.append("title", title);
      formData.append("description", description);
      formData.append("category", category);
      formData.append("brand", brand);
      formData.append("price", price);
      formData.append("salePrice", salePrice);
      formData.append("totalStock", totalStock);
      if (
        !image &&
        !title &&
        !description &&
        !category &&
        !brand &&
        !price &&
        !totalStock
      )
        return toast({ title: "Every Field must be field except sale price" });

      dispatch(addProducts(formData))
        .then((data) => {
          setProductLoader(false);
          if (data.payload?.success) {
            toast({
              title: data.payload?.message,
            });
            setImage("");
            setImageFile(null);
            setUploadedImageFile("");
            setTitle("");
            setDescription("");
            setCategory("");
            setBrand("");
            setPrice("");
            setSalePrice(0);
            setTotalStock("");

            setProductsDialog(false);
            dispatch(fetchProducts());
          }
        })
        .catch((err) => {
          toast({
            title: "something Went Wrong",
          });
          console.log(err);
        });
    }
  };

  useEffect(() => {
    const handleDelete = () => {
      dispatch(deleteProducts(editProduct?._id))
        .then((data) => {
          if (data.payload?.success) {
            toast({
              title: data.payload?.message,
            });
          }
          setIsDetails(null);
          dispatch(fetchProducts());
        })
        .catch((err) => console.log(err));
    };

    if (isDelete) handleDelete();
  }, [isDelete]);

  useEffect(() => {
    dispatch(fetchProducts())
      .then((data) => {
        console.log(data)
        if (!data.payload?.success) {
          toast({
            title: data?.payload?.message,
          });
        }
      })
      .catch((err) => console.log(err));
  }, [dispatch]);

  useEffect(() => {
    if (editProduct) {
      console.log(editProduct);
      setTitle(editProduct?.title);
      setDescription(editProduct?.description);
      setBrand(editProduct?.brand);
      setCategory(editProduct?.category);
      setPrice(editProduct?.price);
      setSalePrice(editProduct?.salePrice||0);
      setTotalStock(editProduct?.totalStock||1);
    }
  }, [editProduct]);
  return (
    <div className="w-full h-screen flex flex-col ">
      <Details
        isDetails={isDetails}
        setIsDetails={setIsDetails}
        setProductsDialog={setProductsDialog}
        isEdited={isEdited}
        setIsEdited={setIsEdited}
        currentId={currentId}
        setCurrentId={setCurrentId}
        editProduct={editProduct}
        setEditProduct={setEditProduct}
        imageEdited={imageEdited}
        setImageEdited={setImageEdited}
        isDelete={isDelete}
        setIsDelete={setIsDelete}
      />
      <Sheet
        open={productsDialog}
        onOpenChange={() => {
          setProductsDialog(false);
        }}
      >
        <SheetContent className="overflow-auto">
          <SheetHeader>
            <SheetTitle>
              <div className="flex justify-center text-2xl">
                {isEdited ? "Update Product" : "Add Product"}
              </div>
            </SheetTitle>
          </SheetHeader>
          <div className="mt-4 text-black">
            <form onSubmit={(e) => handleSubmit(e)} action="">
              <div className="mt-2">
                <ImageUpload
                  imageFile={imageFile}
                  setImageFile={setImageFile}
                  uploadedImageFile={uploadedImageFile}
                  setUploadedImageFile={setUploadedImageFile}
                  loader={loader}
                  setLoader={setLoader}
                  image={image}
                  setImage={setImage}
                  isEdited={isEdited}
                  setIsEdited={setIsEdited}
                  editProduct={editProduct}
                  imageEdited={imageEdited}
                  setImageEdited={setImageEdited}
                  setEditProduct={setEditProduct}
                />
              </div>
              <div className="flex flex-col gap-1 mt-2">
                <h1 className="text-xl">Title</h1>
                <input
                  required
                  value={title}
                  onChange={(e) => {
                    setTitle(e.target.value);
                  }}
                  className="border-2 border-black rounded-lg placeholder:py-2 placeholder:pl-1"
                  placeholder="enter title here"
                  type="text"
                  name="title"
                  id="title"
                />
              </div>
              <div className="flex flex-col gap-1 mt-2">
                <h1 className="text-xl">Description</h1>
                <textarea
                  value={description}
                  onChange={(e) => {
                    setDescription(e.target.value);
                  }}
                  className="border-2 border-black rounded-lg placeholder:py-2 placeholder:pl-1"
                  placeholder="enter description here"
                  type="text"
                  name="title"
                  id="title"
                />
              </div>
              <div className="flex flex-col gap-1 mt-2">
                <h1 className="text-xl">Category</h1>
                <select
                  required:true
                  value={category}
                  onChange={(e) => {
                    setCategory(e.target.value);
                  }}
                  className="border-2 border-black rounded-lg"
                  name="Category"
                  id="Category"
                >
                  <option value="" disabled selected>
                    Select category
                  </option>
                  <option value="men">Men</option>
                  <option value="women">Women</option>
                  <option value="kids">Kids</option>
                  <option value="footwear">Footwear</option>
                  <option value="accessories">Accessories</option>
                </select>
              </div>
              <div className="flex flex-col gap-1 mt-2">
                <h1 className="text-xl">Brand</h1>
                <select
                  required:true
                  value={brand}
                  onChange={(e) => {
                    setBrand(e.target.value);
                  }}
                  className="border-2 border-black rounded-lg"
                  name="Category"
                  id="Category"
                >
                  <option value="" disabled selected>
                    Select brand
                  </option>
                  <option value="adidas">Adidas</option>
                  <option value="h&m">H&M</option>
                  <option value="levis">Levi's</option>
                  <option value="puma">Puma</option>
                  <option value="zara">Zara</option>
                </select>
              </div>
              <div className="flex flex-col gap-1 mt-2">
                <h1 className="text-xl">Price</h1>
                <input
                  required
                  value={price}
                  onChange={(e) => {
                    setPrice(e.target.value.trim());
                  }}
                  className="border-2 border-black rounded-lg placeholder:py-2 placeholder:pl-1"
                  placeholder="enter product price here"
                  type="number"
                  name="price"
                  id="price"
                />
              </div>
              <div className="flex flex-col gap-1 mt-2">
                <h1 className="text-xl">Sale Price</h1>
                <input
                  required
                  value={salePrice}
                  onChange={(e) => {
                    setSalePrice(e.target.value.trim());
                  }}
                  className="border-2 border-black rounded-lg placeholder:py-2 placeholder:pl-1"
                  placeholder="enter sale rice here (optional)"
                  type="number"
                  name="salePrice"
                  id="salePrice"
                />
              </div>
              <div className="flex flex-col gap-1 mt-2">
                <h1 className="text-xl">Total Stock</h1>
                <input
                  required
                  value={totalStock}
                  onChange={(e) => {
                    setTotalStock(e.target.value);
                  }}
                  className="border-2 border-black rounded-lg placeholder:py-2 placeholder:pl-1"
                  placeholder="enter total stock here"
                  type="number"
                  name="totalStock"
                  id="totalStock"
                />
              </div>
              <div className="mt-4 w-full">
                {!productLoader ? (
                  <Button
                    disabled={loader}
                    onClick={(e) => {
                      handleSubmit(e);
                    }}
                  >
                    {isEdited ? "Edit" : "Add"}
                  </Button>
                ) : (
                  <Button className="text-lg flex items-center bg-muted-foreground">
                    Please wait...
                  </Button>
                )}
              </div>
            </form>
          </div>
        </SheetContent>
      </Sheet>
      <div className="w-full flex justify-end px-4 mt-8 mb-2">
        <Button
          onClick={() => {
            setProductsDialog(true);
            setIsEdited(false);
            setEditProduct(null);
          }}
          className="lg:text-lg font-semibold flex items-center text-xs"
        >
          Add new product
        </Button>
      </div>
      <div className=" w-full h-full flex flex-wrap justify-center lg:justify-start">
        {productList && productList.length > 0 ? (
          productList.map((e) => (
            <div className="flex-row lg:pl-6">
              <ProductTile
                products={e}
                setProductsDialog={setProductsDialog}
                isEdited={isEdited}
                setIsEdited={setIsEdited}
                currentId={currentId}
                setCurrentId={setCurrentId}
                editProduct={editProduct}
                setEditProduct={setEditProduct}
                imageEdited={imageEdited}
                setImageEdited={setImageEdited}
                isDelete={isDelete}
                setIsDelete={setIsDelete}
                isDetails={isDetails}
                setIsDetails={setIsDetails}
              />
            </div>
          ))
        ) : (
          <div className="w-[100%] h-screen flex justify-center px-2">
            <h1 className="text-3xl font-semibold lg:text-6xl mt-60">
              No items yet or refresh and wait...
            </h1>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminProducts;
