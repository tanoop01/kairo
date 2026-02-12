import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import validator from 'validator';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { createToken, createUserPayload } from '@/lib/auth';

export async function POST(request) {
  try {
    const body = await request.json();
    const { emailOrPhone, password } = body;

    // Validation
    if (!emailOrPhone || !password) {
      return NextResponse.json(
        { error: 'Email/phone and password are required' },
        { status: 400 }
      );
    }

    // Connect to database
    await connectDB();

    // Determine if input is email or phone number
    let query = {};
    if (validator.isEmail(emailOrPhone)) {
      query.email = emailOrPhone.toLowerCase();
    } else {
      query.phoneNumber = emailOrPhone;
    }

    // Find user
    const user = await User.findOne(query);

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid email/phone or password' },
        { status: 401 }
      );
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Invalid email/phone or password' },
        { status: 401 }
      );
    }

    // Update last login time
    user.lastLoginAt = new Date();
    await user.save();

    // Create JWT token
    const userPayload = createUserPayload(user);
    const token = createToken(userPayload);

    return NextResponse.json(
      {
        message: 'Login successful!',
        token,
        user: userPayload,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}