import { NextResponse } from 'next/server';
import { generateListingCopy } from '@/lib/ai/aiCopywriter';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, city, propertyType, price, bedrooms, bathrooms, sizeSqft, amenities, tone } = body;

    const copy = generateListingCopy({
      title: title || 'Luxury Property',
      city: city || 'Mumbai',
      propertyType: propertyType || 'apartment',
      price: Number(price) || 15000000,
      bedrooms: Number(bedrooms) || 3,
      bathrooms: Number(bathrooms) || 3,
      sizeSqft: Number(sizeSqft) || 1800,
      amenities: Array.isArray(amenities) ? amenities : ['Swimming Pool', 'Gym', '24/7 Security'],
      tone: tone || 'luxury'
    });

    const formattedPrice = price >= 10000000 
      ? `₹${(price / 10000000).toFixed(2)} Cr`
      : `₹${(price / 100000).toFixed(2)} Lakhs`;

    const generatedTitle = `✨ ${tone === 'luxury' ? 'Ultra-Luxury' : tone === 'investor' ? 'High-Yield Investment' : 'Stunning'} ${bedrooms || 3} BHK ${propertyType ? propertyType.replace('_', ' ') : 'Property'} in ${city || 'Prime Location'}`;

    const highlights = [
      `Spacious ${sizeSqft || 1800} sq.ft. layout with premium modern finishes`,
      `Located in prime ${city || 'Metro'} neighborhood with top connectivity`,
      `Includes ${Array.isArray(amenities) && amenities.length > 0 ? amenities.slice(0, 3).join(', ') : '24/7 Power Backup, Security & Clubhouse'}`,
      `Offered at competitive market pricing of ${formattedPrice}`
    ];

    return NextResponse.json({
      title: generatedTitle,
      description: copy,
      highlights
    });
  } catch (error) {
    console.error('AI Copywrite API error', error);
    return NextResponse.json({ error: 'Failed to generate AI copy' }, { status: 500 });
  }
}
