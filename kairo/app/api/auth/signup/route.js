import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import validator from 'validator';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { createToken, createUserPayload } from '@/lib/auth';

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, email, phoneNumber, password, role, language } = body;

    // Validation
    if (!name || !email || !phoneNumber || !password) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    if (!validator.isEmail(email)) {
      return NextResponse.json(
        { error: 'Please provide a valid email address' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters long' },
        { status: 400 }
      );
    }

    // Validate phone number (basic Indian mobile number validation)
    if (!validator.isMobilePhone(phoneNumber, 'en-IN')) {
      return NextResponse.json(
        { error: 'Please provide a valid Indian mobile number' },
        { status: 400 }
      );
    }

    const normalizedLanguage = language || 'English';
    if (!['English', 'Hindi'].includes(normalizedLanguage)) {
      return NextResponse.json(
        { error: 'Please select a valid language preference' },
        { status: 400 }
      );
    }

    // Connect to database
    await connectDB();

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { phoneNumber }],
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email or phone number already exists' },
        { status: 400 }
      );
    }

    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create user
    const newUser = new User({
      email,
      phoneNumber,
      password: hashedPassword,
      profile: {
        name,
        role: role || 'citizen', // Default to citizen if not provided
        language: normalizedLanguage,
      },
    });

    const savedUser = await newUser.save();

    // Create user payload for response (exclude password)
    const userPayload = createUserPayload(savedUser);

    return NextResponse.json(
      {
        message: 'User created successfully. Please verify your phone number.',
        user: userPayload,
        requiresOTP: true,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}