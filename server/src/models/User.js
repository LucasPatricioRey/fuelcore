import mongoose from 'mongoose'

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 50,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 50,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
    },
    role: {
      type: String,
      enum: ['client', 'admin'],
      default: 'client',
    },
    phone: {
      type: String,
      trim: true,
      default: '',
    },
  },
  {
    timestamps: true,
    versionKey: false,
    toJSON: {
      transform: (_document, returnedObject) => {
        delete returnedObject.password
        return returnedObject
      },
    },
  },
)

export const User = mongoose.model('User', userSchema)
