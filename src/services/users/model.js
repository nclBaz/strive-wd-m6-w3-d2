// In this file we define two Mongoose Objects: Schema, Model

// Schema = shape of the data we gonna have in a certain collection
// Model = functionalities, interactions with a specific collection (find, save, update, delete)

import mongoose from "mongoose"
import bcrypt from "bcrypt"

const { Schema, model } = mongoose

const usersSchema = new Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    dateOfBirth: { type: Date, required: true },
    password: { type: String, required: true },
    purchaseHistory: [{ title: String, category: String, price: Number, purchaseDate: Date }],
  },
  {
    timestamps: true, // automatically add createdAt and updatedAt fields
  }
)

usersSchema.pre("save", async function (next) {
  const newUser = this

  const plainPw = newUser.password

  if (newUser.isModified("password")) {
    const hash = await bcrypt.hash(plainPw, 10)
    newUser.password = hash
  }

  next()
})

usersSchema.methods.toJSON = function () {
  // every time Express does a res.send() of a User, this toJSON is called
  const userDocument = this
  const userObject = userDocument.toObject()

  delete userObject.password
  delete userObject.__v

  return userObject
}

export default model("User", usersSchema) // this is going to be connected to the users collection
