import express from "express"
import listEndpoints from "express-list-endpoints"
import mongoose from "mongoose"
import createError from "http-errors"
import cors from "cors"
import usersRouter from "./services/users/index.js"
import booksRouter from "./services/books/index.js"
import authorsRouter from "./services/authors/index.js"
import filesRouter from "./services/files/index.js"
import { badRequestHandler, unauthorizedHandler, forbiddenHandler, notFoundHandler, genericErrorHandler } from "./errorsHandlers.js"

const server = express()

const port = 3001

// *************************** MIDDLEWARES **************************************************

const loggerMiddleware = (req, res, next) => {
  console.log(`Incoming request --> ${req.method} -- ${new Date()}`)
  // req.name = "Renan"
  next()
}

const policeOfficerMiddleware = (req, res, next) => {
  console.log("Current user name: ", req.name)
  if (req.name === "Renan") {
    next()
  } else {
    next(createError(401, "Only Renans allowed!"))
  }
}
// ** GLOBAL LEVEL MIDDLEWARES **

server.use(cors()) // YOU NEED THIS TO CONNECT YOUR FE TO THIS BE
server.use(loggerMiddleware)
// server.use(policeOfficerMiddleware)
server.use(express.json()) // if you don't add this line BEFORE the endpoints, all requests' bodies will be UNDEFINED

// ************************ ENDPOINTS *******************

server.use("/users", usersRouter) // in this case loggerMiddleware is used as a ROUTER LEVEL MIDDLEWARE
server.use("/books", booksRouter)
server.use("/authors", authorsRouter)
server.use("/files", filesRouter)

// *********************** ERROR HANDLERS ********************************
server.use(badRequestHandler)
server.use(unauthorizedHandler)
server.use(forbiddenHandler)
server.use(notFoundHandler)
server.use(genericErrorHandler)

// ********************** DATABASE CONNECTION ************************

mongoose.connect(process.env.MONGO_CONNECTION_URL)

mongoose.connection.on("connected", () => {
  console.log(`Connected to MongoDB!`)
  server.listen(port, () => {
    console.table(listEndpoints(server))
    console.log(`Server is running on port ${port}`)
  })
})
