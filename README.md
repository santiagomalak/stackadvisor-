# StackAdvisor

**Transform Ideas into Reality**

StackAdvisor helps developers and founders get personalized tech stack recommendations in 5 minutes. From vague idea to clear production roadmap.

## Features

- **13-Question Smart Questionnaire**: Understand your project needs, timeline, team, and priorities
- **25+ Tech Stack Options**: Curated recommendations across all tiers (Popular, Specialized, Enterprise)
- **AI-Powered Recommendation Engine**: Deterministic logic that maps your answers to the perfect stack
- **12-Week Production Roadmap**: Step-by-step plan to take your project from zero to production
- **Clear Justifications**: Understand WHY a stack is recommended for YOUR specific project
- **Cost Estimates**: Know exactly what your hosting will cost monthly

## Tech Stack (StackAdvisor itself)

- **Frontend**: Next.js 14 + React + TypeScript
- **Styling**: TailwindCSS with custom brand colors
- **Backend**: Next.js API Routes
- **Decision Engine**: Custom JavaScript logic (lib/decision_logic.js)
- **Hosting**: Vercel (recommended)
- **Analytics**: Vercel Analytics (optional)

## Project Structure

```
StackAdvisor/
├── app/
│   ├── page.tsx                 # Landing page
│   ├── questionnaire/page.tsx   # Interactive questionnaire
│   ├── results/page.tsx         # Results & recommendations
│   ├── api/recommend/route.ts   # API endpoint for recommendations
│   ├── layout.tsx               # Root layout
│   └── globals.css              # Global styles
├── components/
│   ├── ProgressBar.tsx          # Questionnaire progress indicator
│   ├── QuestionCard.tsx         # Question UI component
│   └── Roadmap.tsx              # 12-week roadmap visualization
├── lib/
│   ├── questionnaire.json       # 13 questions structured data
│   ├── stacks.json              # 25 tech stacks definitions
│   ├── decision_logic.js        # Recommendation engine
│   └── test_cases.js            # 10 test scenarios
└── public/
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone <your-repo-url>
cd StackAdvisor
```

2. Install dependencies
```bash
npm install
```

3. Run development server
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Running Tests

Test the decision logic engine with 10 scenarios:

```bash
npm test
```

This runs the test cases in `lib/test_cases.js` and validates that the recommendation engine works correctly.

## How It Works

### 1. User Flow

1. User lands on homepage → clicks "Start Free Recommendation"
2. User answers 13 questions across 4 sections:
   - Section 1: Understand the Project (project type, timeline, team, experience)
   - Section 2: Requirements (priority, performance, security, real-time, budget)
   - Section 3: Technical Preferences (ecosystem, architecture, platforms)
   - Section 4: Special Requirements (open text)
3. User submits → API calls decision engine
4. Results page shows:
   - Primary recommendation with justification
   - 2 alternative options
   - 12-week roadmap
   - Cost estimates

### 2. Decision Engine Logic

The recommendation engine (`lib/decision_logic.js`) uses a scoring system:

- Base score: 50 points
- Each matching criterion adds points (e.g., +30 for perfect project type match)
- Mismatches subtract points (e.g., -30 for non-mobile stack when user wants mobile)
- Top 3 highest-scoring stacks are recommended

**Example Rules:**
- IF `project_type === 'ecommerce'` AND `experience === 'non_technical'` → Recommend Shopify
- IF `performance === 'ultra_critical'` → Recommend Go or Rust backend
- IF `budget === 'minimal'` → Recommend Vercel + Supabase free tier
- IF `realtime === 'realtime'` → Recommend Svelte/Elixir/Firebase

### 3. 25 Tech Stacks

Organized in 4 tiers:

**Tier 1: Popular & Recommended** (Next.js, React+Node, Django, Flutter, etc.)
**Tier 2: Specialized** (Go, Rust, Remix, NestJS, etc.)
**Tier 3: Enterprise** (Spring Boot, ASP.NET, Laravel)
**Tier 4: Specialized Needs** (Shopify, Supabase, GraphQL, Blockchain, Serverless)

## Development

### Adding New Stacks

Edit `lib/stacks.json`:

```json
{
  "id": "your_stack_id",
  "name": "Your Stack Name",
  "tier": 1,
  "tierLabel": "Popular & Recommended",
  "description": "...",
  "bestFor": ["..."],
  "technologies": { ... },
  "pros": [...],
  "cons": [...],
  "tags": [...]
}
```

### Adding New Questions

Edit `lib/questionnaire.json` and add to the appropriate section.

### Modifying Decision Logic

Edit `lib/decision_logic.js` → `scoreStack()` function to add/modify rules.

## Deployment

### Deploy to Vercel (Recommended)

1. Push code to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Deploy (zero configuration needed)

**Estimated cost:** $0-25/month (Vercel free tier works for MVP)

### Environment Variables

None required for MVP. Optional for future phases:
- `DATABASE_URL` (for saving user results)
- `NEXT_PUBLIC_GA_ID` (for analytics)

## Roadmap

### Phase 1: MVP (Current) ✅
- Interactive questionnaire
- Stack recommendation engine
- 12-week roadmap generation
- User feedback system

### Phase 2: Data-Driven (Months 3-6)
- Save user results to database
- GitHub integration for stack popularity data
- First paid tier ($9/mo)
- User authentication

### Phase 3: AI & Automation (Months 6-9)
- Claude/ChatGPT integration for personalized explanations
- Deploy assistant
- Cost estimator
- Premium tier ($29/mo)

### Phase 4: Community (Months 9-12)
- User success stories
- Forum/community
- Freelancer marketplace

## Contributing

This is a personal project by Santiago. Not accepting contributions at this time.

## License

Private. All rights reserved.

## Contact

Built by Santiago (Data Scientist @ Ivolution)
For questions: [Add your contact]

---

**"From ideas to reality, one developer at a time."**
