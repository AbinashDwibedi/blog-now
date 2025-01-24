import {v2 as cloudinary} from "cloudinary";
import fs from "fs"

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
})

export const uploadOnCloudinary=async(localFilePath)=>{
    try {
        if(!localFilePath) return null;
        const response = await cloudinary.uploader.upload(localFilePath,{
            resource_type: "auto",
            quality: 'auto:eco',
        })
        fs.unlinkSync(localFilePath);
        return response;
    } catch (error) {
        fs.unlinkSync(localFilePath);
        return null
    }
}

export const deleteImageFromCloudinary = async (imageUrl) => {
    const publicId = imageUrl.split('/').slice(-1)[0].split('.')[0];
  
    try {
      const result = await cloudinary.uploader.destroy(publicId);
      console.log('Image deleted:', result);
      return result;
    } catch (error) {
      console.error('Error deleting image from Cloudinary:', error);
      throw error;
    }
  };
  