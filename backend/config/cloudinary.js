const multer = require('multer')
const {CloudinaryStorage} = require('multer-storage-cloudinary')
const cloudinary = require('cloudinary').v2;
require('dotenv').config();


cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
})

const uploadFileToCloudinary = (file) => {
    const options = {
        resource_type: file.mimetype.startsWith('video') ? 'video' : 'image'
    }

    return new Promise((resolve, reject) =>{
        //for video update 
        if(file.mimetype.startsWith('video')){
            cloudinary.uploader.upload_large(file.path, options, (error, result) => {
                if(error){
                    return reject(error);
                }
                resolve(result)
            })
        }else{
            //image upload
            cloudinary.uploader.upload(file.path, options, (error, result) => {
                if(error){
                    return reject(error);
                }
                resolve(result)
            })
        }
    })
}

const deleteFileFromCloudinary = async (publicId, resourceType = 'image') => {
    try {
        const result = await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
        console.log('Cloudinary destroy result:', result);
        console.log(`Successfully deleted ${publicId} from Cloudinary.`);
        return result;
    } catch (error) {
        console.error(`Error deleting file from Cloudinary: ${error.message}`);
        throw error;
    }
};

const multerMiddleware = multer({dest : "uploads/"})
module.exports= {multerMiddleware, uploadFileToCloudinary, deleteFileFromCloudinary}
