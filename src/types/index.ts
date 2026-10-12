export type UserRole = 'buyer' | 'seller' | 'agent' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  verifiedStatus: string;
  avatar?: string;
}

export interface PropertyMedia {
  id: string;
  propertyId: string;
  mediaUrl: string;
  type: 'image' | 'video' | 'tour360';
  caption?: string | null;
}

export interface Property {
  id: string;
  ownerId: string;
  title: string;
  description: string;
  type: 'sale' | 'rent';
  propertyType: 'apartment' | 'house' | 'villa' | 'condo' | 'commercial' | 'plot' | 'independent_house' | 'builder_floor' | 'farmhouse';
  price: number;
  address: string;
  city: string;
  state: string;
  zip: string;
  latitude: number;
  longitude: number;
  sizeSqft: number;
  bedrooms: number;
  bathrooms: number;
  amenities: string[]; // parsed from JSON
  status: 'available' | 'pending' | 'sold' | 'rented';
  verifiedStatus: 'pending' | 'verified' | 'rejected';
  featured: boolean;
  createdAt: string;
  updatedAt: string;
  owner?: User;
  media?: PropertyMedia[];
  priceEstimate?: PriceEstimateInfo;
  matchScore?: number;
}

export interface Enquiry {
  id: string;
  propertyId: string;
  buyerId: string;
  sellerId: string;
  message: string;
  status: 'pending' | 'responded' | 'closed';
  createdAt: string;
  property?: Property;
  buyer?: User;
  seller?: User;
}

export interface SiteVisit {
  id: string;
  propertyId: string;
  buyerId: string;
  requestedDate: string;
  requestedTime: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  notes?: string;
  pinCode?: string | null;
  smartLockId?: string | null;
  lockProvider?: string | null;
  accessValidFrom?: string | null;
  accessValidTo?: string | null;
  checkInAt?: string | null;
  checkOutAt?: string | null;
  doorStatus?: 'locked' | 'unlocked';
  lockAlertTriggered?: boolean;
  lockAlertNotes?: string | null;
  createdAt: string;
  property?: Property;
  buyer?: User;
  accessLogs?: SmartLockAccessLog[];
}

export interface SmartLockAccessLog {
  id: string;
  siteVisitId: string;
  eventType: 'pin_created' | 'check_in' | 'check_out' | 'door_unlocked' | 'door_locked' | 'alert_triggered';
  message: string;
  actor: 'buyer' | 'lock_gateway' | 'system';
  createdAt: string;
}

export interface FloorPlanRoom {
  id: string;
  name: string;
  type: string; // living, master_bedroom, bedroom, kitchen, bathroom, balcony
  areaSqft: number;
  widthFt: number;
  lengthFt: number;
  heightFt: number;
  color: string;
  x: number; // grid position
  y: number;
  w: number;
  h: number;
  doors: Array<{ wall: 'north' | 'south' | 'east' | 'west'; offset: number }>;
  windows: Array<{ wall: 'north' | 'south' | 'east' | 'west'; offset: number }>;
}

export interface FloorPlan3DData {
  id: string;
  propertyId: string;
  status: 'processing' | 'completed' | 'failed';
  sourceType: 'photo2d' | 'tour360';
  sourceUrl?: string | null;
  rooms: FloorPlanRoom[];
  meshData: {
    wallHeight: number;
    wallThickness: number;
    depthHeatmapUrl?: string;
    totalFloors: number;
    pointCloudDensity: number;
  };
  createdAt: string;
}

export interface CashFlowYear {
  year: number;
  grossRent: number;
  vacancyLoss: number;
  effectiveGrossIncome: number;
  operatingExpenses: number;
  noi: number;
  debtService: number;
  netCashFlow: number;
  propertyValue: number;
  equity: number;
}

export interface MacroTrends {
  mortgageRateTrend: number;
  inflationRate: number;
  areaGrowthRate: number;
  rentalYieldIndex: number;
  marketSentiment: 'Bullish' | 'Neutral' | 'Bearish';
}

export interface TaxHistoryRecord {
  year: number;
  assessedValue: number;
  taxPaid: number;
  landValue: number;
  buildingValue: number;
}

export interface UnderwritingReportData {
  id: string;
  propertyId: string;
  userId?: string | null;
  purchasePrice: number;
  expectedRent: number;
  downPaymentPercent: number;
  interestRate: number;
  vacancyRate: number;
  noi: number;
  capRate: number;
  dscr: number;
  cashOnCashReturn: number;
  irr: number;
  projections: CashFlowYear[];
  macroTrends: MacroTrends;
  taxHistory: TaxHistoryRecord[];
  createdAt: string;
}

export interface PriceEstimateInfo {
  estimatedMin: number;
  estimatedMax: number;
  confidenceScore: number;
  factors: {
    baseRatePerSqft: number;
    bedroomBonus: number;
    bathroomBonus: number;
    amenitiesBonus: number;
    locationMultiplier: number;
  };
}

export interface PropertyFilterParams {
  search?: string;
  city?: string;
  type?: string;
  propertyType?: string;
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: number;
  bathrooms?: number;
  verifiedOnly?: boolean;
  amenities?: string[];
  sortBy?: 'price_asc' | 'price_desc' | 'newest' | 'match_score';
}

export interface NearbyPlace {
  name: string;
  type: 'school' | 'hospital' | 'transit' | 'shopping' | 'park';
  distanceKm: number;
}

export function formatINR(amount: number, compact = false): string {
  if (isNaN(amount) || amount === null || amount === undefined) return '₹0';
  if (compact) {
    if (amount >= 10000000) {
      return `₹${(amount / 10000000).toFixed(2)} Cr`;
    }
    if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(2)} L`;
    }
  }
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}


