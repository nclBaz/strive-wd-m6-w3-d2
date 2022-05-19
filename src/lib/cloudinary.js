import multer from "multer"
import { v2 as cloudinary } from "cloudinary" // to find credentials (CLOUDINARY_URL) from process.env
import { CloudinaryStorage } from "multer-storage-cloudinary" // multer plugin used to tell multer to save files on cloudinary
import createError from "http-errors"

export const cloudinaryUploader = multer({
  storage: new CloudinaryStorage({
    cloudinary,
    params: {
      folder: "webdev/nov21",
    },
  }),
  limits: { fileSize: 1 * 1024 * 1024 },
  fileFilter: (req, file, multerNext) => {
    if (file.mimetype !== "image/gif") {
      return multerNext(createError(400, "Only GIFs are allowed!"))
    } else {
      multerNext(null, true)
    }
  },
}).single("avatar")
