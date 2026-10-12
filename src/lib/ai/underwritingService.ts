import { db } from '@/lib/db';
import { UnderwritingReportData, CashFlowYear, MacroTrends, TaxHistoryRecord } from '@/types';

export interface UnderwritingInputOptions {
  propertyId: string;
  userId?: string;
  purchasePrice?: number;
  expectedRent?: number;
  downPaymentPercent?: number; // e.g. 20 (for 20%)
  interestRate?: number;       // e.g. 8.5 (for 8.5%)
  vacancyRate?: number;        // e.g. 5 (for 5%)
}

export async function generateUnderwritingReport(options: UnderwritingInputOptions): Promise<UnderwritingReportData> {
  const property = await db.property.findUnique({
    where: { id: options.propertyId },
  });

  if (!property) {
    throw new Error('Property not found');
  }

  const rawPrice = options.purchasePrice || property.price || 15000000;
  const purchasePrice = Math.max(100000, Number(rawPrice) || 15000000);

  // Estimate monthly rent if not provided: ~0.38% of property price for Indian rental yield, or actual price for rent
  const estimatedMonthlyRent = Math.max(0, options.expectedRent || 
    (property.type === 'rent' ? property.price : Math.round(purchasePrice * 0.0038)));

  const downPaymentPct = Math.min(90, Math.max(0, options.downPaymentPercent ?? 20));
  const interestRatePct = Math.min(30, Math.max(0, options.interestRate ?? 8.5));
  const vacancyRatePct = Math.min(50, Math.max(0, options.vacancyRate ?? 5.0));

  // Financial calculations
  const grossAnnualRent = estimatedMonthlyRent * 12;
  const vacancyLoss = grossAnnualRent * (vacancyRatePct / 100);
  const effectiveGrossIncome = grossAnnualRent - vacancyLoss;

  // Operating Expenses (Tax, Insurance, Maintenance, HOA, Mgmt fee)
  const annualTax = purchasePrice * 0.012; // 1.2% tax rate
  const annualInsurance = purchasePrice * 0.004; // 0.4% insurance
  const maintenanceCost = effectiveGrossIncome * 0.08; // 8% maintenance
  const mgmtFee = effectiveGrossIncome * 0.06; // 6% management fee
  const totalOperatingExpenses = annualTax + annualInsurance + maintenanceCost + mgmtFee;

  // Net Operating Income (NOI)
  const noi = Math.round(effectiveGrossIncome - totalOperatingExpenses);

  // Capitalization Rate (Cap Rate)
  const capRate = Number(((noi / purchasePrice) * 100).toFixed(2));

  // Mortgage & Debt Service
  const downPaymentAmount = purchasePrice * (downPaymentPct / 100);
  const loanAmount = Math.max(0, purchasePrice - downPaymentAmount);
  const monthlyInterestRate = (interestRatePct / 100) / 12;
  const totalPayments = 30 * 12; // 30-year fixed loan

  let monthlyMortgagePayment = 0;
  if (loanAmount > 0) {
    if (interestRatePct <= 0) {
      monthlyMortgagePayment = loanAmount / totalPayments;
    } else {
      const compoundFactor = Math.pow(1 + monthlyInterestRate, totalPayments);
      monthlyMortgagePayment = (loanAmount * monthlyInterestRate * compoundFactor) / (compoundFactor - 1);
    }
  }

  const annualDebtService = Math.round(monthlyMortgagePayment * 12);

  // Debt Service Coverage Ratio (DSCR)
  const dscr = annualDebtService > 0 ? Number((noi / annualDebtService).toFixed(2)) : (noi > 0 ? 9.99 : 0);

  // Net Cash Flow (Year 1)
  const netCashFlowYear1 = noi - annualDebtService;

  // Cash on Cash Return
  const initialInvestment = Math.max(1000, downPaymentAmount + (purchasePrice * 0.03)); // down payment + closing costs
  const cashOnCashReturn = Number(((netCashFlowYear1 / initialInvestment) * 100).toFixed(2));

  // 10-Year Cash Flow & Equity Projections
  const projections: CashFlowYear[] = [];
  const rentGrowthRate = 0.035; // 3.5% annual rent growth
  const expenseAppreciationRate = 0.025; // 2.5% expense inflation
  const propertyAppreciationRate = 0.04; // 4.0% annual property value growth

  let currentRent = grossAnnualRent;
  let currentExpenses = totalOperatingExpenses;
  let currentPropertyValue = purchasePrice;
  let remainingLoanBalance = loanAmount;

  for (let year = 1; year <= 10; year++) {
    const yrVacancy = currentRent * (vacancyRatePct / 100);
    const yrEGI = currentRent - yrVacancy;
    const yrNOI = yrEGI - currentExpenses;
    const yrNetCashFlow = Math.round(yrNOI - annualDebtService);

    // Calculate remaining principal after 1 year of payments
    for (let m = 0; m < 12; m++) {
      if (remainingLoanBalance > 0) {
        const interestPaid = remainingLoanBalance * monthlyInterestRate;
        const principalPaid = Math.min(remainingLoanBalance, monthlyMortgagePayment - interestPaid);
        remainingLoanBalance = Math.max(0, remainingLoanBalance - principalPaid);
      }
    }

    currentPropertyValue = Math.round(currentPropertyValue * (1 + propertyAppreciationRate));
    const equity = Math.round(currentPropertyValue - remainingLoanBalance);

    projections.push({
      year,
      grossRent: Math.round(currentRent),
      vacancyLoss: Math.round(yrVacancy),
      effectiveGrossIncome: Math.round(yrEGI),
      operatingExpenses: Math.round(currentExpenses),
      noi: Math.round(yrNOI),
      debtService: annualDebtService,
      netCashFlow: yrNetCashFlow,
      propertyValue: currentPropertyValue,
      equity,
    });

    // Advance rates for next year
    currentRent *= (1 + rentGrowthRate);
    currentExpenses *= (1 + expenseAppreciationRate);
  }

  // Internal Rate of Return (IRR) calculation estimate
  const totalReturn10Y = projections[9].equity + projections.reduce((acc, p) => acc + p.netCashFlow, 0) - initialInvestment;
  const netMultiplier = (initialInvestment + totalReturn10Y) / initialInvestment;
  
  let irr = 0;
  if (netMultiplier > 0) {
    irr = Number(((Math.pow(netMultiplier, 1 / 10) - 1) * 100).toFixed(2));
  } else {
    irr = Number((((netMultiplier - 1) / 10) * 100).toFixed(2));
  }
  irr = Number(Math.min(999.9, Math.max(-99.9, irr)).toFixed(2));

  // Public Tax Records History (5-year simulation based on property location)
  const currentYear = new Date().getFullYear();
  const taxHistory: TaxHistoryRecord[] = [];
  let baseAssessed = purchasePrice * 0.85;

  for (let i = 4; i >= 0; i--) {
    const yr = currentYear - i;
    const yrAssessed = Math.round(baseAssessed * Math.pow(1.03, 4 - i));
    taxHistory.push({
      year: yr,
      assessedValue: yrAssessed,
      taxPaid: Math.round(yrAssessed * 0.0125),
      landValue: Math.round(yrAssessed * 0.35),
      buildingValue: Math.round(yrAssessed * 0.65),
    });
  }

  // Macro Trends aggregation
  const macroTrends: MacroTrends = {
    mortgageRateTrend: interestRatePct,
    inflationRate: 2.8,
    areaGrowthRate: 4.5,
    rentalYieldIndex: Number(((grossAnnualRent / purchasePrice) * 100).toFixed(1)),
    marketSentiment: capRate > 6.0 ? 'Bullish' : capRate > 4.5 ? 'Neutral' : 'Bearish',
  };

  // Upsert UnderwritingReport into DB
  const createdReport = await db.underwritingReport.create({
    data: {
      propertyId: options.propertyId,
      userId: options.userId || null,
      purchasePrice,
      expectedRent: estimatedMonthlyRent,
      downPaymentPercent: downPaymentPct,
      interestRate: interestRatePct,
      vacancyRate: vacancyRatePct,
      noi,
      capRate,
      dscr,
      cashOnCashReturn,
      irr,
      projectionDataJson: JSON.stringify(projections),
      macroTrendsJson: JSON.stringify(macroTrends),
      taxHistoryJson: JSON.stringify(taxHistory),
    },
  });

  return {
    id: createdReport.id,
    propertyId: createdReport.propertyId,
    userId: createdReport.userId,
    purchasePrice,
    expectedRent: estimatedMonthlyRent,
    downPaymentPercent: downPaymentPct,
    interestRate: interestRatePct,
    vacancyRate: vacancyRatePct,
    noi,
    capRate,
    dscr,
    cashOnCashReturn,
    irr,
    projections,
    macroTrends,
    taxHistory,
    createdAt: createdReport.createdAt.toISOString(),
  };
}

export async function getUnderwritingReportForProperty(propertyId: string): Promise<UnderwritingReportData | null> {
  const record = await db.underwritingReport.findFirst({
    where: { propertyId },
    orderBy: { createdAt: 'desc' },
  });

  if (!record) {
    return null;
  }

  return {
    id: record.id,
    propertyId: record.propertyId,
    userId: record.userId,
    purchasePrice: record.purchasePrice,
    expectedRent: record.expectedRent,
    downPaymentPercent: record.downPaymentPercent,
    interestRate: record.interestRate,
    vacancyRate: record.vacancyRate,
    noi: record.noi,
    capRate: record.capRate,
    dscr: record.dscr,
    cashOnCashReturn: record.cashOnCashReturn,
    irr: record.irr,
    projections: JSON.parse(record.projectionDataJson),
    macroTrends: JSON.parse(record.macroTrendsJson),
    taxHistory: JSON.parse(record.taxHistoryJson),
    createdAt: record.createdAt.toISOString(),
  };
}
