import { checkSchema, validationResult } from "express-validator"
import createError from "http-errors"

const schema = {
  firstName: {
    in: ["body"],
    isString: {
      errorMessage: "First Name validation failed! firstName is a mandatory field and needs to be a string!",
    },
  },
  lastName: {
    in: ["body"],
    isString: {
      errorMessage: "Last Name validation failed! lastName is a mandatory field and needs to be a string!",
    },
  },
  email: {
    in: ["body"],
    isEmail: {
      errorMessage: "Email validation failed! Email is not in the right format!",
    },
  },
}

export const checkUserMiddleware = checkSchema(schema)

export const checkValidationResult = (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    // we had some errors!
    next(createError(400, "Validation problems in req.body", { errorsList: errors.array() }))
  } else {
    // everything is fine
    next()
  }
}
