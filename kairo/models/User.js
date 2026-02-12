import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    phoneNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    profile: {
      name: {
        type: String,
        required: true,
        trim: true,
      },
      state: {
        type: String,
        trim: true,
      },
      city: {
        type: String,
        trim: true,
      },
      district: {
        type: String,
        trim: true,
      },
      pincode: {
        type: String,
        trim: true,
        match: [/^\d{6}$/, 'Please enter a valid 6-digit PIN code'],
      },
      location: {
        latitude: {
          type: Number,
          min: -90,
          max: 90,
        },
        longitude: {
          type: Number,
          min: -180,
          max: 180,
        },
        address: {
          type: String,
          trim: true,
          maxlength: 500,
        },
        lastUpdated: {
          type: Date,
          default: Date.now,
        },
        accuracy: {
          type: Number, // GPS accuracy in meters
        },
        isManuallyEntered: {
          type: Boolean,
          default: false,
        },
      },
      role: {
        type: String,
        default: 'citizen',
        enum: [
          'citizen',
          'worker',
          'student', 
          'woman',
          'senior',
          'business',
          'government',
          'ngo',
          'activist',
          'lawyer',
          'journalist',
          'researcher',
          'volunteer'
        ],
      },
      language: {
        type: String,
        enum: ['English', 'Hindi'],
        default: 'English',
      },
      location: {
        latitude: {
          type: Number,
          min: -90,
          max: 90,
        },
        longitude: {
          type: Number,
          min: -180,  
          max: 180,
        },
        address: {
          type: String,
          trim: true,
        },
        district: {
          type: String,
          trim: true,
        },
        pincode: {
          type: String,
          trim: true,
        },
        lastUpdated: {
          type: Date,
        },
        accuracy: {
          type: Number, // GPS accuracy in meters
        },
      },
      isPhoneVerified: {
        type: Boolean,
        default: false,
      },
      isEmailVerified: {
        type: Boolean,
        default: false,
      },
      isLocationEnabled: {
        type: Boolean,
        default: false,
      },
    },
    status: {
      type: String,
      default: 'active',
      enum: ['active', 'inactive', 'suspended'],
    },
    lastLoginAt: {
      type: Date,
    },
  },
  {
    timestamps: true, // This adds createdAt and updatedAt automatically
  }
);

// Index for faster queries
userSchema.index({ email: 1 });
userSchema.index({ phoneNumber: 1 });

export default mongoose.models.User || mongoose.model('User', userSchema);