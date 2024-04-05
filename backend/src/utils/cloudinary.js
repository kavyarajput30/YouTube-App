import {v2 as cloudinary} from 'cloudinary';
import fs from 'fs';        
cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET 
});

const uploadOnCloundinary = async function(localFilePath){
 try{
   if (!localFilePath) {
      console.error("Local file path is missing.");
      return null;
    }
    // if available upload it on cloudnary
 const responce= await  cloudinary.uploader.upload(localFilePath,{
        resource_type:"auto"
    })

    console.log("Cloudinary upload response:", responce);
   //  file has been uploaded sucessfully
    fs.unlinkSync(localFilePath);
    console.log("Local file deleted:", localFilePath);
    
    console.log("File uploaded sucessfully on cloudinary" + responce.url);
    return responce;
 }catch(error){
    console.log("File upload failed on cloudinary" + error);
    // it removed the local  upload file
    fs.unlinkSync(localFilePath);
    return null;

 }
}


export default uploadOnCloundinary;