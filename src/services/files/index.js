import express from "express"
import { cloudinaryUploader } from "../../lib/cloudinary.js"

const filesRouter = express.Router()

filesRouter.post("/upload", cloudinaryUploader, async (req, res, next) => {
  // "avatar" needs to match exactly the name of the property that contains inside the request body (which is of type multipart/form-data)
  try {
    console.log(req.file)
    // once image is saved on Cloudinary you gonna get back a req.file.path which is the url to retrieve that image
    // you then need to save that URL into the corresponding resource in db
    res.send()
  } catch (error) {
    next(error)
  }
})

export default filesRouter
