export interface CopyGenInput {
  title: string;
  city: string;
  propertyType: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  sizeSqft: number;
  amenities: string[];
  tone: 'luxury' | 'modern' | 'family' | 'investor';
}

export function generateListingCopy(input: CopyGenInput): string {
  const priceFormatted = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(input.price);
  const amenitiesList = input.amenities.length > 0 ? input.amenities.join(', ') : 'premium amenities';

  switch (input.tone) {
    case 'luxury':
      return `Welcome to ${input.title}, an extraordinary ${input.propertyType} offering uncompromised luxury in the heart of ${input.city}. Spanning over ${input.sizeSqft.toLocaleString()} sq. ft. of meticulously crafted living space, this masterpiece features ${input.bedrooms} opulent bedrooms and ${input.bathrooms} designer baths. Every detail exudes sophistication, seamlessly connecting grand open-concept interiors with ${amenitiesList}. Offered at ${priceFormatted}, this residence defines elite coastal and urban living for the discerning buyer.`;

    case 'modern':
      return `Sleek, architectural, and fully connected—${input.title} represents the pinnacle of modern design in ${input.city}. Designed with floor-to-ceiling glass, ultra-clean lines, and integrated smart home automation, this ${input.sizeSqft.toLocaleString()} sq. ft. ${input.propertyType} offers ${input.bedrooms} bedrooms and ${input.bathrooms} baths. Enjoy high-efficiency living complemented by ${amenitiesList}. Priced competitively at ${priceFormatted}, this property is ready for immediate luxury occupancy.`;

    case 'family':
      return `Find your forever home at ${input.title}! Situated in a premier, quiet neighborhood of ${input.city}, this charming ${input.propertyType} features ${input.bedrooms} spacious bedrooms, ${input.bathrooms} full baths, and ${input.sizeSqft.toLocaleString()} sq. ft. of versatile family living space. The sun-drenched floor plan flows effortlessly into private outdoor areas and offers ${amenitiesList}. Located near top-rated school districts and parks, this exceptional property is offered at ${priceFormatted}.`;

    case 'investor':
      return `HIGH-YIELD INVESTMENT OPPORTUNITY: ${input.title} in prime ${input.city}. This ${input.sizeSqft.toLocaleString()} sq. ft. ${input.propertyType} delivers exceptional fundamentals with ${input.bedrooms} bedrooms, ${input.bathrooms} baths, and ${amenitiesList}. Positioned in a high-demand rental corridor with strong historical capital appreciation. Listed at ${priceFormatted}, projecting a strong Cap Rate and immediate net positive cash flow for investor portfolios.`;

    default:
      return `${input.title} is a stunning ${input.propertyType} located in ${input.city}. Featuring ${input.bedrooms} beds, ${input.bathrooms} baths, and ${input.sizeSqft.toLocaleString()} sqft of prime space. Amenities include ${amenitiesList}. Priced at ${priceFormatted}.`;
  }
}
