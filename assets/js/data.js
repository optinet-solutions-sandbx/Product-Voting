/* Real submitters for the Weekend Challenge.
   11 teammates × 3 products = 33 ideas. All cleared, no duplicates.
   When a person's images are generated and dropped into assets/img/<slug>/,
   they are surfaced in the lightbox. The unexpanded card is built from the
   per-idea bullets/teaser/subjectLine fields below.

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
        id: "ianjay-affiliate", title: "AffiliateGuard+", tagline: "Compliance + Lost-Revenue Audit for iGaming Affiliates",
        category: "Compliance",
        teaser: "Scrapes every affiliate page promoting the brand. Scores compliance violations and dead-link revenue leaks. Two budget holders unlocked on one email — Compliance and CMO.",
        bullets: ["Two buyers in one email", "Quantified lost-revenue figure", "Shortest sales cycle of the three"],
        subjectLine: "47 affiliate pages are non-compliant — €38K in lost FTDs last month.",
        image: "assets/img/ianjay/2.webp", impact: "High"
      },
      {
        id: "ianjay-geo", title: "GeoGen+", tagline: "Per-Geo Landing Pages + Per-Streamer Branded Pages",
        category: "Performance Marketing",
        teaser: "Generates geo/language variants, bonus-specific pages, and per-streamer branded pages on the same engine. Speaks to Performance Marketing AND Affiliate heads.",
        bullets: ["Highest leverage of existing engine", "Per-streamer axis = €7.5–10K/mo enterprise SKU", "Speaks to two heads at the operator"],
        subjectLine: "10 ready-to-launch landing pages for your top 5 markets.",
        image: "assets/img/ianjay/3.webp", impact: "High"
      },
      {
        id: "ianjay-permit", title: "PermitProfit", tagline: "Building-Permit-Triggered Marketing Kit for General Contractors",
        category: "Local Services",
        teaser: "Scrapes daily building-permit filings from public municipal databases (US/UK/EU). AI generates a per-project marketing kit: project landing page, ZIP-code postcard, Meta + Nextdoor ad creative, customer-testimonial template, referral email drip. Cold email contains a live preview link to a fully-built page for the contractor's actual newest permit.",
        bullets: ["Fresh trigger — permit just filed (zero competition)", "€500/project or €2,500/mo unlimited — corporate-card price", "Live preview of contractor's actual permit in cold email"],
        subjectLine: "A new permit just filed in your ZIP — here's the marketing kit, ready.",
        image: "assets/img/ianjay/1.webp", impact: "High"
      }
    ]
  },

  /* ============================ REVO ================================ */
  {
    id: "revo",
    name: "Revo",
    email: "revo@optinetsolutions.com",
    role: "Social Media Tooling",
    pending: false,
    ideas: [
      {
        id: "revo-hash", title: "Hashtag Finder", tagline: "AI Hashtag Discovery for Social Media Reach",
        category: "Social Media",
        teaser: "Identifies and suggests the most effective hashtags for each post to expand reach beyond current followers. Posts surface in searches and feeds across Facebook, TikTok, and Instagram. Helps small accounts grow organically.",
        bullets: ["Reach beyond current followers", "Cross-platform: FB, TikTok, IG", "Plugs into existing posting workflow"],
        subjectLine: "Your last 10 posts used the same 5 hashtags. Here's what's working now.",
        image: "assets/img/revo/1.webp", impact: "Medium"
      },
      {
        id: "revo-promo", title: "Promo Page Generator", tagline: "One-Click Landing Pages for Local Business Promotions",
        category: "Marketing",
        teaser: "Owner inputs promo title, details, duration → AI generates a ready-to-use landing page (e.g., '50% Off This Weekend') for sharing on Facebook and Instagram. Launch promotions without a developer. Recurring revenue per promo.",
        bullets: ["No developer needed — owner self-serves", "Per-promo recurring revenue", "FB/IG share-ready out of the box"],
        subjectLine: "Launch your weekend promo with one click — landing page included.",
        image: "assets/img/revo/2.webp", impact: "Medium"
      },
      {
        id: "revo-content", title: "AI Social Content Generator", tagline: "Daily Caption + Hashtag + Content Plan for SMBs",
        category: "Content",
        teaser: "Generates ready-to-post content using scraped business details. Captions, hashtag suggestions, image/video ideas, weekly content plan tailored for Instagram and TikTok. Removes the 'what should I post?' blocker. (Owner executes; distinct from John's done-for-you Faceless Video Studio.)",
        bullets: ["Daily content plan auto-generated", "Captions + hashtags + visual prompts", "Removes the 'what should I post?' blocker"],
        subjectLine: "Tomorrow's posts, written. Hashtags, picked. Just hit publish.",
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
        id: "jas-list", title: "List Liquidator", tagline: "AI-Verified Lead List Cleaning for B2B Sales Teams",
        category: "B2B Sales",
        teaser: "Sales teams buy lead lists where 30-50% of contacts are dead. Upload a CSV; AI calls each contact to confirm they still work there. Cleaned list back by morning. $5 per confirmed live contact, dead ones free. Markets: AU, UK, UAE, Singapore.",
        bullets: ["Pay-per-confirmed-contact removes all buyer risk", "$5/live contact in AU, UK, UAE, Singapore", "Cleaned CSV back by morning — no waiting"],
        subjectLine: "30–50% of your purchased leads are dead. We'll prove it overnight.",
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
        teaser: "Scrape target + top 3 local competitors. Pull reviews, promos, social posts. AI generates a 1-page Threat Analysis + counter-strategy. Cold email delivers the report as the hook. iGaming version tracks 25 competitors at a higher tier.",
        bullets: ["Cold email IS the demo", "Locally relevant, named competitors", "iGaming enterprise SKU on top"],
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
        id: "ralph-01", title: "Revenue Leak Audit", tagline: "5-Leak Conversion Audit for Local Businesses",
        category: "Local Audit",
        teaser: "Scans Google Business, Facebook, public web presence. Delivers a 5-leak report with exact fixes for missed replies, weak profiles, no CTAs, no follow-up systems. €20-50 per audit, €50-150 for done-for-you fixes.",
        bullets: ["Direct ROI from existing traffic", "No behavior change required", "Path to recurring SaaS"],
        subjectLine: "I'll show you 3 ways you're currently losing customers — free preview.",
        image: "assets/img/ralph/1.webp", impact: "High"
      },
      {
        id: "ralph-ghost", title: "Ghost Job Detector", tagline: "Recover Unbilled Revenue from Completed Jobs",
        category: "Revenue Recovery",
        teaser: "Scans WhatsApp, SMS, email, and call logs for plumbers, electricians, contractors, repair services. AI detects completed-but-unbilled jobs by parsing 'done', 'fixed', 'finished' and cross-checking against invoices/CRM. Auto-generates draft invoices.",
        bullets: ["Emotional hook — 'you worked for free'", "Free-scan demo lands in cold email", "€50–150/mo or % of recovered revenue"],
        subjectLine: "You completed 7 jobs last month that were never invoiced.",
        image: "assets/img/ralph/2.webp", impact: "High"
      },
      {
        id: "ralph-03", title: "Reviews Booster", tagline: "Consistent 5-Star Review Generation for SMBs",
        category: "Reputation",
        teaser: "Direct review link + QR code. Ready-to-use templates. AI-personalized timed follow-ups. Tone optimization over time. €5-20/mo or €20-50 one-time setup.",
        bullets: ["More reviews = more visibility = more customers", "Easy to sell to almost any business", "Fast, visible results"],
        subjectLine: "Your reviews are great — but you could be getting more.",
        image: "assets/img/ralph/3.webp", impact: "Medium"
      }
    ]
  },

  /* ============================ SERE ================================ */
  {
    id: "sere",
    name: "Sere",
    email: "sere@optinetsolutions.com",
    role: "SMB Reputation + Ops",
    pending: false,
    ideas: [
      {
        id: "sere-01", title: "Auto-Reputation Manager", tagline: "AI Review Reply Manager for Small Businesses",
        category: "Reputation",
        teaser: "Scans Google Maps, Yelp, Facebook for unanswered reviews. AI generates professional replies and suggests fixes (refund, apology, promo). Auto-post or approval flow. ₱500–2,000/mo subscription.",
        bullets: ["Hands-off review reply at scale", "Approval flow keeps owner in control", "Recurring SaaS at SMB-friendly price"],
        subjectLine: "You have 23 reviews waiting for a reply. Here's the first batch.",
        image: "assets/img/sere/1.webp", impact: "High"
      },
      {
        id: "sere-02", title: "Auto-Follow-Up", tagline: "Win-Back Automation for Lapsed Customers",
        category: "Retention",
        teaser: "Tracks customers who didn't return or didn't complete booking. Auto-sends 'we miss you' sequences with discount offers via SMS, WhatsApp, Email. Subscription + usage-based pricing.",
        bullets: ["Recovers known-good past customers", "Multi-channel: SMS, WhatsApp, Email", "Subscription + usage-based pricing"],
        subjectLine: "Your last visit was 6 months ago. Come back?",
        image: "assets/img/sere/2.webp", impact: "High"
      },
      {
        id: "sere-03", title: "Inventory Restock Predictor", tagline: "Auto-Inventory Restock Predictor for Small Shops",
        category: "Retail Ops",
        teaser: "Connects to small retail (sari-sari, mini marts, cafés, pharmacies) via POS, daily input app, or receipt photo scan. AI predicts when items run out, suggests what to restock and when, and auto-generates supplier orders. Monthly subscription per store + supplier affiliate cuts.",
        bullets: ["No POS required — receipt photos work", "Auto-drafted supplier orders before stockout", "Subscription + supplier affiliate revenue"],
        subjectLine: "Coke Zero will run out in 3 days — reorder 5 cases.",
        image: "assets/img/sere/3.webp", impact: "High"
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
        id: "ivan-01", title: "DentalDesk", tagline: "AI Voice Receptionist + CRM + Portal for Local Service Businesses",
        category: "Local Services",
        teaser: "Originally for Cebu dental clinics — now expanded to plumbers, salons, restaurants, electricians, HVAC. AI voice agent eliminates missed calls, handles FAQs, books 24/7. Bundled with CRM and portal website. End-to-end front-desk coverage.",
        bullets: ["Vertical-agnostic — works across local services", "CRM + voice + portal bundle in one offer", "High SMB willingness to pay"],
        subjectLine: "Stop missing calls. Stop losing customers.",
        image: "assets/img/ivan/1.webp", impact: "High"
      },
      {
        id: "ivan-02", title: "Bureaucracy Buffer", tagline: "Document Renewal Workflow for Recurring Permits",
        category: "Government Tech",
        teaser: "LLM parses renewal requirements (e.g., 'recent ID photo + clearance'). Pre-fills known data into a checklist 30 days before deadline. Recurring permits, vehicle registrations, pro license renewals. Extensible to LGU partnerships.",
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
        id: "john-menu", title: "MenuLift", tagline: "AI Menu Optimizer for Independent Restaurants in Tourist Areas",
        category: "Restaurant Tech",
        teaser: "Scrapes menus from Facebook, Google Maps, or delivery apps. AI rewrites descriptions, reorders dishes by margin, applies psychological pricing, and translates into 5 tourist languages (English, Korean, Mandarin, Japanese, Spanish). Delivered as a printable PDF in the cold email. ₱9,900 one-time.",
        bullets: ["Empty competitive lane in tourist-zone restaurants", "₱9,900 impulse price — walk-in closeable", "PDF preview in the cold email = the demo"],
        subjectLine: "Your menu — rewritten, repriced, translated for tourists.",
        image: "assets/img/john/3.webp", impact: "High"
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
        id: "chris-01", title: "Listing Optimizer", tagline: "Multilingual Listing Optimizer for Hotels & B&Bs",
        category: "Hospitality",
        teaser: "Scrape independent hotels and B&Bs with weak Booking/Airbnb listings — single language, thin descriptions, low scores. AI rewrites the listing in 8–12 languages and flags photo issues. Cold email contains the rewritten listing side-by-side.",
        bullets: ["Massive willingness to pay — one extra booking pays the year", "Pan-European market across small hotels + B&Bs", "Untouched vertical — no one else on the team is pitching it"],
        subjectLine: "Your Booking listing — rewritten, in 8 languages.",
        image: "assets/img/chris/1.webp", impact: "High"
      },
      {
        id: "chris-02", title: "GBP Fixer (Audit Score)", tagline: "Audit-Score GBP Fix for Local Businesses",
        category: "Local SEO",
        teaser: "Reuse our Google Maps pipeline. Score every business's GBP on a 0–100 scale. For low scorers, AI generates the full fix: optimized description, 10 GBP posts, Q&A answers, correct category, photo prompts.",
        bullets: ["Scoreboard hook — opens at 60%+", "Fastest to build (3 days from existing stack)", "Cleanest extension of what we already have"],
        subjectLine: "Your Google profile scored 31/100.",
        image: "assets/img/chris/2.webp", impact: "High"
      },
      {
        id: "chris-03", title: "Website Redesign", tagline: "Side-by-Side Modern Redesign for Outdated Business Sites",
        category: "Web Modernization",
        teaser: "Biggest TAM of the three. Scrape Google Maps for businesses with old, slow, or non-mobile sites. AI generates a modern replacement using their existing content. Cold email contains a side-by-side screenshot — their site today vs. ours.",
        bullets: ["Biggest TAM of the three", "Reuses the entire existing stack — flips the filter from no-website to ugly-website", "Side-by-side screenshot is undeniable in the inbox"],
        subjectLine: "Your website vs. the version we already built for you.",
        image: "assets/img/chris/3.webp", impact: "High"
      }
    ]
  }
];
