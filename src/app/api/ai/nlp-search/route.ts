import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const { prompt } = await request.json();
    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json({ error: 'Search prompt is required' }, { status: 400 });
    }

    const text = prompt.toLowerCase();

    // Natural Language Entity Extraction
    let city: string | undefined;
    if (text.includes('mumbai')) city = 'Mumbai';
    else if (text.includes('bangalore') || text.includes('bengaluru')) city = 'Bangalore';
    else if (text.includes('hyderabad')) city = 'Hyderabad';
    else if (text.includes('delhi') || text.includes('gurgaon') || text.includes('noida')) city = 'Delhi NCR';
    else if (text.includes('pune')) city = 'Pune';
    else if (text.includes('chennai')) city = 'Chennai';

    let propertyType: string | undefined;
    if (text.includes('villa')) propertyType = 'villa';
    else if (text.includes('apartment') || text.includes('flat')) propertyType = 'apartment';
    else if (text.includes('plot') || text.includes('site') || text.includes('land')) propertyType = 'plot';
    else if (text.includes('commercial') || text.includes('office')) propertyType = 'commercial';
    else if (text.includes('house') || text.includes('duplex')) propertyType = 'independent_house';
    else if (text.includes('builder floor')) propertyType = 'builder_floor';
    else if (text.includes('farmhouse')) propertyType = 'farmhouse';
    else if (text.includes('condo')) propertyType = 'condo';

    let bedrooms: number | undefined;
    if (text.includes('1 bhk') || text.includes('1bhk') || text.includes('1 bed')) bedrooms = 1;
    else if (text.includes('2 bhk') || text.includes('2bhk') || text.includes('2 bed')) bedrooms = 2;
    else if (text.includes('3 bhk') || text.includes('3bhk') || text.includes('3 bed')) bedrooms = 3;
    else if (text.includes('4 bhk') || text.includes('4bhk') || text.includes('4 bed')) bedrooms = 4;
    else if (text.includes('5 bhk') || text.includes('5bhk') || text.includes('5 bed')) bedrooms = 5;

    let maxPrice: number | undefined;
    let minPrice: number | undefined;

    // Price extraction in Lakhs / Crores
    const croreMatch = text.match(/under\s*(\d+(\.\d+)?)\s*(cr|crore|crores)/i) || text.match(/(\d+(\.\d+)?)\s*(cr|crore|crores)/i);
    if (croreMatch) {
      maxPrice = parseFloat(croreMatch[1]) * 10000000;
    }

    const lakhMatch = text.match(/under\s*(\d+(\.\d+)?)\s*(lakh|lakhs|l)/i) || text.match(/(\d+(\.\d+)?)\s*(lakh|lakhs|l)/i);
    if (lakhMatch && !maxPrice) {
      maxPrice = parseFloat(lakhMatch[1]) * 100000;
    }

    // Query Database with extracted filters
    const whereClause: any = {};
    if (city) whereClause.city = { contains: city };
    if (propertyType) whereClause.propertyType = propertyType;
    if (bedrooms) whereClause.bedrooms = bedrooms;
    if (maxPrice) whereClause.price = { lte: maxPrice };

    const properties = await prisma.property.findMany({
      where: whereClause,
      include: { media: true },
      take: 12
    });

    return NextResponse.json({
      parsedCriteria: {
        city: city || 'All Cities',
        propertyType: propertyType ? propertyType.replace('_', ' ') : 'All Types',
        bedrooms: bedrooms ? `${bedrooms} BHK` : 'Any BHK',
        maxPriceFormatted: maxPrice ? (maxPrice >= 10000000 ? `₹${(maxPrice / 10000000).toFixed(1)} Cr` : `₹${(maxPrice / 100000).toFixed(0)} Lakhs`) : 'Any Budget'
      },
      count: properties.length,
      properties
    });
  } catch (error) {
    console.error('NLP Search API error', error);
    return NextResponse.json({ error: 'AI NLP Search failed' }, { status: 500 });
  }
}
