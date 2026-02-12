import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { extractTokenFromHeader, verifyToken, createUserPayload } from '@/lib/auth';

const getAuthPayload = (request) => {
  const token = extractTokenFromHeader(request.headers.get('authorization'));
  if (!token) return null;
  try {
    return verifyToken(token);
  } catch (error) {
    return null;
  }
};

export async function POST(request) {
  try {
    const payload = getAuthPayload(request);
    if (!payload?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const {
      location,
      city,
      state,
      district,
      pincode,
      address,
      isManuallyEntered = false,
    } = body || {};

    await connectDB();

    const user = await User.findById(payload.id);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const profile = user.profile || {};

    if (city) profile.city = city;
    if (state) profile.state = state;
    if (district) profile.district = district;
    if (pincode) profile.pincode = pincode;

    const nextLocation = {
      latitude: location?.latitude ?? profile.location?.latitude ?? undefined,
      longitude: location?.longitude ?? profile.location?.longitude ?? undefined,
      address: address || location?.address || profile.location?.address || undefined,
      accuracy: location?.accuracy ?? profile.location?.accuracy ?? undefined,
      lastUpdated: new Date(),
      isManuallyEntered: Boolean(isManuallyEntered),
    };

    profile.location = {
      ...profile.location,
      ...nextLocation,
    };

    profile.isLocationEnabled = Boolean(
      profile.location?.latitude || profile.location?.longitude || profile.city || profile.state
    );

    user.profile = profile;
    await user.save();

    const userPayload = createUserPayload(user);

    return NextResponse.json({ user: userPayload }, { status: 200 });
  } catch (error) {
    console.error('Update location error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
