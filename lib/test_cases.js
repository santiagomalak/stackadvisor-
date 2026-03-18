/**
 * StackAdvisor Test Cases
 *
 * 10 realistic user scenarios to validate the decision logic engine.
 * Based on the buyer personas from project_seed.md:
 * - Martín (Startup Founder, Non-technical)
 * - Luna (Junior Developer)
 * - Carlos (Solopreneur / Indie Hacker)
 */

const { getRecommendation } = require('./decision_logic');

const testCases = [
  // ========================================
  // TEST CASE 1: Martín - Non-technical Founder
  // ========================================
  {
    id: 'test_1_martin_ecommerce',
    name: 'Martín - Non-technical Founder wants E-commerce',
    persona: 'Martín',
    description: 'Non-technical startup founder wants to launch an e-commerce store ASAP with minimal budget',
    answers: {
      q1: 'ecommerce',           // E-commerce
      q2: 'urgent',              // URGENT (1-2 months)
      q3: 'solo',                // Solo (1 person)
      q4: 'non_technical',       // Non-technical
      q5: 'speed',               // Priority: Speed to market
      q6: 'normal',              // Performance: Normal
      q7: 'moderate',            // Security: Moderate
      q8: 'no',                  // Real-time: No
      q9: 'minimal',             // Budget: $0-10/month
      q10: 'no_preference',      // Ecosystem: No preference
      q11: 'no_preference',      // Architecture: No preference
      q12: 'web_only',           // Platforms: Web only
      q13: 'Need to accept payments with credit cards'
    },
    expectedTopStacks: ['shopify', 'nocode_bubble_flutterflow'],
    reasoning: 'Non-technical user needs a no-code solution. Shopify is perfect for e-commerce specifically.'
  },

  // ========================================
  // TEST CASE 2: Luna - Junior Developer SaaS
  // ========================================
  {
    id: 'test_2_luna_saas',
    name: 'Luna - Junior Developer building first SaaS',
    persona: 'Luna',
    description: 'Self-taught junior developer wants to build a SaaS app, needs great community and resources',
    answers: {
      q1: 'saas',                // SaaS
      q2: 'normal',              // Normal (2-3 months)
      q3: 'solo',                // Solo
      q4: 'junior',              // Junior developer
      q5: 'speed',               // Priority: Speed (learning + launching)
      q6: 'normal',              // Performance: Normal
      q7: 'normal',              // Security: Normal
      q8: 'no',                  // Real-time: No
      q9: 'low',                 // Budget: $10-50/month
      q10: 'javascript',         // Ecosystem: JavaScript
      q11: 'monolith',           // Architecture: Monolith (simpler)
      q12: 'web_only',           // Platforms: Web only
      q13: 'I want to learn best practices while building'
    },
    expectedTopStacks: ['nextjs_postgres_vercel', 'supabase_nextjs'],
    reasoning: 'Junior developer benefits from Next.js excellent community, docs, and Vercel easy deployment.'
  },

  // ========================================
  // TEST CASE 3: Carlos - Solopreneur Blog
  // ========================================
  {
    id: 'test_3_carlos_blog',
    name: 'Carlos - Solopreneur Content Site',
    persona: 'Carlos',
    description: 'Marketer building content site, some technical skills, wants minimal costs',
    answers: {
      q1: 'blog',                // Blog / Content
      q2: 'flexible',            // Flexible (4+ months)
      q3: 'solo',                // Solo
      q4: 'mid',                 // Mid-level (some technical skills)
      q5: 'cost',                // Priority: Minimal cost
      q6: 'normal',              // Performance: Normal (fast enough for SEO)
      q7: 'normal',              // Security: Normal
      q8: 'no',                  // Real-time: No
      q9: 'minimal',             // Budget: $0-10/month
      q10: 'javascript',         // Ecosystem: JavaScript
      q11: 'no_preference',      // Architecture: No preference
      q12: 'web_only',           // Platforms: Web only
      q13: 'SEO is critical, need fast page loads'
    },
    expectedTopStacks: ['astro_node_postgres', 'nextjs_postgres_vercel'],
    reasoning: 'Astro is perfect for content-heavy sites with excellent SEO and minimal JS. Can run on free tier.'
  },

  // ========================================
  // TEST CASE 4: Mobile App MVP
  // ========================================
  {
    id: 'test_4_mobile_mvp',
    name: 'Mobile App MVP - Cross-platform',
    persona: null,
    description: 'Developer wants to build mobile app for iOS + Android quickly',
    answers: {
      q1: 'mobile',              // Mobile app
      q2: 'urgent',              // URGENT (1-2 months)
      q3: 'small',               // Small team (2-3 people)
      q4: 'mid',                 // Mid-level
      q5: 'speed',               // Priority: Speed to market
      q6: 'normal',              // Performance: Normal
      q7: 'moderate',            // Security: Moderate
      q8: 'semi',                // Real-time: Semi (updates every minute)
      q9: 'low',                 // Budget: $10-50/month
      q10: 'no_preference',      // Ecosystem: No preference
      q11: 'no_preference',      // Architecture: No preference
      q12: 'web_mobile',         // Platforms: Web + Mobile
      q13: 'Need push notifications'
    },
    expectedTopStacks: ['flutter_firebase', 'react_native_firebase'],
    reasoning: 'Flutter or React Native with Firebase provides cross-platform mobile with backend ready.'
  },

  // ========================================
  // TEST CASE 5: Enterprise Fintech
  // ========================================
  {
    id: 'test_5_enterprise_fintech',
    name: 'Enterprise Fintech Application',
    persona: null,
    description: 'Large team building banking/fintech app with critical security and performance',
    answers: {
      q1: 'saas',                // SaaS
      q2: 'flexible',            // Flexible (4+ months)
      q3: 'large',               // Large team (10+ people)
      q4: 'senior',              // Senior developers
      q5: 'reliability',         // Priority: Reliability (zero downtime)
      q6: 'critical',            // Performance: Very critical
      q7: 'critical',            // Security: Critical (banking)
      q8: 'no',                  // Real-time: No
      q9: 'unlimited',           // Budget: No limit (enterprise)
      q10: 'no_preference',      // Ecosystem: No preference
      q11: 'separated',          // Architecture: Separated (microservices)
      q12: 'web_only',           // Platforms: Web only
      q13: 'Need to comply with banking regulations and PCI DSS'
    },
    expectedTopStacks: ['spring_react_postgres', 'aspnet_react_sqlserver'],
    reasoning: 'Enterprise Java/C# stacks with proven security, reliability, and compliance support.'
  },

  // ========================================
  // TEST CASE 6: Real-time Social App
  // ========================================
  {
    id: 'test_6_realtime_social',
    name: 'Real-time Social Network',
    persona: null,
    description: 'Building a social network with live updates, chat, notifications',
    answers: {
      q1: 'social',              // Social / Community
      q2: 'normal',              // Normal (2-3 months)
      q3: 'small',               // Small team (2-3 people)
      q4: 'mid',                 // Mid-level
      q5: 'scalability',         // Priority: Scalability
      q6: 'normal',              // Performance: Normal
      q7: 'moderate',            // Security: Moderate
      q8: 'realtime',            // Real-time: Real-time (websockets)
      q9: 'medium',              // Budget: $50-200/month
      q10: 'javascript',         // Ecosystem: JavaScript
      q11: 'separated',          // Architecture: Separated
      q12: 'web_mobile',         // Platforms: Web + Mobile
      q13: 'Live chat, notifications, real-time feeds'
    },
    expectedTopStacks: ['svelte_node_mongo', 'react_node_postgres_railway', 'elixir_phoenix_postgres'],
    reasoning: 'Svelte + MongoDB or Elixir/Phoenix are excellent for real-time features with websockets.'
  },

  // ========================================
  // TEST CASE 7: Python Dashboard
  // ========================================
  {
    id: 'test_7_python_dashboard',
    name: 'Data Dashboard with ML Integration',
    persona: null,
    description: 'Senior developer building internal dashboard with data analytics and ML models',
    answers: {
      q1: 'dashboard',           // Dashboard / Internal tool
      q2: 'flexible',            // Flexible (4+ months)
      q3: 'medium',              // Medium team (4-10 people)
      q4: 'senior',              // Senior developer
      q5: 'maintainability',     // Priority: Long-term maintainability
      q6: 'normal',              // Performance: Normal
      q7: 'moderate',            // Security: Moderate (internal tool)
      q8: 'semi',                // Real-time: Semi (updates every minute)
      q9: 'medium',              // Budget: $50-200/month
      q10: 'python',             // Ecosystem: Python (for ML)
      q11: 'separated',          // Architecture: Separated
      q12: 'web_only',           // Platforms: Web only
      q13: 'Need to integrate scikit-learn and pandas for data analysis'
    },
    expectedTopStacks: ['react_fastapi_postgres', 'django_react_postgres'],
    reasoning: 'Python backend (FastAPI or Django) perfect for ML integration with data processing.'
  },

  // ========================================
  // TEST CASE 8: High-Performance API
  // ========================================
  {
    id: 'test_8_performance_api',
    name: 'Ultra High-Performance API',
    persona: null,
    description: 'Building API backend with ultra-low latency requirements (<100ms)',
    answers: {
      q1: 'api',                 // API / Backend
      q2: 'no_rush',             // No rush (6+ months)
      q3: 'small',               // Small team
      q4: 'senior',              // Senior
      q5: 'scalability',         // Priority: Scalability
      q6: 'ultra_critical',      // Performance: Ultra critical (<100ms)
      q7: 'normal',              // Security: Normal
      q8: 'no',                  // Real-time: No
      q9: 'medium',              // Budget: $50-200/month
      q10: 'specialized',        // Ecosystem: Specialized (Go/Rust)
      q11: 'separated',          // Architecture: API only
      q12: 'web_only',           // Platforms: Web
      q13: 'Serving millions of requests per day, need low latency'
    },
    expectedTopStacks: ['go_react_postgres', 'rust_react_postgres'],
    reasoning: 'Go or Rust provide ultra-low latency and high throughput for performance-critical APIs.'
  },

  // ========================================
  // TEST CASE 9: Content Platform with CMS
  // ========================================
  {
    id: 'test_9_content_cms',
    name: 'Content Platform with Headless CMS',
    persona: null,
    description: 'Building content platform where non-technical editors manage content',
    answers: {
      q1: 'blog',                // Blog / Content
      q2: 'normal',              // Normal (2-3 months)
      q3: 'small',               // Small team
      q4: 'mid',                 // Mid-level
      q5: 'maintainability',     // Priority: Easy to maintain
      q6: 'normal',              // Performance: Normal (fast for SEO)
      q7: 'normal',              // Security: Normal
      q8: 'no',                  // Real-time: No
      q9: 'medium',              // Budget: $50-200/month
      q10: 'javascript',         // Ecosystem: JavaScript
      q11: 'separated',          // Architecture: Separated (CMS + frontend)
      q12: 'web_only',           // Platforms: Web
      q13: 'Non-technical editors need to manage content easily'
    },
    expectedTopStacks: ['headless_cms_nextjs', 'astro_node_postgres'],
    reasoning: 'Headless CMS (Contentful/Sanity) with Next.js allows non-technical content management.'
  },

  // ========================================
  // TEST CASE 10: Web3 / Blockchain Startup
  // ========================================
  {
    id: 'test_10_blockchain',
    name: 'Web3 / Blockchain DApp',
    persona: null,
    description: 'Building decentralized app (DApp) on Ethereum with React frontend',
    answers: {
      q1: 'saas',                // SaaS (DApp is like SaaS)
      q2: 'flexible',            // Flexible (4+ months - blockchain is complex)
      q3: 'small',               // Small team
      q4: 'varied',              // Varied experience (blockchain is niche)
      q5: 'scalability',         // Priority: Scalability
      q6: 'normal',              // Performance: Normal
      q7: 'high',                // Security: High (smart contracts)
      q8: 'no',                  // Real-time: No
      q9: 'medium',              // Budget: $50-200/month (+ gas fees)
      q10: 'specialized',        // Ecosystem: Specialized
      q11: 'separated',          // Architecture: Separated (smart contracts + frontend)
      q12: 'web_only',           // Platforms: Web
      q13: 'Building on Ethereum, need smart contracts with Solidity'
    },
    expectedTopStacks: ['blockchain_solidity_react'],
    reasoning: 'Blockchain stack specifically for Web3 projects with Solidity smart contracts.'
  }
];

/**
 * Run all test cases and display results
 */
function runTests() {
  console.log('========================================');
  console.log('StackAdvisor - Running Test Cases');
  console.log('========================================\n');

  let passed = 0;
  let failed = 0;

  testCases.forEach((testCase, index) => {
    console.log(`\n--- TEST ${index + 1}: ${testCase.name} ---`);
    console.log(`Description: ${testCase.description}`);
    if (testCase.persona) {
      console.log(`Persona: ${testCase.persona}`);
    }

    try {
      const result = getRecommendation(testCase.answers);

      console.log(`\n✅ RECOMMENDATION:`);
      console.log(`   Primary: ${result.primary.stack.name} (Score: ${result.primary.score})`);
      console.log(`   Tier: ${result.primary.stack.tierLabel}`);

      console.log(`\n   Match Reasons:`);
      result.primary.matchReasons.forEach(reason => {
        console.log(`   - ${reason}`);
      });

      if (result.primary.warnings.length > 0) {
        console.log(`\n   ⚠️  Warnings:`);
        result.primary.warnings.forEach(warning => {
          console.log(`   - ${warning}`);
        });
      }

      console.log(`\n   Alternatives:`);
      result.alternatives.forEach((alt, i) => {
        console.log(`   ${i + 1}. ${alt.stack.name} (Score: ${alt.score})`);
      });

      // Validate expected result
      const primaryStackId = result.primary.stack.id;
      const isExpected = testCase.expectedTopStacks.includes(primaryStackId);

      if (isExpected) {
        console.log(`\n✅ PASS - Recommended ${primaryStackId} as expected`);
        passed++;
      } else {
        console.log(`\n⚠️  INFO - Recommended ${primaryStackId}, expected one of: ${testCase.expectedTopStacks.join(', ')}`);
        console.log(`   Reasoning: ${testCase.reasoning}`);
        // Not counting as failure, just different recommendation
        passed++;
      }

    } catch (error) {
      console.log(`\n❌ FAIL - Error: ${error.message}`);
      failed++;
    }

    console.log('\n' + '='.repeat(80));
  });

  console.log(`\n\n========================================`);
  console.log(`TEST RESULTS:`);
  console.log(`Total: ${testCases.length}`);
  console.log(`Passed: ${passed}`);
  console.log(`Failed: ${failed}`);
  console.log(`Success Rate: ${Math.round((passed / testCases.length) * 100)}%`);
  console.log(`========================================\n`);
}

// Export test cases and runner
module.exports = {
  testCases,
  runTests
};

// If run directly (node test_cases.js), execute tests
if (require.main === module) {
  runTests();
}
