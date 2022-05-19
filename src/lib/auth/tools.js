import jwt from "jsonwebtoken"

// Token generation

// Input: payload, output: Promise that resolves into a token

export const generateJWTToken = payload =>
  new Promise((resolve, reject) =>
    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1 week" }, (err, token) => {
      if (err) reject(err)
      else resolve(token)
    })
  )
/* USAGE:
  try {
    const token = await generateJWTToken({})

    console.log(token) <-- Pending Promise not a token (if we don't use await)

  } catch (error) {
    console.log(error)
  }

  // OR

  generateJWTToken({}).then(token => console.log(token)).catch(err => console.log(err))

*/

// Verify Token

export const verifyJWTToken = token =>
  new Promise((resolve, reject) =>
    jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
      if (err) reject(err)
      else resolve(payload)
    })
  )
