import { NextRequest, NextResponse } from 'next/server';
import { generateUnderwritingReport, getUnderwritingReportForProperty } from '@/lib/ai/underwritingService';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const propertyId = searchParams.get('propertyId');

    if (!propertyId) {
      return NextResponse.json({ error: 'propertyId parameter is required' }, { status: 400 });
    }

    let report = await getUnderwritingReportForProperty(propertyId);

    if (!report) {
      report = await generateUnderwritingReport({ propertyId });
    }

    return NextResponse.json({ report });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to fetch underwriting report' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { propertyId, userId, purchasePrice, expectedRent, downPaymentPercent, interestRate, vacancyRate } = body;

    if (!propertyId) {
      return NextResponse.json({ error: 'propertyId is required' }, { status: 400 });
    }

    const report = await generateUnderwritingReport({
      propertyId,
      userId,
      purchasePrice: purchasePrice ? Number(purchasePrice) : undefined,
      expectedRent: expectedRent ? Number(expectedRent) : undefined,
      downPaymentPercent: downPaymentPercent ? Number(downPaymentPercent) : undefined,
      interestRate: interestRate ? Number(interestRate) : undefined,
      vacancyRate: vacancyRate ? Number(vacancyRate) : undefined,
    });

    return NextResponse.json({ report, message: 'Financial underwriting report generated successfully' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to generate underwriting report' }, { status: 500 });
  }
}
