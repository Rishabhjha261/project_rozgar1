import mongoose from 'mongoose'

const UserSchema = new mongoose.Schema(
  {
    phone: { type: String, required: true, trim: true, unique: true, index: true },
    role: { type: String, enum: ['employee', 'employer', 'admin'], default: 'employee', index: true },
  },
  { timestamps: true },
)

export const User = mongoose.model('User', UserSchema)
