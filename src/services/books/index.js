// ************************* BOOKS CRUD ********************************

// 1. POST http://localhost:3001/books/ --> CREATES A NEW USER
// 2. GET http://localhost:3001/books/ --> LIST ALL THE books
// 3. GET http://localhost:3001/books/:id --> READ A SINGLE USER (specified by id)
// 4. PUT http://localhost:3001/books/:id --> UPDATES A SINGLE USER (specified by id)
// 5. DELETE http://localhost:3001/books/:id --> DELETES A SINGLE USER (specified by id)

import express from "express"
import q2m from "query-to-mongo"
import BooksModel from "./model.js"

const booksRouter = express.Router()

// 1.
booksRouter.post("/", async (req, res, next) => {
  // (req, res, next) => {} is the ENDPOINT HANDLER. Is the function that will be executed every time a request on that endpoint is sent. req and res are REQUEST and RESPONSE objects

  const newBook = new BooksModel(req.body)
  const { _id } = await newBook.save()
  res.send({ _id })
})

// 2.
booksRouter.get("/", async (req, res, next) => {
  try {
    console.log("REQ.QUERY --> ", req.query)
    console.log("MONGO QUERY --> ", q2m(req.query))

    const mongoQuery = q2m(req.query)

    const total = await BooksModel.countDocuments(mongoQuery.criteria)

    if (!mongoQuery.options.skip) mongoQuery.options.skip = 0

    if (!mongoQuery.options.limit || mongoQuery.options.limit > 10) mongoQuery.options.limit = 20

    const books = await BooksModel.find(mongoQuery.criteria, mongoQuery.options.fields)
      .skip(mongoQuery.options.skip)
      .limit(mongoQuery.options.limit)
      .sort(mongoQuery.options.sort)
      .populate({ path: "author", select: "name surname" })

    res.send({
      links: mongoQuery.links(`${process.env.API_URL}/books`, total),
      total,
      totalPages: Math.ceil(total / mongoQuery.options.limit),
      books,
    })
  } catch (error) {
    next(error)
  }
})

// 3.
booksRouter.get("/:id", async (req, res, next) => {
  const book = await BooksModel.findById(req.params.id).populate({ path: "author", select: "name surname" })
  res.send(book)
})

// 4.
booksRouter.put("/:id", (req, res, next) => {
  res.send({ message: `HELLO I AM THE ${req.method} ROUTE: ` })
})

// 5.
booksRouter.delete("/:id", (req, res, next) => {
  res.send({ message: `HELLO I AM THE ${req.method} ROUTE: ` })
})

export default booksRouter
