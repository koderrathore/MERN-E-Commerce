import { v2 as cloudinary } from 'cloudinary'
import multer from"multer"
import dotenv from "dotenv";
dotenv.config();

const cloud_name = process.env.CLOUD_NAME
const cloud_key = process.env.CLOUD_KEY
const cloud_secret = process.env.CLOUD_SECRET

cloudinary.config({
  cloud_name:cloud_name,
  api_key:cloud_key,
  api_secret:cloud_secret,
})

const storage = new multer.memoryStorage()

export const imageUpload = async (file) => {
    const result = await cloudinary.uploader.upload(file,{
        resource_type:"auto"
    })
    return result
}

export const upload = multer({storage});

