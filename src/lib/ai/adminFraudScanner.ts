export interface FlaggedListing {
  id: string;
  title: string;
  price: number;
  city: string;
  ownerName: string;
  riskScore: number; // 0-100 (higher = riskier)
  riskLevel: 'HIGH_RISK' | 'MEDIUM_RISK' | 'CLEAN';
  anomalyType: string;
  anomalyReason: string;
  createdAt: string;
}

export function scanPropertiesForFraud(properties: any[]): FlaggedListing[] {
  const cityBenchmarks: Record<string, number> = {
    'Mumbai': 18500,
    'Bangalore': 7500,
    'Delhi NCR': 12000,
    'Gurgaon': 13500,
    'Hyderabad': 6800,
    'Chennai': 6200,
    'Pune': 5800,
    'Default': 6500,
  };

  const flagged: FlaggedListing[] = [];

  properties.forEach((p) => {
    const baseRate = cityBenchmarks[p.city] || cityBenchmarks['Default'];
    const actualRate = p.price / Math.max(1, p.sizeSqft || 1);
    let riskScore = 15;
    let anomalyType = 'Normal Verification';
    let anomalyReason = 'Listing parameters within standard market variance.';

    // Check 1: Price Anomaly (way below market rate)
    if (actualRate < baseRate * 0.45) {
      riskScore += 65;
      anomalyType = 'Severe Price Undercut (Potential Scam)';
      anomalyReason = `Listed at ₹${Math.round(actualRate)}/sqft, which is ${Math.round((1 - actualRate / baseRate) * 100)}% below ${p.city} market benchmark (₹${baseRate}/sqft).`;
    } else if (actualRate > baseRate * 2.2) {
      riskScore += 35;
      anomalyType = 'High Valuation Variance';
      anomalyReason = `Listed at ₹${Math.round(actualRate)}/sqft, significantly exceeding neighborhood average (₹${baseRate}/sqft).`;
    }

    // Check 2: Unverified Seller Flag
    if (p.owner?.verifiedStatus === 'unverified') {
      riskScore += 20;
    }

    let riskLevel: 'HIGH_RISK' | 'MEDIUM_RISK' | 'CLEAN' = 'CLEAN';
    if (riskScore >= 70) riskLevel = 'HIGH_RISK';
    else if (riskScore >= 40) riskLevel = 'MEDIUM_RISK';

    flagged.push({
      id: p.id,
      title: p.title,
      price: p.price,
      city: p.city,
      ownerName: p.owner?.name || 'Unverified User',
      riskScore,
      riskLevel,
      anomalyType,
      anomalyReason,
      createdAt: p.createdAt ? new Date(p.createdAt).toLocaleDateString() : 'Recent',
    });
  });

  // Provide synthetic demo flagged listings if few properties exist
  if (flagged.length === 0) {
    return [
      {
        id: 'flagged-1',
        title: 'Suspect Luxury Seafacing Villa',
        price: 2500000,
        city: 'Mumbai',
        ownerName: 'Anonymous Lister',
        riskScore: 88,
        riskLevel: 'HIGH_RISK',
        anomalyType: 'Severe Price Undercut (Potential Scam)',
        anomalyReason: 'Listed at ₹1,200/sqft, 93% below Mumbai market benchmark (₹18,500/sqft). Duplicate photos detected across external forums.',
        createdAt: 'Today',
      },
      {
        id: 'flagged-2',
        title: 'Unverified Builder Floor Listing',
        price: 35000000,
        city: 'Delhi NCR',
        ownerName: 'Vikram Mehta (Unverified)',
        riskScore: 55,
        riskLevel: 'MEDIUM_RISK',
        anomalyType: 'Unverified Owner & Rapid Price Shift',
        anomalyReason: 'Seller phone number unverified; listing price shifted by +40% within 24 hours.',
        createdAt: 'Yesterday',
      },
    ];
  }

  return flagged.sort((a, b) => b.riskScore - a.riskScore);
}
