import axiosInstance from "@/axios";
import { Button } from "@/components/ui/button";
import { Label } from "@radix-ui/react-label";
import axios from "axios";
import { CloudDownload, FileIcon, XIcon } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";

const ImageUpload = ({
  imageFile,
  setImageFile,
  uploadedImageFile,
  setUploadedImageFile,
  image,
  setImage,
  imageFileLoader,
  setImageFileLoader,
  isEdited,
  setIsEdited,
  editProduct,
  setEditProduct,
  imageEdited,
  setImageEdited,
  loader,
  setLoader,
}) => {
  const imageRef = useRef(null);
  const [editURL, setEditURL] = useState(null);

  const handleImageUpload = (e) => {
    setImageFile(e.target.files?.[0]);
  };

  const handleDrageOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setImageFile(e.dataTransfer.files?.[0]);
    setImage(e.dataTransfer.files?.[0]);
  };

  const handlRemoveImage = (e) => {
    setImageFile(null);
    setImageEdited(false);
    setImage("");
    if (imageRef.current) {
      imageRef.current.value = "";
    }
  };

  const uploadImageToCloud = async () => {
    setLoader(true);

    if (imageEdited) return setImage(editProduct?.image);

    const data = new FormData();
    data.append("image", imageFile);
    const response = await axiosInstance.post(
      `/api/admin/upload-image`,

      data
    );
    console.log(response);
    if (response.data?.success) {
      setLoader(false);
      setUploadedImageFile(response.data.result?.url);
      setImage(response.data.result?.url);
    }
  };

  if (imageEdited) {
    setImage(editProduct?.image);
  }

  useEffect(() => {
    if (imageFile !== null) uploadImageToCloud();
  }, [imageFile]);

  return (
    <div className="flex flex-col">
      {loader ? (
        <div className="h-28 w-68 rounded-lg bg-black text-white justify-center items-center flex">
          Image Upload...
        </div>
      ) : image && imageEdited ? (
        <div className="flex">
          {imageEdited ? (
            <div className="h-28 w-32 lg:h-36 lg:w-40">
              <img
                className="w-full h-full object-cover"
                src={image}
                alt="Product Image"
              />
            </div>
          ) : (
            <h1 className="bg-red-600">{imageFile?.name}</h1>
          )}{" "}
          <Button
            className="w-8 h-8 ml-2 lg:ml-4"
            onClick={(e) => {
              setImage("");
              setImageEdited(false);
            }}
          >
            <XIcon />
          </Button>
        </div>
      ) : (
        <div>
          <h1 className="text-xl">Upload Image</h1>
          <input
            id="imageUpload"
            type="file"
            className="hidden"
            ref={imageRef}
            onChange={(e) => {
              handleImageUpload(e);
            }}
          />
          {!imageFile ? (
            <Label
              onDragOver={(e) => {
                handleDrageOver(e);
              }}
              onDrop={(e) => {
                handleDrop(e);
              }}
              htmlFor="imageUpload"
              className="flex flex-col h-28 w-68 border-2 border-dotted justify-center items-center border-black mt-1 rounded-md"
            >
              <CloudDownload className="h-24 -mt-8 w-12" />
              <h1 className="text-sm -mt-4">
                Drag & drop or click to upload image
              </h1>
            </Label>
          ) : (
            <div className="relative flex gap-2 items-center mt-1 h-28 w-68 overflow-hidden border-2 border-dotted border-black justify-center rounded-md px-2">
              <div className="flex justify-center items-center pl-2">
                {/* <FileIcon className="h-4 w-4" /> */}
                <div className="h-28 w-32 lg:h-36 lg:w-40">
              <img
                className="w-full h-full object-cover"
                src={image}
                alt="Product Image"
              />
            </div>
              </div>
              <Button
                className="w-8 h-8 absolute right-1 top-1"
                onClick={(e) => {
                  handlRemoveImage(e);
                }}
              >
                <XIcon />
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
