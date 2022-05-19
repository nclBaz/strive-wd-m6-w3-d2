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
    role: { type: String, required: true, default: "User", enum: ["User", "Admin"] },
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

usersSchema.statics.checkCredentials = async function (email, plainPw) {
  // .static.customMethod() lets me define some custom methods attached to the UsersModel

  // In the "statics", this keyword represents the UsersModel itself

  // 1. Search if email exists in our DB
  const user = await this.findOne({ email })

  if (user) {
    // 2. If email exists we need to check the PW (bcrypt.compare)

    const isMatch = await bcrypt.compare(plainPw, user.password)

    if (isMatch) {
      // 3. If everything is fine we gonna return the user himself
      return user
    } else {
      // 4. Password not correct
      return null
    }
  } else {
    // 4. Email not correct
    return null
  }
}

// usage --> await UsersModel.checkCrentials("john@doe.com", "1234")

export default model("User", usersSchema) // this is going to be connected to the users collection
