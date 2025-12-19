import mongoose from 'mongoose'

const GeoPointSchema = new mongoose.Schema(
  {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: {
      type: [Number],
      // [lng, lat]
      validate: {
        validator: (v) => Array.isArray(v) && v.length === 2,
        message: 'coordinates must  [lng, lat]',
      },
      required: true,
    },
  },
  { _id: false },
)

const ContactSchema = new mongoose.Schema(
  {
    phone: { type: String, required: true },
    whatsapp: { type: String },
  },
  { _id: false },
)

const JobSchema = new mongoose.Schema(
  {
    category: { type: String, required: true, lowercase: true, index: true },
    title: { type: String, required: true, trim: true },
    area: { type: String, required: true, trim: true },
    location: { type: GeoPointSchema, required: true },

    salaryMin: { type: Number, required: true },
    salaryMax: { type: Number, required: true },
    shift: { type: String, required: true },

    verified: { type: Boolean, default: false },
    rating: { type: Number, default: null },

    postedByRole: { type: String, enum: ['employer'], default: 'employer' },
    ownerId: { type: String, required: true, index: true },

    hidden: { type: Boolean, default: false, index: true },
  },
  { timestamps: true },
)

JobSchema.index({ location: '2dsphere' })

export const Job = mongoose.model('Job', JobSchema)
