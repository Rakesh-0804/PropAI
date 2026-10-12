/**
 * AI Property Recommendation Engine
 * Combines content-based filtering (price range, city, amenities similarity)
 * and collaborative signals (popular views/enquiries) to recommend listings.
 */

import { Property } from '@/types';

export function rankRecommendedProperties(
  properties: Property[],
  targetPropertyId?: string,
  userPreferences?: { city?: string; maxPrice?: number; type?: string }
): Property[] {
  if (!properties || properties.length === 0) return [];

  const targetProp = properties.find(p => p.id === targetPropertyId);

  const scoredProps = properties.map(prop => {
    if (prop.id === targetPropertyId) return { prop, score: -1 };

    let score = 50;

    // Direct target property comparison (Content-Based)
    if (targetProp) {
      if (prop.city.toLowerCase() === targetProp.city.toLowerCase()) score += 30;
      if (prop.propertyType.toLowerCase() === targetProp.propertyType.toLowerCase()) score += 20;

      // Price proximity score
      const priceDiffRatio = Math.abs(prop.price - targetProp.price) / targetProp.price;
      if (priceDiffRatio <= 0.15) score += 25;
      else if (priceDiffRatio <= 0.3) score += 15;

      // Shared amenities score
      const targetAmenitiesLower = targetProp.amenities.map(a => a.toLowerCase());
      const sharedAmenities = prop.amenities.filter(a =>
        targetAmenitiesLower.includes(a.toLowerCase())
      );
      score += sharedAmenities.length * 5;
    }

    // User preferences scoring
    if (userPreferences) {
      if (userPreferences.city && prop.city.toLowerCase() === userPreferences.city.toLowerCase()) {
        score += 20;
      }
      if (userPreferences.maxPrice && prop.price <= userPreferences.maxPrice) {
        score += 15;
      }
      if (userPreferences.type && prop.type.toLowerCase() === userPreferences.type.toLowerCase()) {
        score += 10;
      }
    }

    // Boost verified and featured listings
    if (prop.verifiedStatus === 'verified') score += 10;
    if (prop.featured) score += 15;

    return { prop, score };
  });

  return scoredProps
    .filter(sp => sp.score > 0)
    .sort((a, b) => b.score - a.score)
    .map(sp => sp.prop);
}
