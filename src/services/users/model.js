// In this file we define two Mongoose Objects: Schema, Model

// Schema = shape of the data we gonna have in a certain collection
// Model = functionalities, interactions with a specific collection (find, save, update, delete)

import mongoose from "mongoose"

const { Schema, model } = mongoose

const usersSchema = new Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    dateOfBirth: { type: Date, required: true },
    purchaseHistory: [{ title: String, category: String, price: Number, purchaseDate: Date }],
  },
  {
    timestamps: true, // automatically add createdAt and updatedAt fields
  }
)

export default model("User", usersSchema) // this is going to be connected to the users collection
