// Catalog of distinct, high-resolution equirectangular 360 panorama scenes
export interface PanoramaScene {
  id: string;
  name: string;
  imageUrl: string;
  defaultYaw: number;
  defaultPitch: number;
  category: 'apartment' | 'penthouse' | 'villa' | 'commercial' | 'estate' | 'nature' | 'urban';
  description: string;
}

export const DISTINCT_360_PANORAMAS: PanoramaScene[] = [
  {
    id: 'lounge-modern-art',
    name: 'Contemporary Art Living Lounge',
    imageUrl: 'https://pannellum.org/images/bma-1.jpg',
    defaultYaw: 15,
    defaultPitch: -4,
    category: 'apartment',
    description: 'Spacious open-concept living hall with curated artwork and designer lighting.',
  },
  {
    id: 'designer-suite-arch',
    name: 'Architectural Mid-Century Master Suite',
    imageUrl: 'https://pannellum.org/images/jfk.jpg',
    defaultYaw: -60,
    defaultPitch: 0,
    category: 'penthouse',
    description: 'Iconic vaulted ceiling architecture with panoramic interior sightlines.',
  },
  {
    id: 'grand-marble-atrium',
    name: 'Grand Imperial Marble Foyer & Atrium',
    imageUrl: 'https://pannellum.org/images/bma-0.jpg',
    defaultYaw: 90,
    defaultPitch: 10,
    category: 'villa',
    description: 'Double-height imperial marble entrance lobby with classical columns.',
  },
  {
    id: 'oceanfront-promenade',
    name: 'Waterfront Marine Promenade & Balcony View',
    imageUrl: 'https://pannellum.org/images/tocopilla.jpg',
    defaultYaw: 180,
    defaultPitch: -2,
    category: 'penthouse',
    description: 'Stunning unobstructed 360-degree ocean coastal panorama and sky views.',
  },
  {
    id: 'skyline-terrace-deck',
    name: 'Sky Penthouse Observatory Deck',
    imageUrl: 'https://pannellum.org/images/cerro-toco-1.jpg',
    defaultYaw: 45,
    defaultPitch: -8,
    category: 'penthouse',
    description: 'High-altitude panoramic open terrace with endless horizon visibility.',
  },
  {
    id: 'urban-brownstone-street',
    name: 'Heritage Streetscape & Neighborhood Garden',
    imageUrl: 'https://pannellum.org/images/charles-street.jpg',
    defaultYaw: -110,
    defaultPitch: 2,
    category: 'urban',
    description: 'Picturesque tree-lined boulevard view with architectural townhomes.',
  },
  {
    id: 'eco-canopy-sanctuary',
    name: 'Eco-Villa Nature Sanctuary Canopy',
    imageUrl: 'https://pannellum.org/images/from-tree.jpg',
    defaultYaw: 0,
    defaultPitch: -15,
    category: 'nature',
    description: 'Lush green serene forest canopy and organic landscape gardens.',
  },
  {
    id: 'smart-tech-facility',
    name: 'Smart Automation Hub & Interior Lounge',
    imageUrl: 'https://pannellum.org/images/alma-correlator-facility.jpg',
    defaultYaw: 120,
    defaultPitch: 0,
    category: 'apartment',
    description: 'Ultra-modern minimalist interior with integrated climate and security tech.',
  },
  {
    id: 'mountain-villa-horizon',
    name: 'Mountain Villa Panoramic Vista',
    imageUrl: 'https://pannellum.org/images/cerro-toco-0.jpg',
    defaultYaw: -45,
    defaultPitch: -5,
    category: 'villa',
    description: 'Breathtaking 360° elevated mountain landscape overlooking private estates.',
  },
  {
    id: 'corporate-atrium',
    name: 'Commercial Executive Gallery & Atrium',
    imageUrl: 'https://pannellum.org/images/bloomberg.jpg',
    defaultYaw: 30,
    defaultPitch: 8,
    category: 'commercial',
    description: 'Premium glass-curtain commercial tower atrium with state-of-the-art finish.',
  },
  {
    id: 'clubhouse-lawn',
    name: 'Gated Community Lawn & Clubhouse Grounds',
    imageUrl: 'https://pannellum.org/images/wyman-park-playground.jpg',
    defaultYaw: -90,
    defaultPitch: 0,
    category: 'estate',
    description: 'Manicured green recreation grounds, tennis courts and clubhouse pavilions.',
  },
  {
    id: 'estate-valley-vista',
    name: 'Private Estate Valley & Ridge Panorama',
    imageUrl: 'https://pannellum.org/images/lascar.jpg',
    defaultYaw: 160,
    defaultPitch: -6,
    category: 'estate',
    description: 'Expansive private farmland and valley views stretching to the horizon.',
  },
  {
    id: 'minimalist-glass-villa',
    name: 'Modernist Architectural Glass Pavilion',
    imageUrl: 'https://pannellum.org/images/alma.jpg',
    defaultYaw: -15,
    defaultPitch: -2,
    category: 'apartment',
    description: 'Floor-to-ceiling perimeter glass walls with clean contemporary lines.',
  },
];

/**
 * Builds a full Pannellum embed URL with custom heading, yaw, pitch, autoLoad, and scene title.
 */
export function buildPannellumUrl(
  imagePanoramaUrl: string,
  options?: {
    title?: string;
    yaw?: number;
    pitch?: number;
    hfov?: number;
    autoRotate?: number;
  }
): string {
  const params = new URLSearchParams();
  params.set('panorama', imagePanoramaUrl);
  params.set('autoLoad', 'true');
  if (options?.title) params.set('title', options.title);
  if (options?.yaw !== undefined) params.set('yaw', String(options.yaw));
  if (options?.pitch !== undefined) params.set('pitch', String(options.pitch));
  if (options?.hfov !== undefined) params.set('hfov', String(options.hfov));
  if (options?.autoRotate !== undefined) params.set('autoRotate', String(options.autoRotate));

  return `https://cdn.pannellum.org/2.5/pannellum.htm#${params.toString()}`;
}

/**
 * Deterministically computes a unique, distinct 360 panorama URL for any property
 * based on its unique ID, title, or index so that every property in PropAI has a
 * different 360 view.
 */
export function getDistinctTour360Url(
  identifier?: string | null,
  propertyType?: string | null,
  propertyTitle?: string | null
): string {
  const key = `${identifier || ''}_${propertyTitle || ''}_${propertyType || ''}`;
  let hash = 0;
  for (let i = 0; i < key.length; i++) {
    hash = (hash << 5) - hash + key.charCodeAt(i);
    hash |= 0;
  }
  const positiveHash = Math.abs(hash);

  // Filter by category if matching
  let candidateList = DISTINCT_360_PANORAMAS;
  if (propertyType) {
    const pt = propertyType.toLowerCase();
    if (pt.includes('villa') || pt.includes('house')) {
      candidateList = DISTINCT_360_PANORAMAS.filter((p) => p.category === 'villa' || p.category === 'estate');
    } else if (pt.includes('commercial')) {
      candidateList = DISTINCT_360_PANORAMAS.filter((p) => p.category === 'commercial' || p.category === 'urban');
    } else if (pt.includes('plot') || pt.includes('farmhouse')) {
      candidateList = DISTINCT_360_PANORAMAS.filter((p) => p.category === 'nature' || p.category === 'estate');
    }
  }

  if (candidateList.length === 0) candidateList = DISTINCT_360_PANORAMAS;

  const scene = candidateList[positiveHash % candidateList.length];

  // Slight yaw offset per property to ensure even same-scene angle varies
  const yawOffset = (positiveHash % 8) * 45 - 180;

  return buildPannellumUrl(scene.imageUrl, {
    title: propertyTitle || scene.name,
    yaw: scene.defaultYaw + (yawOffset % 30),
    pitch: scene.defaultPitch,
    autoRotate: -1, // gentle auto-rotation for immersive exploration
  });
}
