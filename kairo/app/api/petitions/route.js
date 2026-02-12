import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Petition from '@/models/Petition';
import User from '@/models/User';
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
    const { searchParams } = new URL(request.url);
    const mine = searchParams.get('mine');
    const city = searchParams.get('city')?.trim();
    const state = searchParams.get('state')?.trim();

    await connectDB();

    if (mine) {
      const payload = getAuthPayload(request);
      if (!payload?.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }

      const petitions = await Petition.find({ author: payload.id })
        .sort({ createdAt: -1 })
        .lean();

      return NextResponse.json({ petitions }, { status: 200 });
    }

    const filter = { status: 'active' };
    if (city) {
      const escapedCity = city.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      filter.city = { $regex: `^${escapedCity}$`, $options: 'i' };
    }
    if (state) {
      const escapedState = state.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      filter.$or = [
        { state: { $regex: `^${escapedState}$`, $options: 'i' } },
        { state: { $exists: false } },
        { state: '' },
        { state: null },
      ];
    }

    const petitions = await Petition.find(filter)
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({ petitions }, { status: 200 });
  } catch (error) {
    console.error('Petitions GET error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const payload = getAuthPayload(request);
    if (!payload?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { title, description, category, target, language, city, state } = body;

    if (!title || !description) {
      return NextResponse.json({ error: 'Title and description are required' }, { status: 400 });
    }

    const contentLanguage = language === 'hi' ? 'hi' : 'en';

    await connectDB();

    const normalizedCity = city?.trim();
    const normalizedState = state?.trim();
    let resolvedCity = normalizedCity || '';
    let resolvedState = normalizedState || '';

    if (!resolvedCity && !resolvedState) {
      const user = await User.findById(payload.id).lean();
      resolvedCity = user?.profile?.city?.trim() || '';
      resolvedState = user?.profile?.state?.trim() || '';
    }

    const petition = await Petition.create({
      content: {
        en: contentLanguage === 'en' ? { title, description } : { title: '', description: '' },
        hi: contentLanguage === 'hi' ? { title, description } : { title: '', description: '' },
      },
      category: category || 'general',
      city: resolvedCity,
      state: resolvedState,
      target: target || 'Local Authority',
      author: payload.id,
      authorName: payload.name || payload.profile?.name || 'Citizen',
      status: 'active',
      signatures: [],
    });

    try {
      await Activity.create({
        userId: payload.id,
        type: 'petition_created',
        petitionId: petition._id,
        petitionTitle: title || 'Untitled Petition',
      });
    } catch (activityError) {
      console.warn('Activity create error:', activityError);
    }

    return NextResponse.json({ petition }, { status: 201 });
  } catch (error) {
    console.error('Petitions POST error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
