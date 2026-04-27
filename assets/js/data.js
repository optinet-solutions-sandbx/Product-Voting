/* Real submitters for the Weekend Challenge.
   When a person's images are generated and dropped into assets/img/<slug>/,
   they are surfaced in the lightbox. The unexpanded card is built from the
   per-idea bullets/teaser/subjectLine fields below.
   Slot 10 is held for the last submission still pending.

   `email` is used to recognize a submitter when they sign in, so their own
   ideas are hidden from them on the ballot. Adjust if any submitter logs in
   with a different address.                                                */
window.SUBMITTERS = [
  /* ============================ JOSE ================================ */
  {
    id: "jose",
    name: "Jose",
    email: "jose@optinetsolutions.com",
    role: "Healthcare + Marketplace",
    pending: false,
    ideas: [
      {
        id: "jose-01", title: "FarmDirect", tagline: "Farmer-to-Consumer Map Platform",
        category: "Marketplace",
        teaser: "Map-based platform connecting farmers directly to consumers. AI predicts harvest timing and matches local demand to nearby farmers — fresher goods, lower prices, higher farmer profits.",
        bullets: ["Massive TAM — every consumer + every producer", "Higher farmer earnings, fresher consumer goods", "Scales across regions on the same AI core"],
        subjectLine: "Fresh local produce, straight from the farm.",
        image: "assets/img/jose/1.webp", impact: "High"
      },
      {
        id: "jose-02", title: "NoShowGuard", tagline: "AI Appointment Reminder & Rebooking",
        category: "Healthcare",
        teaser: "Auto-reminds patients via SMS, Viber, WhatsApp. AI predicts no-shows and instantly fills cancelled slots from the waitlist — direct revenue recovery within the first month.",
        bullets: ["Tangible ROI within weeks", "Reclaims revenue from missed appointments", "Slots into existing clinic software seamlessly"],
        subjectLine: "Confirming your upcoming appointment.",
        image: "assets/img/jose/2.webp", impact: "High"
      },
      {
        id: "jose-03", title: "QueueSmart", tagline: "Smart Queue & Waiting Room Management",
        category: "Healthcare",
        teaser: "QR-code digital queue replaces crowded waiting rooms. Real-time wait estimates based on the doctor's actual pace — patients wait anywhere, infection risk drops.",
        bullets: ["Optimized clinic revenue + patient throughput", "Reduced cross-infection — better outcomes", "Scales to multi-doctor and hospital networks"],
        subjectLine: "Upgrade your waiting room to Smart Queue.",
        image: "assets/img/jose/3.webp", impact: "High"
      }
    ]
  },

  /* ============================ IAN JAY ============================= */
  {
    id: "ianjay",
    name: "Ian Jay",
    email: "ian@optinetsolutions.com",
    role: "iGaming Strategy",
    pending: false,
    ideas: [
      {
        id: "ianjay-01", title: "CompetitorScope", tagline: "Real-Time Competitor Intelligence for iGaming",
        category: "iGaming Intelligence",
        teaser: "Daily scraping of competitor bonuses, VIP tiers, payment changes, and landing-page edits across 25 competitors — delivered as a weekly intel brief plus Slack alerts.",
        bullets: ["100% reuse of existing scraper", "Cold email IS the demo", "Recurring SaaS at mid-ticket"],
        subjectLine: "Here's what your top 5 competitors changed this week.",
        image: "assets/img/ianjay/1.webp", impact: "High"
      },
      {
        id: "ianjay-02", title: "AffiliateGuard+", tagline: "Compliance + Lost-Revenue Audit for iGaming Affiliates",
        category: "Compliance",
        teaser: "Scrapes every affiliate page promoting the brand. Scores compliance violations and dead-link revenue leaks. Two budget holders unlocked on one email — Compliance and CMO.",
        bullets: ["Two buyers in one email", "Quantified lost-revenue figure", "Shortest sales cycle of the three"],
        subjectLine: "47 affiliate pages are non-compliant — €38K in lost FTDs last month.",
        image: "assets/img/ianjay/2.webp", impact: "High"
      },
      {
        id: "ianjay-03", title: "GeoGen+", tagline: "Per-Geo Landing Pages + Per-Streamer Branded Pages",
        category: "Performance Marketing",
        teaser: "Generates geo/language variants, bonus-specific pages, and per-streamer branded pages on the same engine. Speaks to Performance Marketing AND Affiliate heads.",
        bullets: ["Highest leverage of existing engine", "Per-streamer axis = enterprise SKU", "Speaks to two heads at the operator"],
        subjectLine: "10 ready-to-launch landing pages for your top 5 markets.",
        image: "assets/img/ianjay/3.webp", impact: "High"
      }
    ]
  },

  /* ============================ REVO ================================ */
  {
    id: "revo",
    name: "Revo",
    email: "revo@optinetsolutions.com",
    role: "Web Platform",
    pending: false,
    ideas: [
      {
        id: "revo-01", title: "InstantSite Library", tagline: "Pre-Built Website Platform for Small Businesses",
        category: "Web Platform",
        teaser: "Library of pre-designed websites for small businesses. Edit via dashboard. Auto-pulls Google Maps reviews. Mobile + SEO ready. Live in minutes, not months.",
        bullets: ["Removes complexity barrier", "Speed = adoption", "Existing reviews = built-in credibility"],
        subjectLine: "Your business deserves a website. Here's one — already built.",
        image: "assets/img/revo/1.webp", impact: "High"
      },
      {
        id: "revo-02", title: "ClaimYourSite", tagline: "Pre-Built Site, One-Click Adoption",
        category: "Lead Generation",
        teaser: "Scrape Google Maps for businesses without websites. AI builds a single-page site from scraped data. Owner just clicks 'claim' — yes/no is the only first decision.",
        bullets: ["Zero upfront effort for the buyer", "Yes/no is the only first decision", "Natural upsell path post-claim"],
        subjectLine: "Your website is ready. Click to claim it.",
        image: "assets/img/revo/2.webp", impact: "High"
      },
      {
        id: "revo-03", title: "ReputationLift", tagline: "Reputation & Review Boosting Add-On",
        category: "Reputation",
        teaser: "Layer that improves online reputation across Google Maps and review platforms. Combines with the website offer for a complete online presence.",
        bullets: ["More reviews = more customers", "Trust signals stack with website offer", "Owners care about exposure first"],
        subjectLine: "Your competitors have more reviews. Let's fix that.",
        image: "assets/img/revo/3.webp", impact: "Medium"
      }
    ]
  },

  /* ============================ JAS ================================= */
  {
    id: "jas",
    name: "Jas",
    email: "jas@optinetsolutions.com",
    role: "Vertical SaaS",
    pending: false,
    ideas: [
      {
        id: "jas-01", title: "Procurement Autopilot", tagline: "WhatsApp-Native Procurement for Independent Restaurants",
        category: "Restaurant Tech",
        teaser: "Independent restaurants lose 2-3 hrs/day texting suppliers. AI parses every WhatsApp message into orders, deliveries, invoices, and price-change alerts. Suppliers don't change anything.",
        bullets: ["Daily pain = daily use = low churn", "Mixed-language WhatsApp parsing", "Independents underserved by enterprise tools"],
        subjectLine: "Your supplier WhatsApp threads, finally tracked.",
        image: "assets/img/jas/1.webp", impact: "High"
      },
      {
        id: "jas-02", title: "ClientPortal", tagline: "Auto-Generated Client Portals for B2B SMBs",
        category: "B2B SaaS",
        teaser: "Scrape SMB site for brand kit. AI auto-generates a portal pre-styled to their brand. Email demo URL — one-click publish to clients.theirdomain.com.",
        bullets: ["Cold email shows pre-styled portal", "Multi-tenant theming = fast build", "Stops the Slack + email duct tape"],
        subjectLine: "Your clients are asking 'where are we?' — here's their portal.",
        image: "assets/img/jas/2.webp", impact: "High"
      },
      {
        id: "jas-03", title: "SalonGBP", tagline: "Vertical-Native GBP Manager for Salons & Barbershops",
        category: "Local SEO",
        teaser: "Stale Google Business Profiles for salons. Auto-generates 30-day refresh: 4 weekly posts, drafted answers, priced services, photos. One-click manager invite.",
        bullets: ["Vertical content beats generic tools", "Output where customers already search", "One-click manager invite = fastest activation"],
        subjectLine: "Your competitors post weekly. Yours hasn't in 8 months.",
        image: "assets/img/jas/3.webp", impact: "High"
      }
    ]
  },

  /* ============================ CATHY =============================== */
  {
    id: "cathy",
    name: "Cathy",
    email: "cathylyn@optinetsolutions.com",
    role: "Marketing Systems",
    pending: false,
    ideas: [
      {
        id: "cathy-01", title: "ThreatScope", tagline: "1-Page Competitor Threat Analysis",
        category: "Marketing",
        teaser: "Scrape target + top 3 local competitors. Pull reviews, promos, social posts. AI generates a 1-page Threat Analysis + counter-strategy. Cold email delivers the report as the hook.",
        bullets: ["Cold email IS the demo", "Locally relevant, named competitors", "AI counter-strategy is actionable"],
        subjectLine: "I ran an automated analysis on your top 3 competitors.",
        image: "assets/img/cathy/1.webp", impact: "High"
      },
      {
        id: "cathy-02", title: "LeakyFunnel", tagline: "Conversion Audit + Lost-Revenue Calculator",
        category: "Conversion",
        teaser: "Scrape e-commerce sites. Run automated speed tests + missing pixel checks. AI calculates lost revenue. Personalized 'Lost Revenue Report' lands in the cold email.",
        bullets: ["Quantified lost-revenue is undeniable", "Free audit = low-friction entry", "Direct ROI = easy upsell"],
        subjectLine: "Your site loads in 6s. You're leaving 20% of revenue on the table.",
        image: "assets/img/cathy/2.webp", impact: "High"
      },
      {
        id: "cathy-03", title: "InstantSOP", tagline: "Public Documentation → Private AI Knowledge Base",
        category: "Operations",
        teaser: "Scrape job boards + public docs + YouTube transcripts. Feed into a private AI chatbot. Cold email delivers a working AI Assistant trained on the prospect's own data.",
        bullets: ["Demo = working AI on their data", "Cuts manager training hours", "Path to full ops automation"],
        subjectLine: "I built an AI Assistant trained on your company. Try it.",
        image: "assets/img/cathy/3.webp", impact: "High"
      }
    ]
  },

  /* ============================ RALPH =============================== */
  {
    id: "ralph",
    name: "Ralph",
    email: "raphael@optinetsolutions.com",
    role: "Local Business Automation",
    pending: false,
    ideas: [
      {
        id: "ralph-01", title: "RevenueLeak Audit", tagline: "5-Leak Conversion Audit for Local Businesses",
        category: "Local Audit",
        teaser: "Scans Google Business, Facebook, public presence. AI detects 5 specific conversion leaks. €20-50 per audit, €50-150 for done-for-you fixes.",
        bullets: ["Direct ROI from existing traffic", "No behavior change required", "Path to recurring SaaS"],
        subjectLine: "I'll show you 3 ways you're currently losing customers — free preview.",
        image: "assets/img/ralph/1.webp", impact: "High"
      },
      {
        id: "ralph-02", title: "AI Phone Agent", tagline: "24/7 AI Voice Receptionist for Local Services",
        category: "Voice AI",
        teaser: "Plumbers, HVAC, dentists miss €100-500+ jobs every day. AI answers instantly, qualifies leads, captures details, books or forwards. €50-150/mo subscription.",
        bullets: ["Missed calls = lost revenue (clear ROI)", "High-value leads (€100-500+)", "Visible business impact in week one"],
        subjectLine: "Quick question — are you able to answer every call that comes in?",
        image: "assets/img/ralph/2.webp", impact: "High"
      },
      {
        id: "ralph-03", title: "ReviewBoost", tagline: "Consistent 5-Star Review Generation for SMBs",
        category: "Reputation",
        teaser: "Direct review link + QR code. Ready-to-use templates. AI-personalized timed follow-ups. €5-20/mo or €20-50 one-time setup.",
        bullets: ["More reviews = more visibility = more customers", "Easy to sell to almost any business", "Fast, visible results"],
        subjectLine: "Your reviews are great — but you could be getting more.",
        image: "assets/img/ralph/3.webp", impact: "Medium"
      }
    ]
  },

  /* ============================ CIRI ================================ */
  {
    id: "ciri",
    name: "Ciri",
    email: "cirilo@optinetsolutions.com",
    role: "Local Business Automation",
    pending: false,
    ideas: [
      {
        id: "ciri-01", title: "ReviewBooster AI", tagline: "Reviews → Testimonials, Posts, and Insight",
        category: "Content + Reputation",
        teaser: "AI scrapes reviews from Google Maps + Yelp. Extracts themes. Auto-generates testimonials, social posts, email campaigns. Subscription tier scales by location.",
        bullets: ["Hands-off content engine", "Reviews already exist (no new asks)", "Multi-channel output from one source"],
        subjectLine: "Your reviews say a lot. Let's turn them into revenue.",
        image: "assets/img/ciri/1.webp", impact: "High"
      },
      {
        id: "ciri-02", title: "MissedCall Monetizer", tagline: "Lost Calls → Bookings, Automatically",
        category: "Conversion",
        teaser: "Track missed calls via call forwarding. Auto-send SMS reply + AI chatbot link. Auto-create a booking page if they don't have one. Recovers lost revenue.",
        bullets: ["Clear ROI = easy sale", "Recovers lost revenue immediately", "Booking page auto-built"],
        subjectLine: "You missed 14 calls last week. Here's what happened to them.",
        image: "assets/img/ciri/2.webp", impact: "High"
      },
      {
        id: "ciri-03", title: "Local SEO Autopilot", tagline: "Set-and-Forget Local Ranking Engine",
        category: "Local SEO",
        teaser: "Detects businesses with poor SEO. Auto-generates SEO sites, publishes local blog posts, updates GBP. Set-and-forget local ranking.",
        bullets: ["Set-and-forget = low effort sale", "Local ranking = direct customers", "Recurring SaaS pricing"],
        subjectLine: "You're #14 for 'plumber near me'. Want to be #2?",
        image: "assets/img/ciri/3.webp", impact: "High"
      }
    ]
  },

  /* ============================ LEO ================================= */
  {
    id: "leo",
    name: "Leo",
    email: "leo@optinetsolutions.com",
    role: "Revenue Engineering",
    pending: false,
    ideas: [
      {
        id: "leo-01", title: "SmartRoute Revenue OS", tagline: "Conversion + LTV Optimization for iGaming Operators",
        category: "Revenue Optimization",
        teaser: "AI tunes conversion funnels, segments players for LTV, rebalances bonus offers in real time. Pure uplift on existing traffic — no acquisition spend.",
        bullets: ["Pure uplift on existing traffic", "Revenue OS layer = recurring SaaS", "Operator CMOs control budget"],
        subjectLine: "Your existing traffic is leaving money on the table.",
        image: "assets/img/leo/1.webp", impact: "High"
      },
      {
        id: "leo-02", title: "BrokenBonus Detector", tagline: "Revenue Leak Hunter for iGaming Marketing Surfaces",
        category: "Revenue Recovery",
        teaser: "Continuous crawl across bonus pages, affiliate links, geo-targeted offers. Detects broken redirects, expired offers, GEO misconfig. Quantifies the lost revenue.",
        bullets: ["Quantified ROI in cold email", "Same crawler reuse across products", "Recurring SaaS at low churn"],
        subjectLine: "47 of your bonus pages are broken. Here's what they cost you.",
        image: "assets/img/leo/2.webp", impact: "High"
      },
      {
        id: "leo-03", title: "Marketing Automation System", tagline: "Lead → Conversion → Delivery → Retention, Automated",
        category: "Marketing Automation",
        teaser: "Unifies the marketing pipeline: AI orchestrates lead generation, conversion sequences, fulfillment, and retention loops in one structured system.",
        bullets: ["Replaces 4-6 point tools", "Reduces manual handoffs", "Higher conversion through context"],
        subjectLine: "Your funnel is held together by humans. Let's fix that.",
        image: "assets/img/leo/3.webp", impact: "High"
      }
    ]
  },

  /* ============================ IVAN ================================ */
  {
    id: "ivan",
    name: "Ivan",
    email: "ivan@optinetsolutions.com",
    role: "Vertical SaaS",
    pending: false,
    ideas: [
      {
        id: "ivan-01", title: "DentalDesk", tagline: "AI Voice Receptionist + CRM for Cebu Dental Clinics",
        category: "Healthcare",
        teaser: "AI voice agent eliminates missed calls, handles patient FAQs, books 24/7. Bundled with a personal CRM and portal website. End-to-end front-desk coverage.",
        bullets: ["Localized to Cebu (specific market)", "CRM + voice + portal bundle", "High clinic willingness to pay"],
        subjectLine: "Stop missing calls. Stop losing patients.",
        image: "assets/img/ivan/1.webp", impact: "High"
      },
      {
        id: "ivan-02", title: "Bureaucracy Buffer", tagline: "Document Renewal Workflow for Recurring Permits",
        category: "Government Tech",
        teaser: "Document Expiry workflow. LLM parses renewal requirements, pre-fills known data into a checklist 30 days before deadline. Extensible to local government partnerships.",
        bullets: ["Universal pain — everyone has docs", "LLM-parsed requirements scale", "Government partnership upside"],
        subjectLine: "Your driver's license expires in 30 days. Here's the checklist.",
        image: "assets/img/ivan/2.webp", impact: "Medium"
      },
      {
        id: "ivan-03", title: "Subscription Auditor", tagline: "Cancel Vampire Subscriptions Before They Drain Your Account",
        category: "Personal Finance",
        teaser: "Links bank/card alerts to activity logs. If you haven't used a service in 45 days, sends 'Cancel or Keep?' with the direct cancellation link.",
        bullets: ["Universal pain across consumers", "Stops vampire charges", "Direct + measurable savings"],
        subjectLine: "You haven't used Netflix in 47 days. Cancel?",
        image: "assets/img/ivan/3.webp", impact: "Medium"
      }
    ]
  },

  /* ============================ JOHN ================================ */
  {
    id: "john",
    name: "John",
    email: "john@optinetsolutions.com",
    role: "Automated Services",
    pending: false,
    ideas: [
      {
        id: "john-01", title: "Inbound Lead Responder", tagline: "AI Reply + Qualify + Book in Under 60 Seconds",
        category: "Local Services",
        teaser: "AI agent on Instagram DMs, Facebook Messenger, and web chat. Replies in under 60 seconds, qualifies leads, books appointments. $297/mo recurring to local services (salons, gyms, clinics, real estate).",
        bullets: ["Universal pain across local services", "Recurring SaaS at $297/mo", "One operator runs dozens of clients"],
        subjectLine: "Your DMs are full of leads. They're going cold while you're busy.",
        image: "assets/img/john/1.webp", impact: "High"
      },
      {
        id: "john-02", title: "Faceless Video Studio", tagline: "12–60 Short-Form Videos a Month, Done For You",
        category: "Content Production",
        teaser: "Monthly subscription producing 12–60 faceless videos for TikTok, Reels, and Shorts. Script, voice, edit, caption, post — all done. $297–997/mo across two buyer segments.",
        bullets: ["100% recurring revenue", "Two buyer segments on one engine", "Faceless = no on-camera commitment"],
        subjectLine: "12 short-form videos a month. You don't lift a finger.",
        image: "assets/img/john/2.webp", impact: "High"
      },
      {
        id: "john-03", title: "Airbnb Optimizer", tagline: "Done-For-You Listing Rewrite + Smart Pricing",
        category: "Travel",
        teaser: "Rewrite copy. AI-enhance photos. Build smart pricing from market comps. Install auto guest messaging. $247/listing + $97/mo for underperforming Airbnb hosts.",
        bullets: ["Direct revenue lift = easy sale", "$247 one-time + $97/mo recurring", "Clear before/after comparison"],
        subjectLine: "Your Airbnb is underbooking. Here's why — and how to fix it.",
        image: "assets/img/john/3.webp", impact: "Medium"
      }
    ]
  },

  /* ============================ CHRIS =============================== */
  {
    id: "chris",
    name: "Chris",
    email: "chris@optinetsolutions.com",
    role: "Vertical Outreach",
    pending: false,
    ideas: [
      {
        id: "chris-01", title: "ListingRewriter", tagline: "Multilingual Listing Optimizer for Hotels & B&Bs",
        category: "Hospitality",
        teaser: "Scrape independent hotels and B&Bs with weak Booking/Airbnb listings — single language, thin descriptions, low scores. AI rewrites the listing in 8–12 languages and flags photo issues. Cold email contains the rewritten listing side-by-side.",
        bullets: ["Massive willingness to pay — one extra booking pays the year", "Pan-European market across small hotels + B&Bs", "Untouched vertical — no one else on the team is pitching it"],
        subjectLine: "Your Booking listing — rewritten, in 8 languages.",
        impact: "High"
      },
      {
        id: "chris-02", title: "ProfileScore", tagline: "Audit-Score GBP Fix for Local Businesses",
        category: "Local SEO",
        teaser: "Reuse our Google Maps pipeline. Score every business's GBP on a 0–100 scale. For low scorers, AI generates the full fix: optimized description, 10 GBP posts, Q&A answers, correct category, photo prompts.",
        bullets: ["Scoreboard hook — opens at 60%+", "Fastest to build (3 days from existing stack)", "Cleanest extension of what we already have"],
        subjectLine: "Your Google profile scored 31/100.",
        impact: "High"
      },
      {
        id: "chris-03", title: "SiteSwap", tagline: "Side-by-Side Modern Redesign for Outdated Business Sites",
        category: "Web Modernization",
        teaser: "Biggest TAM of the three. Scrape Google Maps for businesses with old, slow, or non-mobile sites. AI generates a modern replacement using their existing content. Cold email contains a side-by-side screenshot — their site today vs. ours.",
        bullets: ["Biggest TAM of the three", "Reuses the entire existing stack — flips the filter from no-website to ugly-website", "Side-by-side screenshot is undeniable in the inbox"],
        subjectLine: "Your website vs. the version we already built for you.",
        impact: "High"
      }
    ]
  }
];
