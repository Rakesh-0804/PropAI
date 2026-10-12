import { NextRequest, NextResponse } from 'next/server';
import { getUnderwritingReportForProperty, generateUnderwritingReport } from '@/lib/ai/underwritingService';
import { db } from '@/lib/db';
import { formatINR } from '@/types';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { propertyId, reportId } = body;

    if (!propertyId) {
      return NextResponse.json({ error: 'propertyId is required' }, { status: 400 });
    }

    const property = await db.property.findUnique({
      where: { id: propertyId },
    });

    if (!property) {
      return NextResponse.json({ error: 'Property not found' }, { status: 404 });
    }

    let report = await getUnderwritingReportForProperty(propertyId);
    if (!report) {
      report = await generateUnderwritingReport({ propertyId });
    }

    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Underwriting Report - ${property.title}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; color: #111827; margin: 0; padding: 40px; background: #fff; }
    .header { border-bottom: 2px solid #2563EB; padding-bottom: 20px; margin-bottom: 30px; display: flex; justify-content: space-between; align-items: flex-start; }
    .brand { font-size: 24px; font-weight: 800; color: #2563EB; letter-spacing: -0.5px; }
    .doc-title { font-size: 14px; font-weight: 600; text-transform: uppercase; color: #6B7280; letter-spacing: 1px; }
    .property-title { font-size: 26px; font-weight: 800; margin-top: 10px; }
    .property-addr { font-size: 14px; color: #4B5563; }
    .kpi-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 30px; }
    .kpi-card { background: #F8FAFC; border: 1px solid #E2E8F0; padding: 16px; border-radius: 8px; }
    .kpi-label { font-size: 12px; font-weight: 600; color: #64748B; text-transform: uppercase; }
    .kpi-val { font-size: 22px; font-weight: 800; color: #0F172A; margin-top: 4px; }
    .kpi-sub { font-size: 11px; color: #10B981; margin-top: 2px; }
    table { width: 100%; border-collapse: collapse; margin-top: 20px; font-size: 13px; }
    th { background: #F1F5F9; font-weight: 700; text-align: left; padding: 10px; border: 1px solid #CBD5E1; color: #334155; }
    td { padding: 10px; border: 1px solid #E2E8F0; color: #1E293B; }
    tr:nth-child(even) { background: #F8FAFC; }
    .section-header { font-size: 18px; font-weight: 700; border-bottom: 1px solid #E2E8F0; padding-bottom: 8px; margin-top: 30px; margin-bottom: 15px; color: #1E293B; }
    .footer { margin-top: 50px; border-top: 1px solid #E2E8F0; padding-top: 15px; font-size: 11px; color: #94A3B8; text-align: center; }
  </style>
</head>
<body>
  <div class="header">
    <div>
      <div class="brand">Antigravity Real Estate Analytics</div>
      <div class="property-title">${property.title}</div>
      <div class="property-addr">${property.address}, ${property.city}, ${property.state} ${property.zip}</div>
    </div>
    <div style="text-align: right;">
      <div class="doc-title">Automated Underwriting Report</div>
      <div style="font-size: 12px; color: #6B7280; margin-top: 4px;">Date: ${new Date().toLocaleDateString()}</div>
      <div style="font-size: 12px; color: #2563EB; font-weight: 600;">Status: Lender Approved</div>
    </div>
  </div>

  <div class="section-header">Financial Underwriting Executive Summary</div>
  <div class="kpi-grid">
    <div class="kpi-card">
      <div class="kpi-label">Net Operating Income (NOI)</div>
      <div class="kpi-val">${formatINR(report.noi)}</div>
      <div class="kpi-sub">Annual Net Cash Yield</div>
    </div>
    <div class="kpi-card">
      <div class="kpi-label">Capitalization Rate</div>
      <div class="kpi-val">${report.capRate}%</div>
      <div class="kpi-sub">Fair Market Cap Rate</div>
    </div>
    <div class="kpi-card">
      <div class="kpi-label">Debt Coverage (DSCR)</div>
      <div class="kpi-val">${report.dscr}x</div>
      <div class="kpi-sub">Strong Debt Coverage</div>
    </div>
    <div class="kpi-card">
      <div class="kpi-label">10-Year Estimated IRR</div>
      <div class="kpi-val">${report.irr}%</div>
      <div class="kpi-sub">Internal Rate of Return</div>
    </div>
  </div>

  <div class="section-header">Property & Loan Parameters</div>
  <table>
    <tr>
      <td><strong>Purchase Price:</strong> ${formatINR(report.purchasePrice)}</td>
      <td><strong>Expected Monthly Rent:</strong> ${formatINR(report.expectedRent)}/mo</td>
    </tr>
    <tr>
      <td><strong>Down Payment:</strong> ${report.downPaymentPercent}% (${formatINR(report.purchasePrice * (report.downPaymentPercent/100))})</td>
      <td><strong>Mortgage Rate:</strong> ${report.interestRate}% (20-Yr Home Loan)</td>
    </tr>
    <tr>
      <td><strong>Vacancy Allowance:</strong> ${report.vacancyRate}%</td>
      <td><strong>Cash on Cash Return:</strong> ${report.cashOnCashReturn}%</td>
    </tr>
  </table>

  <div class="section-header">10-Year Projections & Investment Cash Flows</div>
  <table>
    <thead>
      <tr>
        <th>Year</th>
        <th>Gross Rent</th>
        <th>Operating Expenses</th>
        <th>Net Operating Income (NOI)</th>
        <th>Annual Debt Service</th>
        <th>Net Cash Flow</th>
        <th>Est. Property Value</th>
        <th>Total Equity</th>
      </tr>
    </thead>
    <tbody>
      ${report.projections.map((p) => `
        <tr>
          <td>Year ${p.year}</td>
          <td>${formatINR(p.grossRent)}</td>
          <td>${formatINR(p.operatingExpenses)}</td>
          <td>${formatINR(p.noi)}</td>
          <td>${formatINR(p.debtService)}</td>
          <td>${formatINR(p.netCashFlow)}</td>
          <td>${formatINR(p.propertyValue)}</td>
          <td>${formatINR(p.equity)}</td>
        </tr>
      `).join('')}
    </tbody>
  </table>

  <div class="section-header">Public Tax Records & Historical Assessment</div>
  <table>
    <thead>
      <tr>
        <th>Tax Year</th>
        <th>Assessed Value</th>
        <th>Land Value</th>
        <th>Building Value</th>
        <th>Tax Amount Paid</th>
      </tr>
    </thead>
    <tbody>
      ${report.taxHistory.map((t) => `
        <tr>
          <td>${t.year}</td>
          <td>${formatINR(t.assessedValue)}</td>
          <td>${formatINR(t.landValue)}</td>
          <td>${formatINR(t.buildingValue)}</td>
          <td>${formatINR(t.taxPaid)}</td>
        </tr>
      `).join('')}
    </tbody>
  </table>

  <div class="footer">
    This automated underwriting report was generated by Antigravity Real Estate Platform ML Valuation Microservice.
    Confidential - Intended for mortgage lenders and qualified investors.
  </div>
</body>
</html>
    `;

    return NextResponse.json({
      success: true,
      html: htmlContent,
      filename: `Underwriting-Report-${property.title.replace(/[^a-zA-Z0-9]/g, '_')}.html`,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to generate PDF underwriting report' }, { status: 500 });
  }
}
