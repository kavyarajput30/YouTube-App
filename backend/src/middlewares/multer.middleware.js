import multer from "multer";

// dist storage we are using but theier is another storage called memory storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './public/temp')
    },
    filename: function (req, file, cb) {

      cb(null, file.originalname)
    }
  })
  
export const upload = multer({ storage })