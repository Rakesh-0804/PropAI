import { NextRequest, NextResponse } from 'next/server';
import { generate3DFloorPlan, get3DFloorPlanForProperty } from '@/lib/ai/floorPlanGenerator';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const propertyId = searchParams.get('propertyId');

    if (!propertyId) {
      return NextResponse.json({ error: 'propertyId parameter is required' }, { status: 400 });
    }

    let floorPlan = await get3DFloorPlanForProperty(propertyId);

    // Auto-generate if not existing
    if (!floorPlan) {
      floorPlan = await generate3DFloorPlan({ propertyId });
    }

    return NextResponse.json({ floorPlan });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to fetch floor plan' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { propertyId, sourceType, sourceUrl } = body;

    if (!propertyId) {
      return NextResponse.json({ error: 'propertyId is required' }, { status: 400 });
    }

    const floorPlan = await generate3DFloorPlan({
      propertyId,
      sourceType: sourceType || 'photo2d',
      sourceUrl,
    });

    return NextResponse.json({ floorPlan, message: '3D Floor Plan auto-generated successfully' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to generate 3D floor plan' }, { status: 500 });
  }
}
