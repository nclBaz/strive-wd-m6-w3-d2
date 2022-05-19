import express from "express"
import createError from "http-errors"
import AuthorsModel from "./model.js"

const authorsRouter = express.Router()

authorsRouter.post("/", async (req, res, next) => {
  try {
    const newUser = new AuthorsModel(req.body)
    const { _id } = await newUser.save()
    res.status(201).send({ _id })
  } catch (error) {
    next(error)
  }
})

authorsRouter.get("/", async (req, res, next) => {
  try {
    const users = await AuthorsModel.find()
    res.send(users)
  } catch (error) {
    next(error)
  }
})

authorsRouter.get("/:userId", async (req, res, next) => {
  try {
    const user = await AuthorsModel.findById(req.params.userId)
    if (user) {
      res.send(user)
    } else {
      next(createError(404, `User with id ${req.params.userId} not found!`))
    }
  } catch (error) {
    next(error)
  }
})

authorsRouter.put("/:userId", async (req, res, next) => {
  try {
    const updatedUser = await AuthorsModel.findByIdAndUpdate(req.params.userId, req.body, { new: true, runValidators: true })
    if (updatedUser) {
      res.send(updatedUser)
    } else {
      next(createError(404, `User with id ${req.params.userId} not found!`))
    }
  } catch (error) {
    next(error)
  }
})

authorsRouter.delete("/:id", async (req, res, next) => {
  try {
    const deletedUser = await AuthorsModel.findByIdAndUpdate(req.params.userId)
    if (deletedUser) {
      res.status(204).send()
    } else {
      next(createError(404, `User with id ${req.params.userId} not found!`))
    }
  } catch (error) {
    next(error)
  }
})

export default authorsRouter
