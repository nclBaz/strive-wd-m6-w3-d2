// ************************* USERS CRUD ********************************

// 1. POST http://localhost:3001/users/ --> CREATES A NEW USER
// 2. GET http://localhost:3001/users/ --> LIST ALL THE USERS
// 3. GET http://localhost:3001/users/:id --> READ A SINGLE USER (specified by id)
// 4. PUT http://localhost:3001/users/:id --> UPDATES A SINGLE USER (specified by id)
// 5. DELETE http://localhost:3001/users/:id --> DELETES A SINGLE USER (specified by id)

import express from "express"
import createError from "http-errors"
import UsersModel from "./model.js"
import { checkUserMiddleware, checkValidationResult } from "./validation.js"
import BooksModel from "../books/model.js"
import { sendEmail } from "../../lib/emails.js"

const usersRouter = express.Router()

// const anotherStupidMiddleware = (req, res, next) => {
//   console.log("I am a stupid middleware!")
//   next()
// }

// 1.
usersRouter.post("/", checkUserMiddleware, checkValidationResult, async (req, res, next) => {
  try {
    // (req, res, next) => {} is the ENDPOINT HANDLER. Is the function that will be executed every time a request on that endpoint is sent. req and res are REQUEST and RESPONSE objects

    console.log("REQUEST BODY: ", req.body)

    const newUser = new UsersModel(req.body) // this is going to VALIDATE the req.body
    const savedUser = await newUser.save() // This saves the validated body into the users' collection

    res.send(savedUser)
  } catch (error) {
    next(error)
  }
})

// 2.
usersRouter.get("/", async (req, res, next) => {
  try {
    // throw new Error("KABOOOOOOOOOOOOOOOM!")
    const users = await UsersModel.find()
    res.send(users)
  } catch (error) {
    next(error)
  }
})

// 3.
usersRouter.get("/:userId", async (req, res, next) => {
  try {
    const user = await UsersModel.findById(req.params.userId)
    if (user) {
      res.send(user)
    } else {
      next(createError(404, `User with id ${req.params.userId} not found!`))
    }
  } catch (error) {
    next(error)
  }
})

// 4.
usersRouter.put("/:userId", async (req, res, next) => {
  try {
    const updatedUser = await UsersModel.findByIdAndUpdate(
      req.params.userId, // WHO
      req.body, // HOW
      { new: true } // OPTIONS (if you want to obtain the updated user you should specify new: true)
    )
    if (updatedUser) {
      res.send(updatedUser)
    } else {
      next(createError(404, `User with id ${req.params.userId} not found!`))
    }
  } catch (error) {
    next(error)
  }
})

// 5.
usersRouter.delete("/:userId", async (req, res, next) => {
  try {
    const deletedUser = await UsersModel.findByIdAndDelete(req.params.userId)
    if (deletedUser) {
      res.status(204).send()
    } else {
      next(createError(404, `User with id ${req.params.userId} not found!`))
    }
  } catch (error) {
    next(error)
  }
})

usersRouter.post("/:userId/purchaseHistory", async (req, res, next) => {
  try {
    // we gonna receive the bookId from the req.body. Given that id, we would like to insert the corresponding book into the purchaseHistory of the specified user

    // 1. Find the book in the books' collection by _id
    const purchasedBook = await BooksModel.findById(req.body.bookId, { _id: 0 })

    if (purchasedBook) {
      // 2. If the book is found --> add additional info, like purchaseDate

      const bookToInsert = { ...purchasedBook.toObject(), purchaseDate: new Date() } // purchasedBook (and everything you get from .find() .findById()...) is a MONGOOSE DOCUMENT (special object with lots of strange fields), it is NOT A NORMAL OBJECT. If I want to spread it I shall use .toObject() method, which converts a DOCUMENT into a PLAIN OBJECT

      console.log(bookToInsert)

      // 3. Update the specified user by adding that book to his purchaseHistory array

      const modifiedUser = await UsersModel.findByIdAndUpdate(
        req.params.userId, //WHO
        { $push: { purchaseHistory: bookToInsert } }, // HOW
        { new: true }
      )
      if (modifiedUser) {
        res.send(modifiedUser)
      } else {
        next(createError(404, `User with id ${req.params.userId} not found!`))
      }
    } else {
      next(createError(404, `Book with id ${req.body.bookId} not found!`))
    }

    // 4. Handle errors
  } catch (error) {
    next(error)
  }
})

usersRouter.get("/:userId/purchaseHistory", async (req, res, next) => {
  try {
    const user = await UsersModel.findById(req.params.userId)
    if (user) {
      res.send(user.purchaseHistory)
    } else {
      next(createError(404, `User with id ${req.params.userId} not found!`))
    }
  } catch (error) {
    next(error)
  }
})

usersRouter.get("/:userId/purchaseHistory/:bookId", async (req, res, next) => {
  try {
    const user = await UsersModel.findById(req.params.userId)
    if (user) {
      const purchasedBook = user.purchaseHistory.find(book => book._id.toString() === req.params.bookId) // you CANNOT compare a string with an objectID!!!! --> we shall convert objectId into a string
      if (purchasedBook) {
        res.send(purchasedBook)
      } else {
        next(createError(404, `Book with id ${req.params.bookId} not found!`))
      }
    } else {
      next(createError(404, `User with id ${req.params.userId} not found!`))
    }
  } catch (error) {
    next(error)
  }
})

usersRouter.put("/:userId/purchaseHistory/:bookId", async (req, res, next) => {
  try {
    // 1. Find the user
    const user = await UsersModel.findById(req.params.userId) // user is a MONGOOSE DOCUMENT, not a normal object --> it has some SUPERPOWERS

    if (user) {
      // 2. Use JavaScript to modify him

      // 2.1 Find Index of the element

      const index = user.purchaseHistory.findIndex(book => book._id.toString() === req.params.bookId)

      if (index !== -1) {
        // 2.2 If index is found --> update the element in that position
        const oldObject = user.purchaseHistory[index].toObject()

        user.purchaseHistory[index] = { ...oldObject, ...req.body }

        // 3. Save it back
        await user.save() // since user is a MONGOOSE DOCUMENT I can use .save()
        res.send(user)
      } else {
        next(createError(404, `Book with id ${req.params.bookId} not found!`))
      }
    } else {
      next(createError(404, `User with id ${req.params.userId} not found!`))
    }
  } catch (error) {
    next(error)
  }
})

usersRouter.delete("/:userId/purchaseHistory/:bookId", async (req, res, next) => {
  try {
    const modifiedUser = await UsersModel.findByIdAndUpdate(
      req.params.userId, //WHO
      { $pull: { purchaseHistory: { _id: req.params.bookId } } }, // HOW
      { new: true } // OPTIONS
    )
    if (modifiedUser) {
      res.send(modifiedUser)
    } else {
      next(createError(404, `User with id ${req.params.userId} not found!`))
    }
  } catch (error) {
    next(error)
  }
})

usersRouter.post("/email", async (req, res, next) => {
  try {
    // 1. We are receiving the email address of the recipient from req.body
    const { email } = req.body

    // 2. We gonna send an email to that address
    await sendEmail(email)

    // 3. Send a response back
    res.send({ message: "Email sent successfully!" })
  } catch (error) {
    next(error)
  }
})

export default usersRouter
