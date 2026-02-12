import mongoose from 'mongoose';

const petitionContentSchema = new mongoose.Schema(
  {
    title: { type: String, trim: true },
    description: { type: String, trim: true },
  },
  { _id: false }
);

const signatureSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, trim: true },
    email: { type: String, trim: true, lowercase: true },
    signedAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const petitionSchema = new mongoose.Schema(
  {
    content: {
      en: petitionContentSchema,
      hi: petitionContentSchema,
    },
    category: { type: String, trim: true },
    city: { type: String, trim: true },
    state: { type: String, trim: true },
    target: { type: String, trim: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    authorName: { type: String, trim: true },
    status: {
      type: String,
      enum: ['draft', 'active', 'closed'],
      default: 'active',
    },
    signatures: [signatureSchema],
  },
  {
    timestamps: true,
  }
);

petitionSchema.index({ author: 1, createdAt: -1 });
petitionSchema.index({ status: 1, createdAt: -1 });
petitionSchema.index({ city: 1, state: 1, createdAt: -1 });

export default mongoose.models.Petition || mongoose.model('Petition', petitionSchema);
