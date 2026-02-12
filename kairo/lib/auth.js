import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error('Please define the JWT_SECRET environment variable');
}

export const createToken = (payload) => {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: '7d', // Token expires in 7 days
  });
};

export const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
};

export const decodeToken = (token) => {
  try {
    return jwt.decode(token);
  } catch (error) {
    throw new Error('Invalid token format');
  }
};

// Helper function to extract token from Authorization header
export const extractTokenFromHeader = (authHeader) => {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  return authHeader.substring(7); // Remove 'Bearer ' prefix
};

// Helper function to create user payload (exclude sensitive data)
export const createUserPayload = (user) => {
  const profile = user?.profile || {};
  return {
    id: user._id,
    email: user.email,
    phoneNumber: user.phoneNumber,
    name: profile.name,
    role: profile.role,
    isPhoneVerified: profile.isPhoneVerified,
    isEmailVerified: profile.isEmailVerified,
    profile: {
      name: profile.name,
      role: profile.role,
      language: profile.language,
      city: profile.city,
      state: profile.state,
      district: profile.district,
      pincode: profile.pincode,
      location: profile.location,
      isPhoneVerified: profile.isPhoneVerified,
      isEmailVerified: profile.isEmailVerified,
      isLocationEnabled: profile.isLocationEnabled,
    },
  };
};