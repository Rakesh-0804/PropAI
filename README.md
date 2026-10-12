# PropAI Estate - AI-Powered Real Estate Platform

**PropAI Estate** is an end-to-end, AI-powered real estate ecosystem connecting buyers, sellers, agents, and administrators with automated valuation, preference match scoring, 360° virtual tours, mortgage calculation, and fraud-resistant listings.

---

## 🌟 Key Features

### 1. 🤖 AI Property Match Engine & NLP Search
- Natural language semantic property search across metro locations.
- Buyer preference vector matching (0–100%) factoring in budget, BHK, location, amenities, and property types.
- Curated AI property recommendation feed with transparent match reasoning.

### 2. 📊 Automated Financial Underwriting & Valuation Microservice
- **Smart Price Estimation**: Valuation algorithms with city-specific per-sqft baseline rates, type multipliers, and confidence scoring.
- **Lender-Grade Underwriting**: Automated Net Operating Income (NOI), Capitalization Rate (Cap Rate), Debt Service Coverage Ratio (DSCR), Cash-on-Cash Return, and 10-Year Compounded Internal Rate of Return (IRR).
- **Comprehensive EMI & Investment Calculator**: Calculates monthly mortgage EMIs, Loan-to-Value (LTV %), gross/net rental yields, and net monthly cash flow.

### 3. 🛡️ Legal Title Due Diligence & Fraud Protection
- 30-year title search records, Encumbrance Certificate (EC) tracking, and RERA registration validation.
- Duplicate and fake listing detection algorithms for verified marketplace integrity.

### 4. 🔑 Smart Lock Digital PIN Keys & Self-Guided Tours
- IoT Smart Lock integration (Yale / Seam Gateway) generating single-use access PINs for confirmed site visits.
- Real-time door status indicators and self-guided tour management.

### 5. 👥 Role-Based Portals & Command Centers
- **Buyer Command Center**: Purchasing power simulator (FOIR / DTI ratios), live offer & counteroffer negotiation tracker, pre-approved bank mortgage offers (HDFC, SBI, ICICI), and neighborhood livability index.
- **Seller Portal**: Active listing portfolio, pricing radar, and **Recently Sold Properties & Buyer Records** (transaction metadata, financing methods, deed status, and smart lock handover PINs).
- **Admin Dashboard**: System audit logs, verification queue, and market analytics.
- **AGY Real Estate AI Concierge**: 24/7 floating multimodal chatbot assistant for instant queries.

---

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router, Server Components & Client Components)
- **Language**: TypeScript
- **Styling**: Tailwind CSS with custom Glassmorphism UI Dark Theme
- **Icons**: Lucide React
- **ORM & Database**: Prisma with PostgreSQL (Neon) & SQLite compatibility
- **Charts & Visualization**: Recharts
- **Virtual Tours**: Pannellum 360° Panorama Viewer

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18.x or higher
- npm or yarn

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Rakesh-0804/PropAI.git
   cd PropAI
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env` file in the root directory:
   ```env
   DATABASE_URL="postgresql://username:password@host/neondb?sslmode=require"
   JWT_SECRET="propai-real-estate-secret-jwt-key-2026"
   ```

4. **Initialize Database**:
   ```bash
   npx prisma db push
   npx prisma db seed
   ```

5. **Start Development Server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔐 Demo Credentials

| Role | Email | Password |
|---|---|---|
| **Buyer** | `buyer@example.com` | `password123` |
| **Seller** | `seller@example.com` | `password123` |
| **Agent** | `agent@example.com` | `password123` |
| **Admin** | `admin@example.com` | `password123` |

---

## 📄 License
This project is licensed under the MIT License.