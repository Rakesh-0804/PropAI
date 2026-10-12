export interface NeighborhoodVibe {
  city: string;
  walkScore: number;
  safetyIndex: number;
  transitScore: number;
  schoolRating: number; // 1-10 scale
  diningVibeScore: number;
  overallLivability: number;
  highlights: string[];
}

function calculateLivability(walk: number, safety: number, transit: number, school: number, dining: number): number {
  const weighted = (walk * 0.25) + (safety * 0.30) + (transit * 0.20) + ((school * 10) * 0.15) + (dining * 0.10);
  return Math.round(Math.min(99, Math.max(50, weighted)));
}

export function getNeighborhoodVibe(city: string): NeighborhoodVibe {
  const cityMap: Record<string, Omit<NeighborhoodVibe, 'overallLivability'>> = {
    'Bangalore': {
      city: 'Bangalore',
      walkScore: 88,
      safetyIndex: 91,
      transitScore: 84,
      schoolRating: 9.4,
      diningVibeScore: 95,
      highlights: ['Silicon Valley of India', 'Indiranagar & Koramangala Hub', 'Namma Metro Connectivity'],
    },
    'Mumbai': {
      city: 'Mumbai',
      walkScore: 95,
      safetyIndex: 88,
      transitScore: 94,
      schoolRating: 9.2,
      diningVibeScore: 98,
      highlights: ['Financial Capital & Coastal Promenade', 'High Capital Liquidity', 'Western & Harbour Railway Hub'],
    },
    'Delhi NCR': {
      city: 'Delhi NCR',
      walkScore: 86,
      safetyIndex: 82,
      transitScore: 92,
      schoolRating: 9.3,
      diningVibeScore: 94,
      highlights: ['World-Class Delhi Metro Network', 'Lutyens & Diplomatic Enclave', 'Expressway Connectivity'],
    },
    'Gurgaon': {
      city: 'Gurgaon',
      walkScore: 84,
      safetyIndex: 89,
      transitScore: 85,
      schoolRating: 9.5,
      diningVibeScore: 96,
      highlights: ['Golf Course Road Luxury Belt', 'Cyber City Corporate Hub', 'Gated Villa Estates'],
    },
    'Noida': {
      city: 'Noida',
      walkScore: 82,
      safetyIndex: 86,
      transitScore: 88,
      schoolRating: 9.0,
      diningVibeScore: 89,
      highlights: ['Planned Infrastructure & Green Parks', 'Jewar International Airport Hub', 'Wide Gridded Avenues'],
    },
    'Hyderabad': {
      city: 'Hyderabad',
      walkScore: 83,
      safetyIndex: 94,
      transitScore: 82,
      schoolRating: 9.2,
      diningVibeScore: 93,
      highlights: ['HITEC City & Gachibowli Tech Zone', 'Outer Ring Road (ORR) Speed Corridor', 'Top Medical Hub'],
    },
    'Pune': {
      city: 'Pune',
      walkScore: 87,
      safetyIndex: 92,
      transitScore: 80,
      schoolRating: 9.1,
      diningVibeScore: 91,
      highlights: ['Oxford of the East Education', 'Hinjewadi & Kharadi IT Parks', 'Pleasant Hill Climate'],
    },
    'Chennai': {
      city: 'Chennai',
      walkScore: 85,
      safetyIndex: 90,
      transitScore: 83,
      schoolRating: 9.0,
      diningVibeScore: 88,
      highlights: ['Automobile & SaaS Capital', 'OMR IT Corridor', 'Marina Coastal Belt'],
    },
    'Kolkata': {
      city: 'Kolkata',
      walkScore: 89,
      safetyIndex: 87,
      transitScore: 88,
      schoolRating: 8.8,
      diningVibeScore: 92,
      highlights: ['Cultural Heritage & Metro Pioneer', 'Salt Lake & New Town IT Hub', 'Low Cost of Living'],
    },
    'New York': {
      city: 'New York',
      walkScore: 98,
      safetyIndex: 82,
      transitScore: 96,
      schoolRating: 9.1,
      diningVibeScore: 99,
      highlights: ['Walker′s Paradise', 'World-Class Michelin Dining', 'Subway & Transit Hub'],
    },
    'San Francisco': {
      city: 'San Francisco',
      walkScore: 94,
      safetyIndex: 78,
      transitScore: 88,
      schoolRating: 8.8,
      diningVibeScore: 95,
      highlights: ['Tech Corridor', 'Boutique Shopping & Bay Views', 'High Bikeability'],
    },
    'Miami': {
      city: 'Miami',
      walkScore: 85,
      safetyIndex: 84,
      transitScore: 72,
      schoolRating: 8.4,
      diningVibeScore: 97,
      highlights: ['Waterfront & Beach Access', 'Vibrant Nightlife', 'Zero State Income Tax Zone'],
    },
    'Austin': {
      city: 'Austin',
      walkScore: 82,
      safetyIndex: 91,
      transitScore: 68,
      schoolRating: 9.4,
      diningVibeScore: 92,
      highlights: ['Top-Rated School Districts', 'Tech Hub & Live Music Capital', 'High Safety Index'],
    },
    'Dubai': {
      city: 'Dubai',
      walkScore: 80,
      safetyIndex: 98,
      transitScore: 86,
      schoolRating: 9.2,
      diningVibeScore: 97,
      highlights: ['Zero Tax Luxury Paradise', 'World-Class Ultra Safety', 'Palm & Marina Waterfront'],
    },
  };

  const raw = cityMap[city] || {
    city,
    walkScore: 84,
    safetyIndex: 86,
    transitScore: 78,
    schoolRating: 8.7,
    diningVibeScore: 88,
    highlights: ['Family-Friendly Community', 'Accessible Transit & Parks', 'High Growth Corridor'],
  };

  return {
    ...raw,
    overallLivability: calculateLivability(raw.walkScore, raw.safetyIndex, raw.transitScore, raw.schoolRating, raw.diningVibeScore),
  };
}
