import mongoose from 'mongoose';

const activitySchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    type: {
      type: String,
      enum: ['petition_created', 'petition_signed'],
      required: true,
    },
    petitionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Petition' },
    petitionTitle: { type: String, trim: true },
  },
  {
    timestamps: true,
  }
);

activitySchema.index({ userId: 1, createdAt: -1 });

export default mongoose.models.Activity || mongoose.model('Activity', activitySchema);
