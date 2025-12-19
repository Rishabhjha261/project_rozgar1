import mongoose from 'mongoose'

const ReportSchema = new mongoose.Schema(
  {
    jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true, index: true },
    reason: { type: String, required: true },
    notes: { type: String, default: '' },
    status: { type: String, enum: ['open', 'resolved'], default: 'open', index: true },
    reporterId: { type: String, required: true, index: true },
  },
  { timestamps: true },
)

export const Report = mongoose.model('Report', ReportSchema)
