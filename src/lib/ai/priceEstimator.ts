/**
 * Smart Price Estimation Engine
 * Calculates estimated valuation, confidence score, and price factors
 * based on property size, location index, bedrooms, bathrooms, and amenities.
 */

interface PropertyEstimateInput {
  sizeSqft: number;
  bedrooms: number;
  bathrooms: number;
  amenities: string[];
  city: string;
  propertyType: string;
  actualPrice?: number;
}

// Baseline cost per sqft per city in INR (₹)
const CITY_BASE_RATES: Record<string, number> = {
  'Mumbai': 22500,
  'Bangalore': 8500,
  'Delhi NCR': 13500,
  'Gurgaon': 14800,
  'Noida': 8800,
  'Hyderabad': 7600,
  'Chennai': 6900,
  'Pune': 6400,
  'Kolkata': 5200,
  'New York': 85000,
  'London': 92000,
  'Dubai': 45000,
  'Singapore': 110000,
  'Default': 7500
};

// Multipliers by property type
const TYPE_MULTIPLIERS: Record<string, number> = {
  'villa': 1.45,
  'independent_house': 1.30,
  'farmhouse': 1.50,
  'plot': 1.10,
  'builder_floor': 1.15,
  'house': 1.20,
  'apartment': 1.0,
  'condo': 1.05,
  'commercial': 1.40
};

export function calculatePriceEstimate(input: PropertyEstimateInput) {
  const safeSqft = Math.max(100, Number(input.sizeSqft) || 1000);
  const safeBedrooms = Math.max(0, Number(input.bedrooms) || 2);
  const safeBathrooms = Math.max(0, Number(input.bathrooms) || 2);
  const safeAmenities = Array.isArray(input.amenities) ? input.amenities : [];

  const baseRate = CITY_BASE_RATES[input.city] || CITY_BASE_RATES['Default'];
  const typeMultiplier = TYPE_MULTIPLIERS[input.propertyType?.toLowerCase()] || 1.0;

  // Base valuation from size & location
  const baseValue = safeSqft * baseRate * typeMultiplier;

  // Bedroom & Bathroom adjustments in INR
  const bedroomVal = safeBedrooms * 450000;
  const bathroomVal = safeBathrooms * 280000;

  // Amenities bonus in INR
  const amenityVal = safeAmenities.length * 175000;

  // Estimated Fair Market Value
  const estimatedValue = Math.round(baseValue + bedroomVal + bathroomVal + amenityVal);

  // Bounded Range +- 7.5%
  const estimatedMin = Math.round(estimatedValue * 0.925);
  const estimatedMax = Math.round(estimatedValue * 1.075);

  // Calculate confidence score
  let confidenceScore = 0.88;
  if (CITY_BASE_RATES[input.city]) confidenceScore += 0.05;
  if (safeSqft >= 400 && safeSqft <= 8000) confidenceScore += 0.04;
  if (safeAmenities.length >= 3) confidenceScore += 0.02;

  confidenceScore = Math.min(0.99, Math.max(0.70, confidenceScore));

  return {
    estimatedValue,
    estimatedMin,
    estimatedMax,
    confidenceScore: Math.round(confidenceScore * 100),
    factors: {
      baseRatePerSqft: baseRate,
      typeMultiplier,
      bedroomBonus: bedroomVal,
      bathroomBonus: bathroomVal,
      amenitiesBonus: amenityVal,
      locationMultiplier: typeMultiplier
    }
  };
}
