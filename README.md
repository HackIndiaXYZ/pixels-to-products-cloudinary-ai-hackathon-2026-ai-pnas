# AI-PNAS: AI Powered Pediatric Nutritional Assessment System

![Status](https://img.shields.io/badge/Status-Production%20Ready-brightgreen)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue)
![Next.js](https://img.shields.io/badge/Next.js-16.2-black)
![License](https://img.shields.io/badge/License-MIT-green)

## 🔗 Live Links

- 🌐 **Live Project**: [https://shopsnap-one.vercel.app/](https://shopsnap-one.vercel.app/)
- 🎬 **Project Demo**: [https://shopsnap-demo.vercel.app/](https://shopsnap-demo.vercel.app/)

## Overview

**AI-PNAS** is a production-ready full-stack healthcare web application designed to detect and classify child malnutrition using WHO anthropometric standards and AI-powered decision logic.

The system serves:
- 🏥 **Health Professionals** - Clinical nutritionists, pediatricians
- 👨‍👩‍👧 **Parents** - Non-professionals seeking health guidance
- 👷 **Community Health Workers** - Field-based nutrition assessors
- 🌍 **Rural Users** - Low-resource settings with limited connectivity

## 🏆 Hackathon Details
- **Track**: Track 1 *(Please update if you selected Track 2 or 3)*
- **The Problem**: Early detection of child malnutrition (SAM/MAM) in low-resource settings relies heavily on disjointed paper records and subjective visual assessments. Healthcare workers lack an integrated system to accurately store, track, and visually verify severe cases.

## ☁️ How We Used Cloudinary
Cloudinary is deeply integrated into the core workflow of AI-PNAS to handle crucial visual assessments. 
- **Child Photo Upload Widget**: We integrated `next-cloudinary`'s `CldUploadWidget` directly into our child registration form. This allows healthcare workers on the field to securely upload photos of children for facial assessment, visual wasting verification, and medical record keeping.
- **Dynamic Optimization**: The uploaded images are served via Cloudinary's secure URLs, ensuring bandwidth-optimized delivery for low-connectivity rural clinics.

## 📖 How It Works (User Guide)

New to AI-PNAS? Follow these steps to use the app. No installation is needed: just open the [live project](https://shopsnap-one.vercel.app/) in your browser (phone, tablet, or computer). You can also watch the [demo](https://shopsnap-demo.vercel.app/) first.

### Step 1: Open the Dashboard
When the app opens, you land on the **Dashboard**. It shows statistics and a list of all children registered so far. If you are a first-time user, the list will be empty.

### Step 2: Choose Your Language
Use the language switcher to select **English** or **Amharic**. The interface updates instantly and uses simple wording for low-literacy users.

### Step 3: Register a Child
1. Click **Register Child**.
2. Enter the child's basic details: **name, age (in months), and sex**.
3. Enter the measurements:
   - **Weight** (kg)
   - **Height** (cm)
   - **MUAC** - Mid-Upper Arm Circumference (cm), measured around the middle of the child's left upper arm
   - *(Optional)* Head and chest circumference
4. Click **Upload Photo** to take or select a photo of the child. The photo is stored securely with Cloudinary and helps with visual verification of wasting.
5. Click **Submit**.

### Step 4: Get the Instant Analysis
After you submit, the system automatically analyzes the measurements using WHO standards and shows:
- **Nutrition status**: SAM (Severe), MAM (Moderate), or Normal, based on MUAC
- **BMI** and its classification
- **Risk level**: Low, Medium, or High, shown with color coding
- **Medical recommendations** for the next steps
- **Referral suggestion**: hospital, clinic, or community program

### Step 5: Understand the Result

| Result | Meaning | What To Do |
|--------|---------|------------|
| 🔴 **SAM** (MUAC < 11.5 cm) | Severe Acute Malnutrition, high risk | **Urgent**: therapeutic feeding and hospital referral |
| 🟠 **MAM** (MUAC 11.5-12.5 cm) | Moderate Acute Malnutrition, medium risk | Enroll in a supplementary feeding program |
| 🟢 **Normal** (MUAC > 12.5 cm) | Healthy nutrition status, low risk | Routine follow-up and regular check-ups |

### Step 6: Track and Review Children
- Return to the **Dashboard** at any time to see every registered child.
- Use the **risk level filter** to quickly find High-risk children who need urgent attention.
- Click any child to open their **detailed profile**, which shows their measurements, analysis, recommendations, and uploaded photo.

> ⚠️ **Note**: AI-PNAS is a screening and decision-support tool. It does not replace a clinical diagnosis. Always confirm serious cases with a qualified health professional.

### 1. Child Registration System
- Collect anthropometric measurements (age, weight, height, MUAC)
- **Cloudinary Image Upload**: Direct photo capture and storage for visual diagnosis.
- Optional head and chest circumference
- Secure data storage with Prisma ORM
- Validation and error handling

### 2. WHO Nutrition Analysis Engine
- **MUAC Classification**: SAM (< 11.5cm) / MAM (11.5-12.5cm) / Normal
- **BMI Calculation & Classification**
- **Risk Level Assessment** (Low/Medium/High)
- **Medical Recommendations** based on WHO standards
- **Referral Suggestions** (hospital/clinic/community)

### 3. Dashboard System
- View all registered children
- Statistics dashboard
- Filter by risk level
- Color-coded risk indicators

### 4. REST API
- POST /api/register-child - Register and analyze
- POST /api/analyze-nutrition - Re-analyze
- GET /api/children - List all
- GET /api/child/[id] - Get details

### 5. Multilingual Support
- English + Amharic
- Easy language switching
- Simple UI for low-literacy users

## 🚀 Quick Start

```bash
# Navigate to project
cd aipnas-web

# Install dependencies
npm install

# Setup environment variables
# Create a .env.local file in the root and add your Cloudinary Cloud Name:
# NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 🧪 How to Test It

1. **Setup**: Follow the Quick Start steps above to run the app locally. Make sure your `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` is set in `.env.local`.
2. **Dashboard**: Navigate to `http://localhost:3000` to see the live statistics and registered children.
3. **Register a Child**: Click "Register Child". Fill in the anthropometric details.
4. **Cloudinary Upload**: On the first step of registration, click the "Upload Photo" button to test the Cloudinary Upload Widget integration.
5. **Analyze Result**: Complete the registration to see the AI generate a WHO-standardized malnutrition risk classification.
6. **View Profile**: Check the child's detailed page to view their uploaded Cloudinary image next to their risk level.

## 📚 Documentation

- **[PROJECT_GUIDE.md](PROJECT_GUIDE.md)** - Complete documentation
- **[ARCHITECTURE.md](ARCHITECTURE.md)** - Technical design
- **[QUICKSTART.md](QUICKSTART.md)** - Getting started
- **[IMPLEMENTATION_SUMMARY.md](IMPLEMENTATION_SUMMARY.md)** - Project overview

## 💾 Technology Stack

- **Frontend**: Next.js 16.2, React 19.2, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Node.js
- **Database**: Prisma ORM + SQLite
- **Validation**: Zod

## 🏗️ Architecture

```
Frontend (React Components)
    ↓ HTTP API
Backend (Next.js Routes)
    ↓ ORM
Database (SQLite + Prisma)
```

## 🧪 Test the Application

### Register a Child
1. Go to http://localhost:3000/register
2. Fill in test data:
   ```
   Name: Ahmed Hassan
   Age: 24 months, Sex: Male
   Weight: 12.5 kg, Height: 87 cm, MUAC: 14.0 cm
   ```
3. Submit and view instant analysis

### View Dashboard
1. Go to http://localhost:3000
2. See all children and statistics
3. Filter by risk level

## 🏥 WHO Standards

### MUAC Thresholds
- < 11.5 cm → SAM (Severe Acute Malnutrition)
- 11.5-12.5 cm → MAM (Moderate Acute Malnutrition)
- > 12.5 cm → Normal

### BMI Categories
- < 18.5 → Underweight
- 18.5-24.9 → Normal
- 25-29.9 → Overweight
- ≥ 30 → Obesity

## 📊 Medical Recommendations

**SAM Cases**: URGENT therapeutic feeding + hospitalization
**MAM Cases**: Supplementary feeding program
**Normal**: Routine follow-up

## 🔧 Available Scripts

```bash
npm run dev       # Development server
npm run build     # Production build
npm start        # Start production
npm run lint     # Run linter
```

## 🌐 API Examples

```bash
# Register child
curl -X POST http://localhost:3000/api/register-child \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Ahmed",
    "age": 24,
    "sex": "M",
    "weight": 10.5,
    "height": 85,
    "muac": 13.2
  }'

# Get all children
curl http://localhost:3000/api/children

# Filter by risk
curl "http://localhost:3000/api/children?riskLevel=High"

# Get child details
curl http://localhost:3000/api/child/[id]
```

## 📁 Project Structure

```
/app
  /api - REST API routes
  /components - React components
  page.tsx - Dashboard
  /register - Registration page
  /child/[id] - Child details
/lib
  nutrition/analyzer.ts - WHO algorithms
  db.ts - Database operations
  types.ts - TypeScript types
  validation.ts - Input schemas
/prisma
  schema.prisma - Database schema
  dev.db - SQLite database
/public/locales - Translation files
```

## ✅ Status

| Component | Status |
|-----------|--------|
| Core Logic | ✅ |
| API | ✅ |
| Dashboard | ✅ |
| Database | ✅ |
| UI | ✅ |
| Documentation | ✅ |
| Production Ready | ✅ |

## 🚀 Deployment

### Vercel
```bash
vercel
```

### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY . .
RUN npm install && npm run build
CMD ["npm", "start"]
```

### PostgreSQL
```bash
# Update .env
DATABASE_URL="postgresql://..."

# Migrate
npx prisma db push
```

## 🔐 Security

- ✅ Type-safe TypeScript
- ✅ Input validation (Zod)
- ✅ SQL injection prevention (Prisma)
- ✅ Error handling
- ✅ Data protection

## 📈 Future Enhancements

- Phase 2: Computer Vision (image upload)
- Phase 3: Analytics (growth charts)
- Phase 4: EHR Integration (FHIR)
- Phase 5: Mobile App (React Native)
- Phase 6: AI/ML (predictions)

## 📞 Support

See [QUICKSTART.md](QUICKSTART.md) for troubleshooting and setup help.

## 📄 License

MIT License - See [LICENSE](LICENSE)

---

**AI-PNAS v1.0.0** - Production Ready
Built with ❤️ for child health and nutrition
