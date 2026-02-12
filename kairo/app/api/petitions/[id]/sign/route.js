import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Petition from '@/models/Petition';
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

export async function POST(request, { params }) {
  try {
    const payload = getAuthPayload(request);
    if (!payload?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    await connectDB();

    const petition = await Petition.findById(id);
    if (!petition) {
      return NextResponse.json({ error: 'Petition not found' }, { status: 404 });
    }

    if (String(petition.author) === String(payload.id)) {
      return NextResponse.json({ error: 'You cannot sign your own petition' }, { status: 400 });
    }

    const alreadySigned = petition.signatures.some(
      (signature) => String(signature.userId) === String(payload.id)
    );

    if (alreadySigned) {
      return NextResponse.json({ error: 'You have already signed this petition' }, { status: 400 });
    }

    petition.signatures.push({
      userId: payload.id,
      name: payload.name || payload.profile?.name || 'Supporter',
      email: payload.email,
    });

    await petition.save();

    const petitionTitle = petition.content?.en?.title
      || petition.content?.hi?.title
      || 'Untitled Petition';

    try {
      await Activity.create({
        userId: payload.id,
        type: 'petition_signed',
        petitionId: petition._id,
        petitionTitle,
      });
    } catch (activityError) {
      console.warn('Activity sign error:', activityError);
    }

    return NextResponse.json(
      { message: 'Signature added', signatureCount: petition.signatures.length },
      { status: 200 }
    );
  } catch (error) {
    console.error('Petition sign error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
