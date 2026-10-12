import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding Real Estate Database with 350+ Global & Indian Properties...');

  // Clean existing tables in order
  await prisma.smartLockAccessLog.deleteMany();
  await prisma.floorPlan3D.deleteMany();
  await prisma.underwritingReport.deleteMany();
  await prisma.priceEstimate.deleteMany();
  await prisma.savedSearchAlert.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.wishlist.deleteMany();
  await prisma.siteVisit.deleteMany();
  await prisma.enquiry.deleteMany();
  await prisma.propertyMedia.deleteMany();
  await prisma.property.deleteMany();
  await prisma.user.deleteMany();

  const passwordHash = await bcrypt.hash('password123', 10);

  // 1. Create Users
  const buyer = await prisma.user.create({
    data: {
      name: 'Rohan Sharma',
      email: 'buyer@example.com',
      phone: '+91 98765 43210',
      passwordHash,
      role: 'buyer',
      verifiedStatus: 'verified',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    },
  });

  const seller = await prisma.user.create({
    data: {
      name: 'Priya Sundaram',
      email: 'seller@example.com',
      phone: '+91 98123 45678',
      passwordHash,
      role: 'seller',
      verifiedStatus: 'verified',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
    },
  });

  const agent = await prisma.user.create({
    data: {
      name: 'Rajesh Verma',
      email: 'agent@example.com',
      phone: '+91 97111 22334',
      passwordHash,
      role: 'agent',
      verifiedStatus: 'verified',
      avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=300&q=80',
    },
  });

  const admin = await prisma.user.create({
    data: {
      name: 'Platform Admin',
      email: 'admin@example.com',
      phone: '+91 99000 11223',
      passwordHash,
      role: 'admin',
      verifiedStatus: 'verified',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=300&q=80',
    },
  });

  console.log('Created Demo Users:', { buyer: buyer.email, seller: seller.email, agent: agent.email, admin: admin.email });

  const ownerIds = [seller.id, agent.id];

  // High-Resolution Curated Unsplash Image Pools by Property Style
  const imgPools: Record<string, string[]> = {
    apartment: [
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1567496898669-ee935f5f647a?auto=format&fit=crop&w=1200&q=80',
    ],
    house: [
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?auto=format&fit=crop&w=1200&q=80',
    ],
    builderFloor: [
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80',
    ],
    villa: [
      'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1512915922686-57c11dde9b6b?auto=format&fit=crop&w=1200&q=80',
    ],
    plot: [
      'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1628624747186-a941c476b7ef?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80',
    ],
    farmhouse: [
      'https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=1200&q=80',
    ],
    commercial: [
      'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=1200&q=80',
    ],
    interior: [
      'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1200&q=80',
    ],
  };

  const tour360Url = 'https://cdn.pannellum.org/2.5/pannellum.htm#panorama=https://pannellum.org/images/alma.jpg';

  // Define All Target Cities (10 Indian + 12 International Global)
  const citySpecs: Array<{
    city: string;
    state: string;
    isIntl: boolean;
    zipBase: string;
    lat: number;
    lng: number;
    neighborhoods: string[];
    priceMultiplier: number;
  }> = [
    // Indian Cities
    { city: 'Mumbai', state: 'Maharashtra', isIntl: false, zipBase: '4000', lat: 19.076, lng: 72.877, priceMultiplier: 1.8, neighborhoods: ['Bandra West', 'Lower Parel', 'Worli Sea Link', 'Juhu', 'Malabar Hill', 'Powai Lake', 'Colaba Waterfront'] },
    { city: 'Bangalore', state: 'Karnataka', isIntl: false, zipBase: '5600', lat: 12.971, lng: 77.594, priceMultiplier: 1.2, neighborhoods: ['Indiranagar 100ft Rd', 'Koramangala 4th Block', 'Whitefield IT Corridor', 'Electronic City Phase 1', 'Sadashivanagar', 'Sarjapur Rd'] },
    { city: 'Delhi NCR', state: 'Delhi NCR', isIntl: false, zipBase: '1100', lat: 28.613, lng: 77.209, priceMultiplier: 1.4, neighborhoods: ['DLF Phase 5 Gurugram', 'Golf Course Rd', 'Vasant Vihar', 'Chhatarpur Farmhouse Zone', 'Greater Kailash 2', 'Defence Colony'] },
    { city: 'Hyderabad', state: 'Telangana', isIntl: false, zipBase: '5000', lat: 17.385, lng: 78.486, priceMultiplier: 1.1, neighborhoods: ['Jubilee Hills Road 36', 'Banjara Hills', 'Gachibowli Financial Dist', 'HITEC City', 'Kondapur Cyber Towers'] },
    { city: 'Pune', state: 'Maharashtra', isIntl: false, zipBase: '4110', lat: 18.520, lng: 73.856, priceMultiplier: 1.0, neighborhoods: ['Koregaon Park', 'Kalyani Nagar', 'Baner Expressway', 'Viman Nagar', 'Magarpatta City'] },
    { city: 'Goa', state: 'Goa', isIntl: false, zipBase: '4030', lat: 15.299, lng: 74.124, priceMultiplier: 1.3, neighborhoods: ['Anjuna Beach Slope', 'Assagao Heritage Village', 'Candolim Sea Front', 'Panaji Waterfront', 'Baga Creek'] },
    { city: 'Chennai', state: 'Tamil Nadu', isIntl: false, zipBase: '6000', lat: 13.082, lng: 80.270, priceMultiplier: 1.0, neighborhoods: ['Boat Club Road', 'Anna Nagar', 'ECR Beachfront Corridor', 'OMR IT Highway'] },
    { city: 'Kolkata', state: 'West Bengal', isIntl: false, zipBase: '7000', lat: 22.572, lng: 88.363, priceMultiplier: 0.8, neighborhoods: ['Ballygunge Park', 'New Town Rajarhat', 'Salt Lake Sector 5', 'Alipore Central'] },
    { city: 'Kochi', state: 'Kerala', isIntl: false, zipBase: '6820', lat: 9.931, lng: 76.267, priceMultiplier: 0.9, neighborhoods: ['Marine Drive Waterfront', 'Fort Kochi Heritage', 'Kakkanad InfoPark', 'Panampilly Nagar'] },
    { city: 'Ahmedabad', state: 'Gujarat', isIntl: false, zipBase: '3800', lat: 23.022, lng: 72.571, priceMultiplier: 0.85, neighborhoods: ['SG Highway', 'Bodakdev', 'Satellite Road', 'Sindhu Bhavan'] },

    // International Cities (Foreign Properties)
    { city: 'New York', state: 'United States', isIntl: true, zipBase: '1000', lat: 40.7128, lng: -74.0060, priceMultiplier: 3.5, neighborhoods: ['Manhattan Fifth Ave', 'Tribeca Waterfront Loft', 'Brooklyn Heights', 'Upper East Side', 'Wall Street Financial'] },
    { city: 'London', state: 'United Kingdom', isIntl: true, zipBase: 'SW1A', lat: 51.5074, lng: -0.1278, priceMultiplier: 3.8, neighborhoods: ['Mayfair Crescent', 'Kensington Gardens', 'Canary Wharf Tower', 'Chelsea Square', 'Knightsbridge'] },
    { city: 'Dubai', state: 'United Arab Emirates', isIntl: true, zipBase: '0000', lat: 25.2048, lng: 55.2708, priceMultiplier: 2.8, neighborhoods: ['Palm Jumeirah Ocean Villa', 'Downtown Burj Crown', 'Dubai Marina Horizon', 'Business Bay Canal', 'Emirates Hills'] },
    { city: 'Singapore', state: 'Singapore', isIntl: true, zipBase: '0189', lat: 1.3521, lng: 103.8198, priceMultiplier: 3.2, neighborhoods: ['Marina Bay Sands View', 'Orchard Road Boulevard', 'Sentosa Cove Waterfront', 'Tanjong Pagar Sky Tower'] },
    { city: 'Tokyo', state: 'Japan', isIntl: true, zipBase: '100-0', lat: 35.6762, lng: 139.6503, priceMultiplier: 2.5, neighborhoods: ['Roppongi Hills Sky Suite', 'Shibuya Boulevard', 'Ginza Luxury District', 'Shinjuku Skyscraper'] },
    { city: 'Paris', state: 'France', isIntl: true, zipBase: '7500', lat: 48.8566, lng: 2.3522, priceMultiplier: 3.0, neighborhoods: ['Champs-Élysées Luxury Suite', 'Le Marais Historic Loft', '16th Arrondissement Mansion', 'Eiffel View Avenue'] },
    { city: 'Sydney', state: 'Australia', isIntl: true, zipBase: '2000', lat: -33.8688, lng: 151.2093, priceMultiplier: 2.6, neighborhoods: ['Harbour Bridge Frontage', 'Bondi Beach Ocean Villa', 'Darling Harbour Suite', 'Mosman Bay Estate'] },
    { city: 'Toronto', state: 'Canada', isIntl: true, zipBase: 'M5V', lat: 43.6532, lng: -79.3832, priceMultiplier: 2.2, neighborhoods: ['Yorkville Luxury Penthouse', 'Downtown Harbourfront', 'Forest Hill Park Estate', 'King West Entertainment'] },
    { city: 'Los Angeles', state: 'United States', isIntl: true, zipBase: '9021', lat: 34.0522, lng: -118.2437, priceMultiplier: 3.2, neighborhoods: ['Beverly Hills Estate', 'Bel Air Crest', 'Malibu Oceanfront Villa', 'Sunset Strip Hollywood'] },
    { city: 'Miami', state: 'United States', isIntl: true, zipBase: '3313', lat: 25.7617, lng: -80.1918, priceMultiplier: 2.7, neighborhoods: ['South Beach Ocean Drive', 'Brickell Financial Sky Condo', 'Star Island Waterfront Villa', 'Coral Gables'] },
    { city: 'Bali', state: 'Indonesia', isIntl: true, zipBase: '8036', lat: -8.4095, lng: 115.1889, priceMultiplier: 1.5, neighborhoods: ['Seminyak Cliff Sanctuary', 'Ubud Jungle Ridge Villa', 'Canggu Beachfront Estate', 'Uluwatu Sunset Ocean'] },
  ];

  const propertyTypes = ['apartment', 'house', 'villa', 'condo', 'commercial', 'plot', 'independent_house', 'builder_floor', 'farmhouse'];

  const amenityPool = [
    'Swimming Pool', 'Gym', 'Clubhouse', 'Power Backup', '24/7 CCTV Security',
    'Covered Car Parking', 'Vaastu Compliant', 'Private Terrace Garden', 'Helipad Access',
    'Private Elevator', 'Smart Home Automation', 'Beach Access', 'Golf Course View',
    'EV Charging Station', 'Concierge Service', 'Jacuzzi Spa'
  ];

  const propertiesToInsert: any[] = [];

  // Generate 16 to 18 properties per city spec => Total = 21 cities * 17 = 357+ properties!
  let globalCount = 0;
  citySpecs.forEach((citySpec) => {
    citySpec.neighborhoods.forEach((area, areaIdx) => {
      // Create 2-3 properties per neighborhood
      for (let k = 0; k < 3; k++) {
        globalCount++;
        const pType = propertyTypes[globalCount % propertyTypes.length];
        const isRent = (globalCount % 3) === 0;

        // Base prices in INR
        let basePrice = Math.round((25000000 + (globalCount % 10) * 8000000) * citySpec.priceMultiplier);
        if (isRent) basePrice = Math.round(basePrice * 0.0035); // Monthly rent

        const beds = (globalCount % 5) + 1; // 1 to 5 BHK
        const baths = Math.max(1, beds + ((globalCount % 2) === 0 ? 0 : 1));
        const sizeSqft = Math.round(800 + beds * 500 + (globalCount % 5) * 350);

        const imgCategory = ['apartment', 'condo'].includes(pType)
          ? 'apartment'
          : ['villa', 'farmhouse'].includes(pType)
          ? 'villa'
          : ['house', 'independent_house', 'builder_floor'].includes(pType)
          ? 'house'
          : pType === 'commercial'
          ? 'commercial'
          : 'plot';

        const mainImgs = imgPools[imgCategory] || imgPools.apartment;
        const mainImgUrl = mainImgs[globalCount % mainImgs.length];
        const interiorImgUrl = imgPools.interior[(globalCount + 1) % imgPools.interior.length];

        const titlePrefix = citySpec.isIntl ? '🌍 ' : '';
        const titleText = `${titlePrefix}${beds} BHK ${pType.toUpperCase().replace('_', ' ')} in ${area}, ${citySpec.city}`;

        propertiesToInsert.push({
          ownerId: ownerIds[globalCount % 2],
          title: titleText,
          description: `Luxury ${beds} BHK ${pType.replace('_', ' ')} property situated in prime ${area}, ${citySpec.city} (${citySpec.state}). Architecturally designed with panoramic floor-to-ceiling glass, high ceilings, automated climate control, smart lock access, and premier neighborhood livability.`,
          type: isRent ? 'rent' : 'sale',
          propertyType: pType,
          price: basePrice,
          address: `${areaIdx * 15 + k + 101} ${area}`,
          city: citySpec.city,
          state: citySpec.state,
          zip: `${citySpec.zipBase}${areaIdx + 10}`,
          latitude: citySpec.lat + (k * 0.005),
          longitude: citySpec.lng + (k * 0.005),
          sizeSqft,
          bedrooms: beds,
          bathrooms: baths,
          amenities: JSON.stringify(amenityPool.slice(0, 5 + (globalCount % 6))),
          status: 'available',
          verifiedStatus: 'verified',
          featured: globalCount % 5 === 0,
          media: {
            create: [
              { mediaUrl: mainImgUrl, type: 'image', caption: `${area} Primary Exterior View` },
              { mediaUrl: interiorImgUrl, type: 'image', caption: 'Luxury Interior Lounge' },
              { mediaUrl: tour360Url, type: 'tour360', caption: 'Interactive 360° Virtual Tour View' },
            ],
          },
        });
      }
    });
  });

  // Dedicated Budget Properties Under ₹20 Lakhs (36 properties)
  const budgetUnder20LData = [
    { title: '1 BHK Budget Housing Flat in Malad West', city: 'Mumbai', state: 'Maharashtra', price: 1850000, type: 'sale', propertyType: 'apartment', sqft: 420, beds: 1, baths: 1, lat: 19.186, lng: 72.848 },
    { title: '1 RK Compact Studio Flat in Kandivali East', city: 'Mumbai', state: 'Maharashtra', price: 1450000, type: 'sale', propertyType: 'apartment', sqft: 320, beds: 1, baths: 1, lat: 19.207, lng: 72.854 },
    { title: 'Affordable 1 BHK Flat in Dombivli East', city: 'Mumbai', state: 'Maharashtra', price: 1150000, type: 'sale', propertyType: 'builder_floor', sqft: 450, beds: 1, baths: 1, lat: 19.218, lng: 73.086 },
    { title: '1 BHK Budget Apartment in Nalasopara West', city: 'Mumbai', state: 'Maharashtra', price: 850000, type: 'sale', propertyType: 'apartment', sqft: 380, beds: 1, baths: 1, lat: 19.417, lng: 72.783 },
    { title: 'Suburban 1 RK Studio Flat in Virar East', city: 'Mumbai', state: 'Maharashtra', price: 650000, type: 'sale', propertyType: 'apartment', sqft: 290, beds: 1, baths: 1, lat: 19.456, lng: 72.811 },
    { title: '1 BHK Affordable Flat in Electronic City Phase 2', city: 'Bangalore', state: 'Karnataka', price: 1780000, type: 'sale', propertyType: 'apartment', sqft: 510, beds: 1, baths: 1, lat: 12.845, lng: 77.665 },
    { title: 'Compact 1 BHK Flat in Kengeri Satellite Town', city: 'Bangalore', state: 'Karnataka', price: 1550000, type: 'sale', propertyType: 'builder_floor', sqft: 480, beds: 1, baths: 1, lat: 12.917, lng: 77.483 },
    { title: '1 BHK Budget Apartment in Chandapura', city: 'Bangalore', state: 'Karnataka', price: 1280000, type: 'sale', propertyType: 'apartment', sqft: 460, beds: 1, baths: 1, lat: 12.793, lng: 77.702 },
    { title: 'Residential Plot Site in Nelamangala Expressway', city: 'Bangalore', state: 'Karnataka', price: 950000, type: 'sale', propertyType: 'plot', sqft: 1200, beds: 0, baths: 0, lat: 13.099, lng: 77.391 },
    { title: 'Budget Plot Land near Devanahalli Airport Corridor', city: 'Bangalore', state: 'Karnataka', price: 1650000, type: 'sale', propertyType: 'plot', sqft: 1500, beds: 0, baths: 0, lat: 13.248, lng: 77.712 },
    { title: '1 BHK Builder Floor Flat in Uttam Nagar', city: 'Delhi NCR', state: 'Delhi NCR', price: 1480000, type: 'sale', propertyType: 'builder_floor', sqft: 450, beds: 1, baths: 1, lat: 28.621, lng: 77.056 },
    { title: 'Compact 1 BHK Independent Floor in Dwarka Mor', city: 'Delhi NCR', state: 'Delhi NCR', price: 1680000, type: 'sale', propertyType: 'builder_floor', sqft: 480, beds: 1, baths: 1, lat: 28.619, lng: 77.032 },
    { title: '1 BHK Affordable Flat in Greater Noida West', city: 'Delhi NCR', state: 'Delhi NCR', price: 1890000, type: 'sale', propertyType: 'apartment', sqft: 550, beds: 1, baths: 1, lat: 28.591, lng: 77.453 },
    { title: '1 RK Budget Flat in Govindpuri Extension', city: 'Delhi NCR', state: 'Delhi NCR', price: 1120000, type: 'sale', propertyType: 'apartment', sqft: 310, beds: 1, baths: 1, lat: 28.538, lng: 77.262 },
    { title: 'Residential Land Plot in Yamuna Expressway Corridor', city: 'Delhi NCR', state: 'Delhi NCR', price: 1350000, type: 'sale', propertyType: 'plot', sqft: 900, beds: 0, baths: 0, lat: 28.351, lng: 77.541 },
    { title: '1 BHK Affordable Apartment in Ghatkesar IT Zone', city: 'Hyderabad', state: 'Telangana', price: 1590000, type: 'sale', propertyType: 'apartment', sqft: 520, beds: 1, baths: 1, lat: 17.445, lng: 78.683 },
    { title: '1 BHK Compact Flat in Patancheru Highway', city: 'Hyderabad', state: 'Telangana', price: 1380000, type: 'sale', propertyType: 'apartment', sqft: 490, beds: 1, baths: 1, lat: 17.528, lng: 78.267 },
    { title: 'Open Residential Plot in Shadnagar Regional Ring Road', city: 'Hyderabad', state: 'Telangana', price: 890000, type: 'sale', propertyType: 'plot', sqft: 1200, beds: 0, baths: 0, lat: 17.072, lng: 78.209 },
    { title: 'Budget Plot in Adibatla Aerospace Park Corridor', city: 'Hyderabad', state: 'Telangana', price: 1190000, type: 'sale', propertyType: 'plot', sqft: 1100, beds: 0, baths: 0, lat: 17.234, lng: 78.583 },
    { title: '1 BHK Compact Apartment in Wagholi Pune', city: 'Pune', state: 'Maharashtra', price: 1750000, type: 'sale', propertyType: 'apartment', sqft: 480, beds: 1, baths: 1, lat: 18.581, lng: 73.981 },
    { title: '1 BHK Budget Flat in Narhe Ambegaon', city: 'Pune', state: 'Maharashtra', price: 1490000, type: 'sale', propertyType: 'apartment', sqft: 460, beds: 1, baths: 1, lat: 18.448, lng: 73.829 },
    { title: '1 RK Studio Flat in Chakan Industrial Corridor', city: 'Pune', state: 'Maharashtra', price: 920000, type: 'sale', propertyType: 'apartment', sqft: 340, beds: 1, baths: 1, lat: 18.761, lng: 73.858 },
    { title: 'Residential Land Site in Shirwal Highway', city: 'Pune', state: 'Maharashtra', price: 780000, type: 'sale', propertyType: 'plot', sqft: 1000, beds: 0, baths: 0, lat: 18.143, lng: 73.982 },
    { title: '1 BHK Coastal Villa Plot in Mapusa Goa', city: 'Goa', state: 'Goa', price: 1920000, type: 'sale', propertyType: 'plot', sqft: 1800, beds: 0, baths: 0, lat: 15.592, lng: 73.811 },
    { title: 'Budget Land Plot near Mopa International Airport', city: 'Goa', state: 'Goa', price: 1450000, type: 'sale', propertyType: 'plot', sqft: 2000, beds: 0, baths: 0, lat: 15.758, lng: 73.869 },
    { title: '1 BHK Budget Flat in Avadi Tank Factory Road', city: 'Chennai', state: 'Tamil Nadu', price: 1620000, type: 'sale', propertyType: 'apartment', sqft: 500, beds: 1, baths: 1, lat: 13.114, lng: 80.098 },
    { title: '1 BHK Compact Flat in Maraimalai Nagar OMR', city: 'Chennai', state: 'Tamil Nadu', price: 1390000, type: 'sale', propertyType: 'apartment', sqft: 470, beds: 1, baths: 1, lat: 12.793, lng: 80.021 },
    { title: 'Residential Plot in Guduvanchery NH45 Corridor', city: 'Chennai', state: 'Tamil Nadu', price: 1050000, type: 'sale', propertyType: 'plot', sqft: 1000, beds: 0, baths: 0, lat: 12.842, lng: 80.063 },
    { title: '1 BHK Affordable Flat in Rajarhat Action Area 3', city: 'Kolkata', state: 'West Bengal', price: 1720000, type: 'sale', propertyType: 'apartment', sqft: 510, beds: 1, baths: 1, lat: 22.583, lng: 88.473 },
    { title: '1 BHK Flat in Barasat Barrackpore Trunk Road', city: 'Kolkata', state: 'West Bengal', price: 1240000, type: 'sale', propertyType: 'apartment', sqft: 440, beds: 1, baths: 1, lat: 22.723, lng: 88.481 },
    { title: '1 RK Budget Flat in Sonarpur Station Area', city: 'Kolkata', state: 'West Bengal', price: 820000, type: 'sale', propertyType: 'apartment', sqft: 310, beds: 1, baths: 1, lat: 22.438, lng: 88.431 },
    { title: '1 BHK Budget Flat in Aluva Expressway Corridor', city: 'Kochi', state: 'Kerala', price: 1840000, type: 'sale', propertyType: 'apartment', sqft: 530, beds: 1, baths: 1, lat: 10.108, lng: 76.357 },
    { title: 'Compact 1 BHK Flat in Angamaly InfoPark Bypass', city: 'Kochi', state: 'Kerala', price: 1420000, type: 'sale', propertyType: 'apartment', sqft: 470, beds: 1, baths: 1, lat: 10.196, lng: 76.386 },
    { title: '1 BHK Budget Flat in Naroda SP Ring Road', city: 'Ahmedabad', state: 'Gujarat', price: 1560000, type: 'sale', propertyType: 'apartment', sqft: 520, beds: 1, baths: 1, lat: 23.072, lng: 72.671 },
    { title: '1 BHK Flat in Vatva GIDC Corridor', city: 'Ahmedabad', state: 'Gujarat', price: 1180000, type: 'sale', propertyType: 'apartment', sqft: 450, beds: 1, baths: 1, lat: 22.951, lng: 72.634 },
    { title: '1 RK Affordable Studio in Sanand Industrial Hub', city: 'Ahmedabad', state: 'Gujarat', price: 790000, type: 'sale', propertyType: 'apartment', sqft: 320, beds: 1, baths: 1, lat: 22.992, lng: 72.381 },
  ];

  budgetUnder20LData.forEach((bProp, idx) => {
    const mainImgs = imgPools[bProp.propertyType === 'plot' ? 'plot' : 'apartment'];
    const mainImgUrl = mainImgs[idx % mainImgs.length];
    const interiorImgUrl = imgPools.interior[(idx + 2) % imgPools.interior.length];

    propertiesToInsert.push({
      ownerId: ownerIds[idx % 2],
      title: `⚡ ${bProp.title}`,
      description: `Affordable property priced under ₹20 Lakhs in prime ${bProp.city} (${bProp.state}). Efficient floor layout, excellent connectivity, low maintenance costs, vaastu compliant, and ready for instant home buying or investment.`,
      type: bProp.type,
      propertyType: bProp.propertyType,
      price: bProp.price,
      address: `Plot / Flat #${idx + 12}, ${bProp.title.split(' in ')[1] || bProp.city}`,
      city: bProp.city,
      state: bProp.state,
      zip: `4000${(idx % 5) + 1}`,
      latitude: bProp.lat,
      longitude: bProp.lng,
      sizeSqft: bProp.sqft,
      bedrooms: bProp.beds,
      bathrooms: bProp.baths,
      amenities: JSON.stringify(['24/7 CCTV Security', 'Power Backup', 'Covered Car Parking', 'Vaastu Compliant'].slice(0, 3 + (idx % 2))),
      status: 'available',
      verifiedStatus: 'verified',
      featured: idx % 3 === 0,
      media: {
        create: [
          { mediaUrl: mainImgUrl, type: 'image', caption: `${bProp.title} Exterior` },
          { mediaUrl: interiorImgUrl, type: 'image', caption: 'Compact Lounge & Kitchen' },
          { mediaUrl: tour360Url, type: 'tour360', caption: 'Interactive 360° Virtual Tour' },
        ],
      },
    });
  });

  // Dedicated Budget Properties Range 20L - 50L (35 properties)
  const budget20To50LData = [
    // Indian Metro Cities
    { title: '2 BHK Flat in Mira Road West', city: 'Mumbai', state: 'Maharashtra', price: 4500000, type: 'sale', propertyType: 'apartment', sqft: 720, beds: 2, baths: 2, lat: 19.281, lng: 72.856 },
    { title: '2 BHK Apartment in Thane Majiwada', city: 'Mumbai', state: 'Maharashtra', price: 4800000, type: 'sale', propertyType: 'apartment', sqft: 750, beds: 2, baths: 2, lat: 19.214, lng: 72.981 },
    { title: '2 BHK Flat in Whitefield IT Corridor', city: 'Bangalore', state: 'Karnataka', price: 3800000, type: 'sale', propertyType: 'apartment', sqft: 850, beds: 2, baths: 2, lat: 12.969, lng: 77.749 },
    { title: '2 BHK Builder Floor in Yelahanka New Town', city: 'Bangalore', state: 'Karnataka', price: 3400000, type: 'sale', propertyType: 'builder_floor', sqft: 820, beds: 2, baths: 2, lat: 13.099, lng: 77.597 },
    { title: '2 BHK Flat in Electronic City Phase 1', city: 'Bangalore', state: 'Karnataka', price: 2900000, type: 'sale', propertyType: 'apartment', sqft: 780, beds: 2, baths: 2, lat: 12.839, lng: 77.677 },
    { title: '2 BHK Builder Floor in Dwarka Sector 19', city: 'Delhi NCR', state: 'Delhi NCR', price: 4200000, type: 'sale', propertyType: 'builder_floor', sqft: 800, beds: 2, baths: 2, lat: 28.583, lng: 77.051 },
    { title: '2 BHK Independent House in Raj Nagar Extension', city: 'Delhi NCR', state: 'Delhi NCR', price: 3600000, type: 'sale', propertyType: 'independent_house', sqft: 900, beds: 2, baths: 2, lat: 28.694, lng: 77.432 },
    { title: '2 BHK Apartment in Greater Noida West', city: 'Delhi NCR', state: 'Delhi NCR', price: 3900000, type: 'sale', propertyType: 'apartment', sqft: 860, beds: 2, baths: 2, lat: 28.588, lng: 77.449 },
    { title: '2 BHK Flat in Miyapur Junction', city: 'Hyderabad', state: 'Telangana', price: 3800000, type: 'sale', propertyType: 'apartment', sqft: 880, beds: 2, baths: 2, lat: 17.496, lng: 78.358 },
    { title: '2 BHK Apartment in Kompally Highway', city: 'Hyderabad', state: 'Telangana', price: 3200000, type: 'sale', propertyType: 'apartment', sqft: 820, beds: 2, baths: 2, lat: 17.538, lng: 78.483 },
    { title: '2 BHK Gated Flat in Bachupally', city: 'Hyderabad', state: 'Telangana', price: 2800000, type: 'sale', propertyType: 'apartment', sqft: 790, beds: 2, baths: 2, lat: 17.531, lng: 78.368 },
    { title: '2 BHK Flat in Hinjewadi Phase 1', city: 'Pune', state: 'Maharashtra', price: 4200000, type: 'sale', propertyType: 'apartment', sqft: 820, beds: 2, baths: 2, lat: 18.591, lng: 73.738 },
    { title: '2 BHK Apartment in Wakad Datta Mandir Rd', city: 'Pune', state: 'Maharashtra', price: 4600000, type: 'sale', propertyType: 'apartment', sqft: 860, beds: 2, baths: 2, lat: 18.598, lng: 73.763 },
    { title: '2 BHK Flat in Kharadi IT Corridor', city: 'Pune', state: 'Maharashtra', price: 4800000, type: 'sale', propertyType: 'apartment', sqft: 880, beds: 2, baths: 2, lat: 18.551, lng: 73.938 },
    { title: '2 BHK Villa Plot Cottage in Calangute', city: 'Goa', state: 'Goa', price: 4500000, type: 'sale', propertyType: 'house', sqft: 1100, beds: 2, baths: 2, lat: 15.543, lng: 73.755 },
    { title: 'Heritage Villa Site in Porvorim', city: 'Goa', state: 'Goa', price: 3900000, type: 'sale', propertyType: 'independent_house', sqft: 1000, beds: 2, baths: 2, lat: 15.536, lng: 73.829 },
    { title: '2 BHK Apartment in Tambaram Sanatorium', city: 'Chennai', state: 'Tamil Nadu', price: 3600000, type: 'sale', propertyType: 'apartment', sqft: 810, beds: 2, baths: 2, lat: 12.928, lng: 80.126 },
    { title: '2 BHK Flat in Sholinganallur OMR', city: 'Chennai', state: 'Tamil Nadu', price: 4400000, type: 'sale', propertyType: 'apartment', sqft: 890, beds: 2, baths: 2, lat: 12.901, lng: 80.227 },
    { title: '2 BHK Flat in New Town Action Area 1', city: 'Kolkata', state: 'West Bengal', price: 3900000, type: 'sale', propertyType: 'apartment', sqft: 840, beds: 2, baths: 2, lat: 22.589, lng: 88.461 },
    { title: '2 BHK Flat in Garia Station Highway', city: 'Kolkata', state: 'West Bengal', price: 2800000, type: 'sale', propertyType: 'apartment', sqft: 760, beds: 2, baths: 2, lat: 22.463, lng: 88.391 },
    { title: '2 BHK Waterfront Apartment in Edappally', city: 'Kochi', state: 'Kerala', price: 4200000, type: 'sale', propertyType: 'apartment', sqft: 890, beds: 2, baths: 2, lat: 10.026, lng: 76.308 },
    { title: '2 BHK Flat in Kakkanad SmartCity Corridor', city: 'Kochi', state: 'Kerala', price: 3500000, type: 'sale', propertyType: 'apartment', sqft: 830, beds: 2, baths: 2, lat: 10.015, lng: 76.361 },
    { title: '2 BHK Flat in Vaishno Devi Circle', city: 'Ahmedabad', state: 'Gujarat', price: 3800000, type: 'sale', propertyType: 'apartment', sqft: 850, beds: 2, baths: 2, lat: 23.129, lng: 72.548 },
    { title: '2 BHK Apartment in Chandkheda Highway', city: 'Ahmedabad', state: 'Gujarat', price: 2900000, type: 'sale', propertyType: 'apartment', sqft: 790, beds: 2, baths: 2, lat: 23.111, lng: 72.583 },

    // International Cities
    { title: '🌍 Compact Studio Suite in Jumeirah Village Circle', city: 'Dubai', state: 'United Arab Emirates', price: 4200000, type: 'sale', propertyType: 'apartment', sqft: 450, beds: 1, baths: 1, lat: 25.061, lng: 55.209 },
    { title: '🌍 Modern Studio Apartment in Business Bay Canal', city: 'Dubai', state: 'United Arab Emirates', price: 4800000, type: 'sale', propertyType: 'condo', sqft: 480, beds: 1, baths: 1, lat: 25.183, lng: 55.266 },
    { title: '🌍 Tropical Garden Villa Loft in Canggu Beach', city: 'Bali', state: 'Indonesia', price: 3500000, type: 'sale', propertyType: 'villa', sqft: 950, beds: 1, baths: 1, lat: -8.648, lng: 115.138 },
    { title: '🌍 Ubud Jungle View Resort Suite', city: 'Bali', state: 'Indonesia', price: 2800000, type: 'sale', propertyType: 'house', sqft: 750, beds: 1, baths: 1, lat: -8.506, lng: 115.262 },
    { title: '🌍 Urban Studio Flat in Croydon Horizon', city: 'London', state: 'United Kingdom', price: 4600000, type: 'sale', propertyType: 'apartment', sqft: 410, beds: 1, baths: 1, lat: 51.376, lng: -0.098 },
    { title: '🌍 Suburban Condominium Loft in Hachioji', city: 'Tokyo', state: 'Japan', price: 3900000, type: 'sale', propertyType: 'condo', sqft: 430, beds: 1, baths: 1, lat: 35.655, lng: 139.338 },
    { title: '🌍 Harbourfront Studio Unit in Wollongong', city: 'Sydney', state: 'Australia', price: 4400000, type: 'sale', propertyType: 'apartment', sqft: 460, beds: 1, baths: 1, lat: -34.427, lng: 150.893 },
    { title: '🌍 Downtown Studio Loft in Mississauga', city: 'Toronto', state: 'Canada', price: 4500000, type: 'sale', propertyType: 'apartment', sqft: 490, beds: 1, baths: 1, lat: 43.589, lng: -79.644 },
    { title: '🌍 Ocean View Studio Apartment in North Miami', city: 'Miami', state: 'United States', price: 4800000, type: 'sale', propertyType: 'condo', sqft: 520, beds: 1, baths: 1, lat: 25.890, lng: -80.161 },
    { title: '🌍 Historic Studio Loft in Montmartre', city: 'Paris', state: 'France', price: 4900000, type: 'sale', propertyType: 'apartment', sqft: 380, beds: 1, baths: 1, lat: 48.886, lng: 2.343 },
    { title: '🌍 Residential Condo Studio in Jurong West', city: 'Singapore', state: 'Singapore', price: 4700000, type: 'sale', propertyType: 'condo', sqft: 420, beds: 1, baths: 1, lat: 1.340, lng: 103.705 },
  ];

  budget20To50LData.forEach((bProp, idx) => {
    const mainImgs = imgPools[bProp.propertyType === 'plot' ? 'plot' : 'apartment'];
    const mainImgUrl = mainImgs[idx % mainImgs.length];
    const interiorImgUrl = imgPools.interior[(idx + 1) % imgPools.interior.length];

    propertiesToInsert.push({
      ownerId: ownerIds[idx % 2],
      title: `${bProp.city === 'Dubai' || bProp.state === 'Indonesia' || bProp.state === 'United Kingdom' || bProp.state === 'Japan' || bProp.state === 'Australia' || bProp.state === 'Canada' || bProp.state === 'United States' || bProp.state === 'France' || bProp.state === 'Singapore' ? '' : '🏢 '}${bProp.title}`,
      description: `Mid-range property priced between ₹20 Lakhs and ₹50 Lakhs in prime ${bProp.city} (${bProp.state}). Modern amenities, 24/7 security, high rental yield potential, and excellent urban infrastructure connectivity.`,
      type: bProp.type,
      propertyType: bProp.propertyType,
      price: bProp.price,
      address: `Apt #${idx + 21}, ${bProp.title.split(' in ')[1] || bProp.city}`,
      city: bProp.city,
      state: bProp.state,
      zip: `4000${(idx % 5) + 1}`,
      latitude: bProp.lat,
      longitude: bProp.lng,
      sizeSqft: bProp.sqft,
      bedrooms: bProp.beds,
      bathrooms: bProp.baths,
      amenities: JSON.stringify(['Gym', 'Covered Car Parking', 'Power Backup', '24/7 CCTV Security', 'Clubhouse'].slice(0, 4)),
      status: 'available',
      verifiedStatus: 'verified',
      featured: idx % 4 === 0,
      media: {
        create: [
          { mediaUrl: mainImgUrl, type: 'image', caption: `${bProp.title} Main Building` },
          { mediaUrl: interiorImgUrl, type: 'image', caption: 'Modern Interior Space' },
          { mediaUrl: tour360Url, type: 'tour360', caption: 'Interactive 360° Virtual Tour' },
        ],
      },
    });
  });

  // Dedicated Budget Properties Range 50L - 1Cr (35 properties)
  const budget50LTo1CrData = [
    // Indian Metro Cities
    { title: '3 BHK Luxury Apartment in Kandivali West', city: 'Mumbai', state: 'Maharashtra', price: 8800000, type: 'sale', propertyType: 'apartment', sqft: 1150, beds: 3, baths: 3, lat: 19.206, lng: 72.836 },
    { title: '3 BHK Premium Flat in Mulund West', city: 'Mumbai', state: 'Maharashtra', price: 9500000, type: 'sale', propertyType: 'apartment', sqft: 1220, beds: 3, baths: 3, lat: 19.172, lng: 72.956 },
    { title: '3 BHK Builder Floor in Vashi Sector 17', city: 'Mumbai', state: 'Maharashtra', price: 7800000, type: 'sale', propertyType: 'builder_floor', sqft: 1100, beds: 3, baths: 2, lat: 19.077, lng: 73.001 },
    { title: '3 BHK Luxury Flat in HSR Layout Sector 1', city: 'Bangalore', state: 'Karnataka', price: 8500000, type: 'sale', propertyType: 'apartment', sqft: 1250, beds: 3, baths: 3, lat: 12.912, lng: 77.651 },
    { title: '3 BHK Apartment in Bellandur ORR', city: 'Bangalore', state: 'Karnataka', price: 9200000, type: 'sale', propertyType: 'apartment', sqft: 1300, beds: 3, baths: 3, lat: 12.930, lng: 77.678 },
    { title: '3 BHK Gated Villa in Sarjapur Attibele Rd', city: 'Bangalore', state: 'Karnataka', price: 6800000, type: 'sale', propertyType: 'villa', sqft: 1450, beds: 3, baths: 3, lat: 12.861, lng: 77.781 },
    { title: '3 BHK Independent House in Vasant Kunj Extension', city: 'Delhi NCR', state: 'Delhi NCR', price: 9500000, type: 'sale', propertyType: 'independent_house', sqft: 1350, beds: 3, baths: 3, lat: 28.528, lng: 77.152 },
    { title: '3 BHK Luxury Floor in Gurgaon Sector 57', city: 'Delhi NCR', state: 'Delhi NCR', price: 8900000, type: 'sale', propertyType: 'builder_floor', sqft: 1280, beds: 3, baths: 3, lat: 28.438, lng: 77.081 },
    { title: '3 BHK Apartment in Noida Expressway Sector 137', city: 'Delhi NCR', state: 'Delhi NCR', price: 6200000, type: 'sale', propertyType: 'apartment', sqft: 1180, beds: 3, baths: 2, lat: 28.502, lng: 77.411 },
    { title: '3 BHK Luxury Flat in Kukatpally KPHB', city: 'Hyderabad', state: 'Telangana', price: 7800000, type: 'sale', propertyType: 'apartment', sqft: 1280, beds: 3, baths: 3, lat: 17.485, lng: 78.401 },
    { title: '3 BHK Apartment in Gachibowli Financial District', city: 'Hyderabad', state: 'Telangana', price: 8800000, type: 'sale', propertyType: 'apartment', sqft: 1350, beds: 3, baths: 3, lat: 17.442, lng: 78.348 },
    { title: '3 BHK Villa Row House in Tellapur', city: 'Hyderabad', state: 'Telangana', price: 9400000, type: 'sale', propertyType: 'villa', sqft: 1520, beds: 3, baths: 3, lat: 17.461, lng: 78.283 },
    { title: '3 BHK Luxury Apartment in Baner Pashan Link Rd', city: 'Pune', state: 'Maharashtra', price: 8200000, type: 'sale', propertyType: 'apartment', sqft: 1260, beds: 3, baths: 3, lat: 18.558, lng: 73.788 },
    { title: '3 BHK Flat in Kothrud Karve Nagar', city: 'Pune', state: 'Maharashtra', price: 9600000, type: 'sale', propertyType: 'apartment', sqft: 1320, beds: 3, baths: 3, lat: 18.507, lng: 73.807 },
    { title: '3 BHK Penthouse in Hadapsar Magarpatta', city: 'Pune', state: 'Maharashtra', price: 7200000, type: 'sale', propertyType: 'apartment', sqft: 1210, beds: 3, baths: 3, lat: 18.518, lng: 73.928 },
    { title: '3 BHK Ocean Villa in Candolim Beach Road', city: 'Goa', state: 'Goa', price: 9800000, type: 'sale', propertyType: 'villa', sqft: 1650, beds: 3, baths: 3, lat: 15.518, lng: 73.766 },
    { title: 'Luxury Portuguese Villa in Assagao', city: 'Goa', state: 'Goa', price: 8900000, type: 'sale', propertyType: 'independent_house', sqft: 1580, beds: 3, baths: 3, lat: 15.589, lng: 73.789 },
    { title: '3 BHK Luxury Flat in Velachery Main Rd', city: 'Chennai', state: 'Tamil Nadu', price: 7500000, type: 'sale', propertyType: 'apartment', sqft: 1220, beds: 3, baths: 3, lat: 12.978, lng: 80.221 },
    { title: '3 BHK Penthouse in ECR Beach Corridor', city: 'Chennai', state: 'Tamil Nadu', price: 9200000, type: 'sale', propertyType: 'apartment', sqft: 1380, beds: 3, baths: 3, lat: 12.871, lng: 80.248 },
    { title: '3 BHK Luxury Apartment in Salt Lake Sector 3', city: 'Kolkata', state: 'West Bengal', price: 6800000, type: 'sale', propertyType: 'apartment', sqft: 1190, beds: 3, baths: 2, lat: 22.571, lng: 88.412 },
    { title: '3 BHK Heritage Flat in Ballygunge Place', city: 'Kolkata', state: 'West Bengal', price: 8800000, type: 'sale', propertyType: 'apartment', sqft: 1310, beds: 3, baths: 3, lat: 22.528, lng: 88.368 },
    { title: '3 BHK Waterfront Villa in Kadavanthra', city: 'Kochi', state: 'Kerala', price: 7900000, type: 'sale', propertyType: 'villa', sqft: 1480, beds: 3, baths: 3, lat: 9.961, lng: 76.299 },
    { title: '3 BHK Luxury Flat in Marine Drive Vista', city: 'Kochi', state: 'Kerala', price: 9500000, type: 'sale', propertyType: 'apartment', sqft: 1390, beds: 3, baths: 3, lat: 9.981, lng: 76.276 },
    { title: '3 BHK Premium Apartment in SG Highway', city: 'Ahmedabad', state: 'Gujarat', price: 6500000, type: 'sale', propertyType: 'apartment', sqft: 1210, beds: 3, baths: 3, lat: 23.038, lng: 72.511 },
    { title: '3 BHK Penthouse in Prahlad Nagar', city: 'Ahmedabad', state: 'Gujarat', price: 8200000, type: 'sale', propertyType: 'apartment', sqft: 1340, beds: 3, baths: 3, lat: 23.012, lng: 72.508 },

    // International Cities
    { title: '🌍 1 BHK Luxury Ocean Condo in Dubai Marina', city: 'Dubai', state: 'United Arab Emirates', price: 8800000, type: 'sale', propertyType: 'condo', sqft: 720, beds: 1, baths: 2, lat: 25.077, lng: 55.141 },
    { title: '🌍 Executive Sky Apartment in Business Bay', city: 'Dubai', state: 'United Arab Emirates', price: 9500000, type: 'sale', propertyType: 'apartment', sqft: 780, beds: 1, baths: 2, lat: 25.189, lng: 55.271 },
    { title: '🌍 Private Pool Sanctuary Villa in Seminyak', city: 'Bali', state: 'Indonesia', price: 6500000, type: 'sale', propertyType: 'villa', sqft: 1350, beds: 2, baths: 2, lat: -8.689, lng: 115.158 },
    { title: '🌍 Uluwatu Oceanfront Cliff Bungalow', city: 'Bali', state: 'Indonesia', price: 7800000, type: 'sale', propertyType: 'villa', sqft: 1420, beds: 2, baths: 2, lat: -8.829, lng: 115.084 },
    { title: '🌍 Modern 1 BHK Flat in Canary Wharf', city: 'London', state: 'United Kingdom', price: 9200000, type: 'sale', propertyType: 'apartment', sqft: 610, beds: 1, baths: 1, lat: 51.505, lng: -0.023 },
    { title: '🌍 Shinjuku Skyscraper Suite', city: 'Tokyo', state: 'Japan', price: 8500000, type: 'sale', propertyType: 'condo', sqft: 580, beds: 1, baths: 1, lat: 35.693, lng: 139.703 },
    { title: '🌍 Bondi Beach Ocean Apartment', city: 'Sydney', state: 'Australia', price: 9600000, type: 'sale', propertyType: 'apartment', sqft: 650, beds: 1, baths: 1, lat: -33.891, lng: 151.274 },
    { title: '🌍 Downtown Luxury Condo in King West', city: 'Toronto', state: 'Canada', price: 8200000, type: 'sale', propertyType: 'condo', sqft: 680, beds: 1, baths: 1, lat: 43.644, lng: -79.395 },
    { title: '🌍 Brickell Financial Sky Apartment', city: 'Miami', state: 'United States', price: 8900000, type: 'sale', propertyType: 'condo', sqft: 740, beds: 1, baths: 1.5, lat: 25.761, lng: -80.191 },
    { title: '🌍 Champs-Élysées Chic Apartment', city: 'Paris', state: 'France', price: 9800000, type: 'sale', propertyType: 'apartment', sqft: 550, beds: 1, baths: 1, lat: 48.869, lng: 2.307 },
  ];

  budget50LTo1CrData.forEach((bProp, idx) => {
    const mainImgs = imgPools[bProp.propertyType === 'villa' ? 'villa' : 'apartment'];
    const mainImgUrl = mainImgs[idx % mainImgs.length];
    const interiorImgUrl = imgPools.interior[(idx + 2) % imgPools.interior.length];

    propertiesToInsert.push({
      ownerId: ownerIds[idx % 2],
      title: `${bProp.city === 'Dubai' || bProp.state === 'Indonesia' || bProp.state === 'United Kingdom' || bProp.state === 'Japan' || bProp.state === 'Australia' || bProp.state === 'Canada' || bProp.state === 'United States' || bProp.state === 'France' || bProp.state === 'Singapore' ? '' : '🏡 '}${bProp.title}`,
      description: `Premium property priced between ₹50 Lakhs and ₹1 Crore in prime ${bProp.city} (${bProp.state}). Features luxury fittings, swimming pool access, smart home automation, high ceiling heights, and prime locality investment appreciation.`,
      type: bProp.type,
      propertyType: bProp.propertyType,
      price: bProp.price,
      address: `Suite #${idx + 51}, ${bProp.title.split(' in ')[1] || bProp.city}`,
      city: bProp.city,
      state: bProp.state,
      zip: `4000${(idx % 5) + 1}`,
      latitude: bProp.lat,
      longitude: bProp.lng,
      sizeSqft: bProp.sqft,
      bedrooms: bProp.beds,
      bathrooms: bProp.baths,
      amenities: JSON.stringify(['Swimming Pool', 'Gym', 'Clubhouse', 'Smart Home Automation', '24/7 CCTV Security', 'Private Elevator'].slice(0, 5)),
      status: 'available',
      verifiedStatus: 'verified',
      featured: idx % 3 === 0,
      media: {
        create: [
          { mediaUrl: mainImgUrl, type: 'image', caption: `${bProp.title} Prime Facade` },
          { mediaUrl: interiorImgUrl, type: 'image', caption: 'Luxury Living & Dining Room' },
          { mediaUrl: tour360Url, type: 'tour360', caption: 'Interactive 360° Virtual Tour' },
        ],
      },
    });
  });

  console.log(`Inserting ${propertiesToInsert.length} realistic global & Indian properties...`);

  // Insert properties sequentially
  for (const prop of propertiesToInsert) {
    await prisma.property.create({ data: prop });
  }

  console.log(`Seeded database successfully with ${propertiesToInsert.length} properties across 21 Global & Indian metro cities!`);
}

main()
  .catch((e) => {
    console.error('Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
