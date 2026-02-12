import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Petition from '@/models/Petition';
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

export async function GET(request, { params }) {
  try {
    const { id } = await params;

    await connectDB();

    const petition = await Petition.findById(id).lean();
    if (!petition) {
      return NextResponse.json({ error: 'Petition not found' }, { status: 404 });
    }

    const payload = getAuthPayload(request);
    const isOwner = payload?.id && String(petition.author) === String(payload.id);

    const responsePetition = {
      ...petition,
      signatures: isOwner ? petition.signatures : [],
      signatureCount: petition.signatures?.length || 0,
      isOwner,
    };

    return NextResponse.json({ petition: responsePetition }, { status: 200 });
  } catch (error) {
    console.error('Petition GET error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
