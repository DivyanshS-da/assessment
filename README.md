# 🧠 Cognify — AI-Powered Competency & Learning Analytics Platform

> **Neo-Brutalist Educational SaaS** connecting instructional objectives to all six cognitive levels of **Bloom's Taxonomy**, powered by Google Gemini and Supabase PostgreSQL.

---

## 🚀 Overview

**Cognify** transforms traditional educational assessments into outcome-based cognitive analytics:
- **Admin**: Provision faculty accounts, audit real-time system telemetry, and govern courses.
- **Faculty**: Create curricula, anchor learning outcomes across all six Bloom levels, upload course materials, generate AI-validated assessments with Gemini, and identify class-wide learning gaps.
- **Student**: Enrol in courses, access study vaults, take timed interactive assessments with automated grading, inspect multi-axis Bloom radar competency charts, and receive targeted remedial study plans.

---

## 🎨 Visual Identity: Neo-Brutalism
- **High Contrast**: Thick black borders (`2px` / `3px`) and solid drop shadows (`shadow-[4px_4px_0px_#000]`).
- **Retro Windows**: Mac OS / retro style window headers (`ooo filename.ext`) with traffic light indicator dots.
- **Color Identity**: Electric Lime (`#CCFF00`), Sunny Yellow (`#FFDE59`), Pastel Pink (`#FF90E8`), Cyan (`#70D6FF`), and Lavender (`#C4B5FD`).
- **Ticker Marquee**: Continuous uppercase marquee band highlighting core capabilities.

---

## 🛠️ Tech Stack
- **Frontend**: React 18, TypeScript (Strict), Vite 5
- **Styling**: Tailwind CSS (Neo-Brutalism tokens), Lucide Icons
- **Data Visualizations**: Recharts (6-Axis Bloom Radar, Performance Distribution)
- **Validation**: Zod (strict schema validation for all AI outputs)
- **Database & Backend**: Supabase PostgreSQL, Row Level Security (RLS), Supabase Auth & Storage

---

## 🏃 Getting Started Locally

### Prerequisites
- Node.js 18+ or 20+ LTS
- npm or pnpm

### Installation
```bash
# Clone the repository
git clone <your-repo-url>
cd assessment

# Install dependencies
npm install

# Run the local development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📦 Deployment on Render

This project is configured as a static web service:
- **Build Command**: `npm install && npm run build`
- **Publish Directory**: `dist`
- **Rewrite Rule**: `/* -> /index.html` (HTTP 200) for client-side routing.
