export interface PurchasingPowerInput {
  annualIncome: number;
  monthlyDebt: number;
  downPaymentSavings: number;
  creditTier: 'excellent' | 'good' | 'fair';
}

export interface PurchasingPowerResult {
  maxPropertyPrice: number;
  maxLoanAmount: number;
  estimatedMonthlyMortgage: number;
  recommendedDownPayment: number;
  estimatedInterestRate: number;
  dtiRatio: number; // Back-end Debt to Income / FOIR %
  frontEndDti: number; // Front-end Housing to Income %
  eligibilityScore: number; // 0-100
  eligibilityStatus: 'Excellent' | 'Good' | 'Moderate' | 'High Risk';
  breakdown: {
    monthlyGrossIncome: number;
    maxAllowedMonthlyHousing: number;
    propertyTaxEstimate: number;
    homeInsuranceEstimate: number;
  };
}

export function calculatePurchasingPower(input: PurchasingPowerInput): PurchasingPowerResult {
  const annualIncome = Math.max(0, Number(input.annualIncome) || 0);
  const monthlyDebt = Math.max(0, Number(input.monthlyDebt) || 0);
  const downPaymentSavings = Math.max(0, Number(input.downPaymentSavings) || 0);

  const monthlyGrossIncome = Math.max(1000, annualIncome / 12);
  const creditRateMap = {
    excellent: 8.50,
    good: 8.85,
    fair: 9.50,
  };
  const interestRate = creditRateMap[input.creditTier] || 8.85;

  // Standard Banking Underwriting Rules:
  // Maximum FOIR (Fixed Obligation to Income Ratio) = 50% of monthly gross income
  // Maximum Housing Budget = 40% of monthly gross income
  const maxHousingBudget = monthlyGrossIncome * 0.40;
  const maxTotalDebtBudget = Math.max(0, (monthlyGrossIncome * 0.50) - monthlyDebt);
  const effectiveMonthlyHousingBudget = Math.max(2000, Math.min(maxHousingBudget, maxTotalDebtBudget));

  // Estimate Tax + Maintenance (~15% of total monthly allocation)
  const netMortgagePrincipalInterestBudget = effectiveMonthlyHousingBudget * 0.85;

  // Calculate maximum loan principal backed by 20-year fixed loan (240 months)
  const totalMonths = 240;
  let maxLoanAmount = 0;

  if (interestRate <= 0) {
    maxLoanAmount = Math.round(netMortgagePrincipalInterestBudget * totalMonths);
  } else {
    const monthlyInterestRate = (interestRate / 100) / 12;
    const compoundFactor = Math.pow(1 + monthlyInterestRate, totalMonths);
    maxLoanAmount = Math.round(
      (netMortgagePrincipalInterestBudget * (compoundFactor - 1)) /
        (monthlyInterestRate * compoundFactor)
    );
  }

  maxLoanAmount = Math.max(0, maxLoanAmount);
  const maxPropertyPrice = Math.round(maxLoanAmount + downPaymentSavings);

  // Calculate DTI / FOIR ratios
  const frontEndDti = Number(((effectiveMonthlyHousingBudget / monthlyGrossIncome) * 100).toFixed(1));
  const dtiRatio = Number((((effectiveMonthlyHousingBudget + monthlyDebt) / monthlyGrossIncome) * 100).toFixed(1));

  // Eligibility score logic
  let eligibilityScore = 65;
  if (input.creditTier === 'excellent') eligibilityScore += 15;
  else if (input.creditTier === 'good') eligibilityScore += 8;

  if (dtiRatio <= 36) eligibilityScore += 15;
  else if (dtiRatio <= 45) eligibilityScore += 8;
  else if (dtiRatio > 55) eligibilityScore -= 15;

  const downPaymentPercent = maxPropertyPrice > 0 ? (downPaymentSavings / maxPropertyPrice) * 100 : 0;
  if (downPaymentPercent >= 20) eligibilityScore += 10;
  else if (downPaymentPercent >= 10) eligibilityScore += 5;

  eligibilityScore = Math.min(99, Math.max(30, eligibilityScore));

  let eligibilityStatus: 'Excellent' | 'Good' | 'Moderate' | 'High Risk' = 'Good';
  if (eligibilityScore >= 88) eligibilityStatus = 'Excellent';
  else if (eligibilityScore >= 72) eligibilityStatus = 'Good';
  else if (eligibilityScore >= 55) eligibilityStatus = 'Moderate';
  else eligibilityStatus = 'High Risk';

  return {
    maxPropertyPrice,
    maxLoanAmount,
    estimatedMonthlyMortgage: Math.round(effectiveMonthlyHousingBudget),
    recommendedDownPayment: Math.round(downPaymentSavings),
    estimatedInterestRate: interestRate,
    dtiRatio,
    frontEndDti,
    eligibilityScore,
    eligibilityStatus,
    breakdown: {
      monthlyGrossIncome: Math.round(monthlyGrossIncome),
      maxAllowedMonthlyHousing: Math.round(effectiveMonthlyHousingBudget),
      propertyTaxEstimate: Math.round((maxPropertyPrice * 0.005) / 12),
      homeInsuranceEstimate: Math.round((maxPropertyPrice * 0.002) / 12),
    },
  };
}

export function buildComparisonMatrix(properties: any[]) {
  return properties.map((p) => {
    const price = Math.max(100000, Number(p.price) || 100000);
    const sizeSqft = Math.max(100, Number(p.sizeSqft) || 1000);
    const pricePerSqft = Math.round(price / sizeSqft);

    // Calculate dynamic rent estimate based on property type & size
    const rentYieldFactor = p.type === 'rent' ? 1.0 : (p.propertyType === 'villa' ? 0.0032 : 0.0038);
    const monthlyRent = p.expectedRent || (p.type === 'rent' ? price : Math.round(price * rentYieldFactor));
    
    // Net Operating Income (78% net after taxes & maintenance)
    const annualNoi = monthlyRent * 12 * 0.78;
    const estimatedCapRate = Number(((annualNoi / price) * 100).toFixed(2));

    // 10-Yr Compounded ROI based on city appreciation rate + rental yield
    const cityAppreciationMap: Record<string, number> = {
      'Bangalore': 8.5,
      'Mumbai': 7.2,
      'Delhi NCR': 8.0,
      'Gurgaon': 9.2,
      'Hyderabad': 9.0,
      'Pune': 7.8,
    };
    const annualAppreciation = cityAppreciationMap[p.city] || 7.5;
    const totalAnnualYield = estimatedCapRate + annualAppreciation;
    
    // 10-Year Compounded total return estimate
    const estimated10YrReturn = Number((Math.pow(1 + (totalAnnualYield / 100), 10) * 100 - 100).toFixed(1));

    let locationScore = 82;
    if (['Bangalore', 'Mumbai', 'Delhi NCR', 'Hyderabad', 'Gurgaon'].includes(p.city)) locationScore += 12;
    else if (['Pune', 'Chennai', 'Noida', 'Kolkata'].includes(p.city)) locationScore += 8;
    locationScore = Math.min(99, locationScore);

    return {
      id: p.id,
      title: p.title,
      price,
      city: p.city,
      sizeSqft,
      bedrooms: p.bedrooms || 2,
      bathrooms: p.bathrooms || 2,
      pricePerSqft,
      estimatedCapRate,
      estimated10YrReturn,
      locationScore,
      matchScore: p.matchScore || Math.floor(84 + (locationScore % 12)),
      image: p.media?.[0]?.mediaUrl || 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750',
    };
  });
}
