import { NextResponse } from 'next/server';
import { calculatePriceEstimate } from '@/lib/ai/priceEstimator';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const estimate = calculatePriceEstimate({
      sizeSqft: Number(body.sizeSqft),
      bedrooms: Number(body.bedrooms),
      bathrooms: Number(body.bathrooms),
      amenities: body.amenities || [],
      city: body.city || 'Default',
      propertyType: body.propertyType || 'apartment',
    });

    return NextResponse.json({ estimate });
  } catch (error) {
    return NextResponse.json({ error: 'Valuation calculation failed' }, { status: 500 });
  }
}
