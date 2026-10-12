/**
 * AI Property Match Score Algorithm
 * Computes a percentage match (0-100%) between a buyer preference vector
 * and a property feature vector.
 */

export interface BuyerPreference {
  maxPrice?: number;
  minBedrooms?: number;
  minBathrooms?: number;
  preferredCity?: string;
  preferredType?: string;
  desiredAmenities?: string[];
  preferredMinSize?: number;
}

export interface PropertyFeatureVector {
  price: number;
  bedrooms: number;
  bathrooms: number;
  city: string;
  type: string;
  amenities: string[];
  sizeSqft: number;
}

export function computePropertyMatchScore(
  pref: BuyerPreference,
  prop: PropertyFeatureVector
): number {
  let score = 0;
  let totalWeight = 0;

  // 1. Price match (Weight: 30)
  if (pref.maxPrice) {
    totalWeight += 30;
    if (prop.price <= pref.maxPrice) {
      score += 30;
    } else {
      const overRatio = (prop.price - pref.maxPrice) / pref.maxPrice;
      if (overRatio <= 0.15) score += 20;
      else if (overRatio <= 0.30) score += 10;
    }
  }

  // 2. City match (Weight: 25)
  if (pref.preferredCity) {
    totalWeight += 25;
    if (prop.city.toLowerCase() === pref.preferredCity.toLowerCase()) {
      score += 25;
    }
  }

  // 3. Bedrooms match (Weight: 15)
  if (pref.minBedrooms) {
    totalWeight += 15;
    if (prop.bedrooms >= pref.minBedrooms) {
      score += 15;
    } else if (prop.bedrooms === pref.minBedrooms - 1) {
      score += 8;
    }
  }

  // 4. Property Type match (Weight: 15)
  if (pref.preferredType) {
    totalWeight += 15;
    if (prop.type.toLowerCase() === pref.preferredType.toLowerCase()) {
      score += 15;
    }
  }

  // 5. Amenities match (Weight: 15)
  if (pref.desiredAmenities && pref.desiredAmenities.length > 0) {
    totalWeight += 15;
    const propAmenitiesLower = prop.amenities.map(a => a.toLowerCase());
    const matches = pref.desiredAmenities.filter(da =>
      propAmenitiesLower.includes(da.toLowerCase())
    );
    const amenityRatio = matches.length / pref.desiredAmenities.length;
    score += Math.round(amenityRatio * 15);
  }

  // Default fallback weight if no preference specified
  if (totalWeight === 0) return 92; // High default match score for browse mode

  const finalMatchPercentage = Math.round((score / totalWeight) * 100);
  return Math.min(100, Math.max(45, finalMatchPercentage));
}
