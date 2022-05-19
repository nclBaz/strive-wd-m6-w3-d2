import createError from "http-errors"
import { verifyJWTToken } from "./tools.js"

export const JWTAuthMiddleware = async (req, res, next) => {
  // 1. Check if request contains Authorization header, in case it doesn't --> 401 error
  if (!req.headers.authorization) {
    next(createError(401, "Please provide bearer token in the Authorization header!"))
  } else {
    try {
      // 2. Extract the token from the Authorization header ("Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2Mjg2N2YwZDAyYjc0NGMyNzcwZTgwZGEiLCJpYXQiOjE2NTI5ODU5NTgsImV4cCI6MTY1MzU5MDc1OH0.oGDhjmQm_aL64YkDxNQOFeII_D8ugI3SHt0wUShnvjo")
      const token = req.headers.authorization.replace("Bearer ", "")

      // 3. Verify token validity and integrity. In case of error --> 401 error
      const payload = await verifyJWTToken(token)

      // 4. If everything is fine --> next() attaching to the request some informations about the current logged in user

      req.user = {
        _id: payload._id,
        role: payload.role,
      }

      next()
    } catch (error) {
      console.log(error)
      next(createError(401, "Token not valid!"))
    }
  }
}
