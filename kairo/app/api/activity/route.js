import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Activity from '@/models/Activity';
import { extractTokenFromHeader, verifyToken } from '@/lib/auth';

const getAuthPayload = (request) => {
  const token = extractTokenFromHeader(request.headers.get('authorization'));
  if (!token) return null;
  try {
    return verifyToken(token);
  } catch (error) {
    return null;
  }
};

export async function GET(request) {
  try {
    const payload = getAuthPayload(request);
    if (!payload?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const limitParam = Number(searchParams.get('limit'));
    const limit = Number.isFinite(limitParam) && limitParam > 0 ? Math.min(limitParam, 20) : 10;

    await connectDB();

    const activity = await Activity.find({ userId: payload.id })
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();

    return NextResponse.json({ activity }, { status: 200 });
  } catch (error) {
    console.error('Activity GET error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
