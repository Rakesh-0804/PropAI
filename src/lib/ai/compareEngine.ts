import { Property, formatINR } from '@/types';

export interface ComprehensiveCompareMetrics {
  id: string;
  title: string;
  price: number;
  formattedPrice: string;
  pricePerSqft: number;
  formattedPricePerSqft: string;
  city: string;
  state: string;
  address: string;
  propertyType: string;
  type: 'sale' | 'rent';
  sizeSqft: number;
  bedrooms: number;
  bathrooms: number;
  verifiedStatus: string;
  primaryImage: string;
  hasTour360: boolean;
  tour360Url?: string;

  // Financial & Investment Metrics
  estimatedCapRate: number; // e.g. 4.2%
  estimated10YrReturn: number; // e.g. 115%
  projected10YrValue: number;
  formatted10YrValue: string;
  estimatedMonthlyEMI: number;
  formattedMonthlyEMI: string;
  estimatedStampDuty: number;
  formattedStampDuty: string;
  estimatedMaintenanceMonthly: number;
  formattedMaintenanceMonthly: string;

  // Neighborhood & Livability Scores
  walkScore: number; // 0-100
  safetyScore: number; // 0-100
  transitScore: number; // 0-100
  schoolRating: number; // 0-10
  aqiRating: string; // e.g. 'Good (45)', 'Moderate (115)'

  // AI Ratings & Badges
  matchScore: number; // 0-100
  aiOverallScore: number; // 0-100
  badges: string[];
}

export function computeComprehensiveCompareMetrics(property: Property): ComprehensiveCompareMetrics {
  const price = property.price || 10000000;
  const sizeSqft = Math.max(1, property.sizeSqft || 1000);
  const pricePerSqft = Math.round(price / sizeSqft);

  // 1. Financial & Investment Calculations
  // Standard Indian home loan: 80% loan amount @ 8.5% interest rate over 240 months (20 yrs)
  const loanPrincipal = price * 0.80;
  const monthlyRate = (8.5 / 100) / 12;
  const totalMonths = 240;
  const estimatedMonthlyEMI = Math.round(
    (loanPrincipal * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) /
      (Math.pow(1 + monthlyRate, totalMonths) - 1)
  );

  // Cap rate & 10-Yr ROI estimates based on city tier
  const isTier1 = ['Mumbai', 'Bangalore', 'Delhi NCR', 'Hyderabad', 'Pune'].some(c => property.city.includes(c));
  const baseCapRate = isTier1 ? 4.1 : 5.2;
  const estimatedCapRate = Number((baseCapRate + (property.propertyType === 'commercial' ? 2.5 : 0)).toFixed(1));
  const estimated10YrReturn = Number((estimatedCapRate * 2.4 + (property.featured ? 15 : 0)).toFixed(1));
  const projected10YrValue = Math.round(price * (1 + estimated10YrReturn / 100));

  // Stamp Duty (approx 6% in major Indian states)
  const estimatedStampDuty = Math.round(price * 0.06);

  // Monthly Maintenance (approx ₹3.50 per sqft)
  const estimatedMaintenanceMonthly = Math.round(sizeSqft * 3.5);

  // 2. Neighborhood & Livability Index Scores
  let walkScore = 82;
  let safetyScore = 88;
  let transitScore = 85;
  let schoolRating = 8.8;
  let aqiRating = 'Good (55 AQI)';

  if (property.city.includes('Mumbai')) {
    walkScore = 94;
    safetyScore = 91;
    transitScore = 96;
    schoolRating = 9.2;
    aqiRating = 'Moderate (115 AQI)';
  } else if (property.city.includes('Bangalore')) {
    walkScore = 88;
    safetyScore = 89;
    transitScore = 86;
    schoolRating = 9.4;
    aqiRating = 'Good (68 AQI)';
  } else if (property.city.includes('Delhi') || property.city.includes('Gurgaon')) {
    walkScore = 85;
    safetyScore = 84;
    transitScore = 92;
    schoolRating = 9.1;
    aqiRating = 'Moderate (135 AQI)';
  } else if (property.city.includes('Goa')) {
    walkScore = 76;
    safetyScore = 95;
    transitScore = 72;
    schoolRating = 8.5;
    aqiRating = 'Excellent (38 AQI)';
  } else if (property.city.includes('Hyderabad')) {
    walkScore = 86;
    safetyScore = 92;
    transitScore = 89;
    schoolRating = 9.3;
    aqiRating = 'Good (58 AQI)';
  }

  // 3. AI Overall Rating & Badges
  const matchScore = property.matchScore || Math.floor(86 + (pricePerSqft % 12));
  const aiOverallScore = Math.min(99, Math.max(70, Math.round((walkScore + safetyScore + matchScore) / 3)));

  const mediaList = property.media || [];
  const tourMedia = mediaList.find(m => m.type === 'tour360');
  const primaryImage = mediaList.find(m => m.type === 'image')?.mediaUrl ||
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80';

  const badges: string[] = [];
  if (property.verifiedStatus === 'verified') badges.push('🛡️ Verified');
  if (tourMedia) badges.push('🌐 360° Tour');
  if (property.featured) badges.push('⭐ Featured');

  return {
    id: property.id,
    title: property.title,
    price,
    formattedPrice: formatINR(price),
    pricePerSqft,
    formattedPricePerSqft: `${formatINR(pricePerSqft)}/sqft`,
    city: property.city,
    state: property.state,
    address: property.address,
    propertyType: property.propertyType,
    type: property.type,
    sizeSqft,
    bedrooms: property.bedrooms,
    bathrooms: property.bathrooms,
    verifiedStatus: property.verifiedStatus,
    primaryImage,
    hasTour360: !!tourMedia,
    tour360Url: tourMedia?.mediaUrl,

    estimatedCapRate,
    estimated10YrReturn,
    projected10YrValue,
    formatted10YrValue: formatINR(projected10YrValue),
    estimatedMonthlyEMI,
    formattedMonthlyEMI: `${formatINR(estimatedMonthlyEMI)}/mo`,
    estimatedStampDuty,
    formattedStampDuty: formatINR(estimatedStampDuty),
    estimatedMaintenanceMonthly,
    formattedMaintenanceMonthly: `${formatINR(estimatedMaintenanceMonthly)}/mo`,

    walkScore,
    safetyScore,
    transitScore,
    schoolRating,
    aqiRating,

    matchScore,
    aiOverallScore,
    badges,
  };
}

export function computeComparisonWinners(properties: Property[]) {
  if (!properties || properties.length === 0) return null;

  const metrics = properties.map(computeComprehensiveCompareMetrics);

  const bestPricePerSqft = [...metrics].sort((a, b) => a.pricePerSqft - b.pricePerSqft)[0];
  const highestRoi = [...metrics].sort((a, b) => b.estimated10YrReturn - a.estimated10YrReturn)[0];
  const topLivability = [...metrics].sort((a, b) => (b.walkScore + b.safetyScore) - (a.walkScore + a.safetyScore))[0];
  const largestSpace = [...metrics].sort((a, b) => b.sizeSqft - a.sizeSqft)[0];

  // Overall winner recommendation
  const overallWinner = [...metrics].sort((a, b) => b.aiOverallScore - a.aiOverallScore)[0];

  return {
    metrics,
    overallWinner,
    bestPricePerSqft,
    highestRoi,
    topLivability,
    largestSpace,
  };
}
