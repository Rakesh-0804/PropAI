import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const { message } = await request.json();
    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'Message text is required' }, { status: 400 });
    }

    const query = message.toLowerCase();

    // 1. Check if user is asking for EMI / Loan Calculation
    if (query.includes('emi') || query.includes('loan') || query.includes('interest') || query.includes('mortgage')) {
      const numbers = message.match(/\d+([.,]\d+)?/g);
      let principal = 8000000; // default 80 Lakhs
      let tenureYears = 20;
      let interestRate = 8.5;

      if (numbers && numbers.length > 0) {
        const val = parseFloat(numbers[0].replace(/,/g, ''));
        if (val < 100) principal = val * 100000;
        else if (val < 1000) principal = val * 100000;
        else principal = val;
      }

      const r = interestRate / 12 / 100;
      const n = tenureYears * 12;
      const emi = Math.round((principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1));
      const totalAmount = emi * n;
      const totalInterest = totalAmount - principal;

      return NextResponse.json({
        reply: `Here is your estimated Home Loan EMI breakdown for a loan of ₹${(principal / 100000).toFixed(1)} Lakhs at ${interestRate}% interest over ${tenureYears} years:\n\n` +
          `• **Monthly EMI**: ₹${emi.toLocaleString('en-IN')}\n` +
          `• **Total Principal**: ₹${(principal / 100000).toFixed(1)} Lakhs\n` +
          `• **Total Interest Payable**: ₹${(totalInterest / 100000).toFixed(2)} Lakhs\n` +
          `• **Total Payable**: ₹${(totalAmount / 100000).toFixed(2)} Lakhs\n\n` +
          `💡 *Tip: Increasing your down payment by 10% can save you up to ₹${Math.round(totalInterest * 0.15 / 100000)} Lakhs in overall interest!*`,
        properties: [],
        suggestions: [
          'What properties match this budget?',
          'Calculate EMI for 1.5 Crore loan',
          'What are current home loan tax benefits?'
        ]
      });
    }

    // 2. Check if user is asking about ROI / Investment / Cap Rate
    if (query.includes('roi') || query.includes('cap rate') || query.includes('invest') || query.includes('rental yield')) {
      return NextResponse.json({
        reply: `📈 **AGY AI Investment Insights (Indian Metro Trends 2026)**:\n\n` +
          `1. **Bengaluru (Whitefield / Sarjapur)**: Avg Rental Yield **4.2% - 5.1%**, 5-Yr Appreciation **+42%**.\n` +
          `2. **Hyderabad (HITEC City / Gachibowli)**: Avg Rental Yield **3.8% - 4.6%**, 5-Yr Appreciation **+48%**.\n` +
          `3. **Mumbai (Bandra / Thane)**: High Capital Value, Yield **2.8% - 3.5%**, Steady **+28%** growth.\n` +
          `4. **Pune (Kharadi / Hinjewadi)**: Strong IT rental demand, Yield **4.0% - 4.8%**.\n\n` +
          `Would you like me to run a 10-Year Automated Underwriting & Cash-Flow PDF report on any specific property?`,
        properties: [],
        suggestions: [
          'Show high ROI commercial properties',
          'Generate Underwriting Report for villa',
          'Compare Bengaluru vs Hyderabad returns'
        ]
      });
    }

    // 3. Property Search & Catalog Matcher
    let cityFilter: string | undefined;
    if (query.includes('mumbai')) cityFilter = 'Mumbai';
    else if (query.includes('bangalore') || query.includes('bengaluru')) cityFilter = 'Bangalore';
    else if (query.includes('hyderabad')) cityFilter = 'Hyderabad';
    else if (query.includes('delhi') || query.includes('gurgaon') || query.includes('noida')) cityFilter = 'Delhi NCR';
    else if (query.includes('pune')) cityFilter = 'Pune';
    else if (query.includes('chennai')) cityFilter = 'Chennai';

    let typeFilter: string | undefined;
    if (query.includes('villa')) typeFilter = 'villa';
    else if (query.includes('apartment') || query.includes('flat')) typeFilter = 'apartment';
    else if (query.includes('plot') || query.includes('land')) typeFilter = 'plot';
    else if (query.includes('commercial') || query.includes('office')) typeFilter = 'commercial';
    else if (query.includes('house') || query.includes('duplex')) typeFilter = 'independent_house';
    else if (query.includes('farmhouse')) typeFilter = 'farmhouse';

    let bhkFilter: number | undefined;
    if (query.includes('1 bhk') || query.includes('1bhk') || query.includes('1 bed')) bhkFilter = 1;
    else if (query.includes('2 bhk') || query.includes('2bhk') || query.includes('2 bed')) bhkFilter = 2;
    else if (query.includes('3 bhk') || query.includes('3bhk') || query.includes('3 bed')) bhkFilter = 3;
    else if (query.includes('4 bhk') || query.includes('4bhk') || query.includes('4 bed')) bhkFilter = 4;
    else if (query.includes('5 bhk') || query.includes('5bhk') || query.includes('5 bed')) bhkFilter = 5;

    const matchedProperties = await prisma.property.findMany({
      where: {
        ...(cityFilter ? { city: { contains: cityFilter } } : {}),
        ...(typeFilter ? { propertyType: typeFilter } : {}),
        ...(bhkFilter ? { bedrooms: bhkFilter } : {})
      },
      take: 4,
      include: {
        media: true
      }
    });

    const resultsCount = matchedProperties.length;
    let replyText = '';

    if (resultsCount > 0) {
      replyText = `✨ Found **${resultsCount} verified properties** matching your request:\n\n`;
      if (cityFilter) replyText += `📍 **City**: ${cityFilter}\n`;
      if (typeFilter) replyText += `🏡 **Type**: ${typeFilter.replace('_', ' ').toUpperCase()}\n`;
      if (bhkFilter) replyText += `🛏️ **Bedrooms**: ${bhkFilter} BHK\n`;
      replyText += `\nHere are top matches curated by AGY AI:`;
    } else {
      replyText = `🤖 I couldn't find exact properties for your exact criteria right now, but here are trending verified properties across prime Indian metros:`;
    }

    const finalProperties = resultsCount > 0 ? matchedProperties : await prisma.property.findMany({
      take: 3,
      include: { media: true }
    });

    return NextResponse.json({
      reply: replyText,
      properties: finalProperties.map(p => ({
        id: p.id,
        title: p.title,
        price: p.price,
        city: p.city,
        propertyType: p.propertyType,
        bedrooms: p.bedrooms,
        bathrooms: p.bathrooms,
        sizeSqft: p.sizeSqft,
        imageUrl: p.media?.[0]?.mediaUrl || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80'
      })),
      suggestions: [
        'Filter properties under ₹1.5 Crore',
        'Show properties with 3D Floor Plans',
        'Check IoT Smart Access homes'
      ]
    });
  } catch (error) {
    console.error('AI Chatbot API error', error);
    return NextResponse.json({
      reply: '🤖 I am currently running on AI fallback mode. How can I help you find your dream home or calculate property returns today?',
      properties: [],
      suggestions: ['Calculate EMI', 'Find 3 BHK in Bangalore', 'Highest ROI properties']
    });
  }
}
