SprX Enroll IQ
AI-powered admissions platform for independent schools

Product Requirements Document
Version: 2.2 Date: March 2026 Author: Amr Niyaz Status: Draft

1. Executive Summary
SprX EnrollIQ is a website-native admissions intelligence platform built exclusively for independent schools. It tracks prospect behaviour from the first anonymous website visit through to enrolment, scoring each family's conversion likelihood in real time and alerting admissions teams at the precise moment to act.
Unlike generic CRMs (OpenApply, iSAMS, HubSpot), SprX EnrollIQ lives inside the school website itself — capturing the pre-enquiry journey that every other tool misses entirely. With deep HubSpot CRM integration, SprX EnrollIQ closes the full attribution loop — connecting a family's first anonymous click to their enrolled fee income — giving schools revenue intelligence that no other admissions tool can provide.
It is distributed through Interactive Schools' portfolio of 200+ SprXcms websites, giving it an unparalleled install base from day one. The majority of Interactive Schools' clients already operate HubSpot CRM, making the Revenue Intelligence layer immediately deployable across the portfolio.

2. Problem Statement
The Core Problem
Independent schools invest heavily in beautiful websites, open days, and marketing campaigns — but have zero visibility into which families are seriously considering them until those families voluntarily raise their hand via an enquiry form.
By the time a family enquires, they may have already visited the website six times, read the fees page four times, and shortlisted two competitor schools. The admissions team knows none of this.
Current Pain Points

Pain Point
Impact
Enquiry forms are the only data capture point
Late identification of intent
No visibility into pre-enquiry behaviour
Cannot prioritise warm vs cold leads
All enquiries treated equally
Wasted time on cold prospects
No alerting when prospects go cold
Lost enrolments
Spreadsheet-based tracking
No scoring, no intelligence
GA data is anonymous and aggregate
Cannot act on individual families
No link between marketing spend and enrolled revenue
Cannot justify or optimise marketing budgets
CRM data disconnected from website behaviour
Admissions team works with incomplete picture
No enrolment forecasting
Bursars and Heads cannot plan financially

The Cost of Inaction
At £15,000–£50,000 annual fees per pupil, losing one enrolment that could have been saved with timely outreach costs a school far more than any software subscription. Most schools are losing 3–5 convertible prospects per term without knowing it.
Additionally, schools spend thousands on Google Ads, social media campaigns, and open day marketing with no ability to trace that spend back to actual enrolled fee income. Marketing budgets are set on gut feel, not data.

3. Product Vision
"Know which family is ready to enrol before they do — and know exactly what it's worth."
SprX EnrollIQ transforms independent school admissions from a reactive, form-driven process into a proactive, data-driven one — giving admissions teams the right information at the right moment to convert more families, faster.
With closed-loop revenue intelligence, it also gives Heads and Bursars the financial visibility they've never had: which campaigns generate real fee income, which families represent the highest lifetime value, and what next term's revenue pipeline actually looks like.

4. Target Users
Primary Users
User
Role
Need
Admissions Secretary / Registrar
Day-to-day user
Know who to call today and why
Director of Admissions
Weekly oversight
Pipeline health, conversion rates
Head / Principal
Monthly review
Enrolment forecast, revenue impact

Secondary Users
User
Role
Need
Marketing Manager
Campaign performance
Which channels drive best prospects and actual enrolled revenue
Bursar
Financial planning
Projected fee income from pipeline, family lifetime value

Customer Profile
Independent schools in the UK
100–1,200 pupils
Fee-paying, non-selective or selective
Currently using: HubSpot CRM (majority of Interactive Schools clients), iSAMS, OpenApply, or spreadsheets
Website built and managed by Interactive Schools (SprXcms)

5. Competitive Landscape

Product
What It Does
Gap SprX EnrollIQ Fills
OpenApply
Admissions CRM from enquiry onwards
Misses pre-enquiry website behaviour, no revenue attribution
iSAMS Admissions Portal
MIS-integrated application management
No scoring, no behavioural tracking, no revenue intelligence
HubSpot (via HubGem)
Generic CRM adapted for schools
Complex, expensive, not website-native, no predictive scoring
Google Analytics
Aggregate website traffic
Anonymous only, no prospect profiles, no CRM link
WCBS
MIS and finance software
Not an admissions conversion tool
Enquiry Tracker
Basic admissions pipeline tool
No website tracking, no AI, no revenue forecasting

Positioning
SprX EnrollIQ is not a CRM replacement. It is the full-funnel intelligence layer that sits between the school website and HubSpot CRM — capturing the pre-enquiry journey, enriching CRM data with behavioural signals, and closing the attribution loop from first click to enrolled fee income. Its Website Intelligence feature goes further — using actual prospect behaviour data to tell schools what to fix on their website to convert more families. No other tool in the independent schools market does this.

6. Goals & Success Metrics
Business Goals
Achieve 10 paying pilot schools within 6 months of launch
Reach £5,000 MRR within 12 months
Reach 50 paying schools within 24 months (£15,000–£25,000 MRR)
Average Revenue Per School (ARPU): £500/month across tiers
Product Success Metrics
Metric
Target
Prospect profiles created per school/month
50+
Admissions team daily active usage
4+ days/week
Alert-to-action rate (alerts acted on)
>60%
School churn rate
<5% annually
NPS score
>50
Time to first scored prospect (post-install)
<48 hours
Revenue Intelligence page weekly views by Head/Bursar
2+

School Success Metrics (outcomes we help schools achieve)
Metric
Target improvement
Enquiry-to-visit conversion rate
+15%
Visit-to-offer conversion rate
+10%
Time from enquiry to first contact
-50%
Prospects "saved" from going cold
3–5 per term
Marketing spend attributed to enrolled revenue
100% of paid campaigns
Enrolment forecast accuracy
Within ±15% of actuals


7. Scope
V1.0 — MVP (In Scope)
JavaScript tracking snippet (SprXcms / GTM compatible)
GA4 API integration for session enrichment
Identity stitching on enquiry form submission
Prospect profile creation and timeline view
Scoring engine (weighted rule-based model)
Hot prospect email alerts to admissions team
Single school dashboard (one login per school)
Basic nurture email sequences via Resend API
Claude API-powered prospect summaries and call suggestions
V1.5 — HubSpot Revenue Intelligence & Website Intelligence (In Scope)
HubSpot CRM API integration (Contacts, Deals, Communications)
Closed-loop revenue attribution (first click → enrolled fee income)
Enrolment funnel visualisation (website visitor → enrolled student)
Predictive enrolment probability per prospect (based on historical outcomes)
Pipeline revenue forecast with confidence ranges
Campaign ROI tied to actual enrolments (not just clicks)
Competitor loss intelligence (why families chose other schools)
Family lifetime value calculation (multi-child, multi-year)
Revenue Intelligence dashboard page
HubSpot CRM data card on prospect profiles
Deal stage pipeline visualisation per prospect
Website Intelligence — health score, content gap detection, recommendations engine
Enrolled vs non-enrolled journey comparison
Website recommendation tracking (new / acknowledged / actioned)
Out of Scope (V2+)
Multi-user team accounts with roles
Native iSAMS / OpenApply integration
Mobile app
Self-serve onboarding and billing
AI-powered chat capture (pre-enquiry identity)
Video message personalisation
ML-based scoring model (replacing rule-based with trained model)

8. Features & Requirements

8.1 Tracking Script (PostHog-Powered)
Description A lightweight JavaScript wrapper (track.js, async) deployed across all SprXcms school websites. Loads the PostHog JS SDK and configures it with the school's PostHog project API key. All events are sent to PostHog Cloud, which serves as the event store and analytics engine. The FastAPI backend reads data from PostHog via its API — it does not receive events directly.
Functional Requirements
Load PostHog JS SDK and initialise with school's PostHog project API key
Register school_id as a super property on all events
Track page views via PostHog's built-in autocapture (capture_pageview: true)
Track scroll depth at 25%, 50%, 75%, 100% intervals (custom event: scroll_depth_reached)
Track time on page (custom event: time_on_page)
Track page leave events via PostHog (capture_pageleave: true)
Listen for enquiry form submission events
On form submission: capture name, email, child_name, year_group
Stitch captured identity to all historical anonymous sessions via posthog.identify()
Custom event: enquiry_form_submitted with form field data
Load asynchronously — must not impact page speed
Compatible with SprXcms, GTM, and manual <head> installation
Non-Functional Requirements
Script size: <5kb minified and gzipped (wrapper only; PostHog SDK loaded from CDN)
Must not block page render
GDPR compliant — anonymous until form submission
Must work across all modern browsers (Chrome, Safari, Firefox, Edge)
Persistence via localStorage + cookie
Note on Identification Rate The script identifies prospects only at the point of voluntary form submission. Pre-submission tracking is anonymous by design (GDPR). Schools should expect approximately 5–10% of anonymous visitors to become identified prospects — this is expected behaviour, not a limitation, and mirrors how all compliant website tracking tools operate.

8.2 GA4 Integration (Optional — PostHog Captures Core Metrics)
Description PostHog now captures most acquisition and session data that was previously dependent on GA4: traffic source, referrer, device type, geographic region (via GeoIP), session count, UTM parameters, and browser details. GA4 integration is now optional and supplementary — useful for schools that want campaign-level detail from existing GA4 properties, but no longer a prerequisite for core functionality.
Functional Requirements
Connect to GA4 Data API via school's GA property ID (optional)
Pull supplementary data: campaign name, medium, landing page detail
Merge GA4 campaign data with PostHog tracking data where available
Display acquisition data on prospect profile (PostHog data primary, GA4 supplementary)
Refresh GA data every 24 hours per prospect (when connected)
Aggregate school-wide acquisition insights from PostHog (traffic sources, device split, referrers)
Show traffic source breakdown, conversion by channel, device split, top landing pages, campaign performance, and visitor regions on dashboard
Note: Core acquisition insights (source, device, geo, sessions) are available from PostHog alone. GA4 connection adds deeper campaign attribution for schools running paid ads.

8.3 Prospect Profiles
Description A unified profile for each identified prospect combining all tracked data points, engagement score, enrolment probability, HubSpot CRM data, and AI-generated summary.
Data Model
Prospect
─────────────────────────────
id
school_id
visitor_cookie_id
hubspot_contact_id
name
email
phone
child_name
child_year_group
year_of_entry
source (from GA4)
city / region (from GA4)
score (0–100, engagement)
score_band (hot/warm/interested/cold)
enrollment_probability (0–100%)
pattern_flag
created_at
last_seen_at
status (active/enrolled/lost)

Events
─────────────────────────────
id
prospect_id
event_type (page_view/form_submit/email_open/email_click)
page_url / page_title
scroll_depth / time_on_page
timestamp

HubSpot Data (synced)
─────────────────────────────
hubspot_contact_id
lifecycle_stage / lead_status
deal_id / deal_stage / deal_value
deal_owner
communications_count
last_crm_activity
lost_reason / lost_competitor
siblings (array)
employer

Lifetime Value (computed)
─────────────────────────────
annual_fees
projected_years (year group → Year 13)
sibling_count
total_projected_value
Functional Requirements
Profile auto-created on first form submission
All pre-submission anonymous sessions retroactively attached
Timeline view showing every interaction in chronological order
Engagement score displayed prominently with band colour coding
Enrolment probability displayed alongside engagement score
AI summary visible at top of profile
HubSpot CRM data card showing deal stage, owner, communications, value
Family lifetime value card showing projected total fee income
Phone number click-to-call on mobile
Status update (active / enrolled / lost) by admissions team
Notes field for admissions team to log calls

8.4 Scoring Engine
Description A weighted rule-based scoring system that calculates each prospect's engagement likelihood from 0–100 in real time.
Scoring Rules
Action
Points
Enquiry form submitted
+25
Visited /fees page
+15
Visited /fees page (2nd+ time)
+10
Visited /admissions page
+10
Downloaded prospectus
+10
Booked open day
+20
Returned to site within 24 hours
+12
Returned to site within 7 days
+8
Visited /sixth-form or /boarding
+6
Spent 3+ minutes on any page
+5
Clicked nurture email
+8

Score Decay
Condition
Points
No visit in 7 days
-5
No visit in 14 days
-10
No response to 2 emails
-8

Score Bands
Band
Range
Colour
Action
Hot
80–100
Red 🔥
Immediate phone alert to admissions
Warm
60–79
Amber ⚡
Automated personalised email
Interested
40–59
Blue 👀
Add to open day invite list
Cold
0–39
Grey ❄️
Generic newsletter only

Pattern Detection
Pattern
Trigger
Flag
Fee Checker
Visited /fees 3+ times, nothing else
Price sensitive
Silent Stalker
5+ visits, no enquiry yet
Show open day prompt
Ready Family
Enquired + prospectus + open day booked
Priority call
Going Cold
Was 70+ score, now decaying 14+ days
Re-engagement alert


8.5 Predictive Enrolment Probability
Description A second scoring dimension powered by historical HubSpot outcome data. While the engagement score measures current website activity, enrolment probability predicts the likelihood that a prospect will actually enrol based on patterns of families who did and didn't enrol in previous intake years.
How It Works
Connect to HubSpot Deals API to retrieve historical enrolment outcomes (enrolled vs lost) for the past 2–3 intake years
For each historical deal, correlate the family's website behaviour with their final outcome
Identify behavioural patterns that predict enrolment: pages visited, visit frequency, time-to-enquiry, source channel, year group, geographic region
Apply pattern matching to current prospects to generate a probability percentage (0–100%)
Requires minimum 20 historical closed deals to activate (clearly labelled when below threshold)
Functional Requirements
Display enrolment probability (0–100%) alongside engagement score on prospect profile
Show confidence level (low / medium / high) based on available historical data
List key contributing factors per prospect (e.g. "Visited fees 3+ times — positive", "No open day booked — negative")
Show "similar families enrolled" ratio (e.g. "7 of 10 families with this pattern enrolled")
Update probability when new events occur or HubSpot deal stage changes
Revenue Intelligence page shows aggregate enrolment projections
Example Output
"Enrolment Probability: 73% (High Confidence). Based on 3 years of historical data, 7 of 10 families with similar engagement patterns enrolled. Key factors: Visited fees 3+ times (+), Enquiry within 7 days of first visit (+), Referral source (+), No open day booked yet (−)."
Note: V1.5 uses pattern-matching heuristics. V2+ may introduce a trained ML model for higher accuracy.

8.6 Alerts System
Description Real-time email and in-dashboard notifications to the admissions team when a prospect reaches a score threshold or triggers a pattern flag.
Functional Requirements
Email alert when prospect enters Hot band (80+)
Daily digest email: top 5 prospects to contact today
Alert when previously warm prospect goes cold (drops below 50)
Alert when Silent Stalker pattern detected
Alert contains: name, phone, score, enrolment probability, reason for alert, suggested action script, projected family value
Admissions team can set alert preferences (immediate / daily / weekly)
Alerts sent via Resend API
Alert Email Format
Subject: 🔥 Hot Prospect — James Thompson (Score: 84 · 73% likely to enrol)

James Thompson has been visiting your website for 14 days.

📱 07891 234567
👧 Emily — Year 7 September 2026
💰 Projected family value: £285,000

Why call now:
→ Returned to site today
→ Visited fees page 3 times
→ Has not booked open day
→ 73% enrolment probability based on similar families

Suggested opening:
"Hi James, I wanted to personally follow up on 
Emily's application and make sure you have all 
the information you need..."

[View Full Profile]  [Mark as Called]  [Book Open Day]

8.7 AI-Powered Summaries (Claude API)
Description Claude API generates a plain-English summary of each prospect's behaviour, intent signals, and recommended next action — displayed at the top of every prospect profile. Summaries incorporate HubSpot CRM context and enrolment probability where available.
Functional Requirements
Generate summary on profile page load
Refresh when score changes by 10+ points or HubSpot deal stage changes
Summary must include: intent assessment, key signals, enrolment probability context, recommended action, suggested call script opener
When HubSpot data is available: incorporate deal stage, last CRM activity, and competitor risk
Tone: professional, concise, actionable — written for admissions secretaries
Maximum 4 sentences
Example Output
"James has visited your fees page three times this week, suggesting strong interest but possible budget sensitivity. He enquired five days ago but has not yet booked an open day — this is your best conversion window. Based on 3 years of enrolment data, families with his engagement pattern enrol 73% of the time — but those who don't book an open day within 10 days drop to 35%. We recommend a personal call today focusing on your bursary programme and inviting him to Saturday's open morning."

8.8 Dashboard
Description A clean, simple React dashboard. Designed for non-technical users — a busy admissions secretary should understand it within 5 minutes.
Page 1 — Pipeline Overview
Total prospects this month
Breakdown by score band (Hot / Warm / Interested / Cold)
Top 5 prospects to contact today (with phone numbers)
Live Activity Feed — real-time event stream from PostHog (pageviews, form submissions, scroll events), auto-refreshes every 30 seconds, shows identified names or numbered anonymous visitors
Pipeline revenue forecast summary
Acquisition insights from PostHog (traffic sources, conversion by channel, top campaigns, landing pages, device split, visitor regions)
Page 2 — Prospect List
Sortable by score, last seen, year of entry, enrolment probability
Filterable by band, year group, status
Search by name or email
One-click access to full profile
Page 3 — Individual Prospect Profile
Dual score rings: Engagement Score + Enrolment Probability
AI summary at top (incorporating HubSpot context)
HubSpot CRM data card (deal stage pipeline, owner, communications, deal value)
GA4 acquisition data card (source, device, landing page, location, sessions)
Family lifetime value card
Full interaction timeline
Contact details with click-to-call
Suggested call script
Notes field for admissions team
Status update (active / enrolled / lost)
Page 4 — Revenue Intelligence
Enrolment funnel visualisation (website visitor → identified → tour → application → offer → enrolled)
Pipeline revenue forecast: area chart with optimistic / projected / conservative lines
Closed-loop campaign ROI table (spend → sessions → prospects → enrolments → enrolled revenue → ROI multiplier)
Competitor loss intelligence (which schools won families, fee value lost, behavioural patterns)
Revenue metric cards: pipeline value, projected revenue, campaign ROI, average lifetime value
Top 5 prospects by family lifetime value
Page 5 — Settings
Alert preferences (immediate / daily digest / weekly)
Form field mapping (map school's enquiry form fields to SprX EnrollIQ fields)
GA4 property ID connection and sync status
HubSpot API connection, sync status, and deal stage mapping
Team email addresses for alerts
Page 6 — Website Intelligence
Website Health Score (0–100) with component breakdown
Priority recommendations with actionable detail
Enrolled vs non-enrolled journey comparison
Content gap detection panel
Page engagement heatmap (top pages by time, scroll depth, exits)
Mobile vs desktop comparison
Health score trend over time
Design Requirements
Mobile responsive
Load time <2 seconds
Colour-coded score bands throughout
Plain English — no technical jargon

8.9 HubSpot CRM Integration
Description Bi-directional integration with HubSpot CRM. SprX EnrollIQ reads deal and contact data from HubSpot to enrich prospect profiles, power predictive scoring, and enable revenue intelligence. SprX EnrollIQ writes enrichment data (engagement score, pattern flags, AI summaries) back to HubSpot contact records.
Data Pulled from HubSpot
Contacts: lifecycle stage, lead status, owner, employer, custom properties
Deals: stage, value, pipeline, close date, lost reason, associated contacts
Communications: email count, call count, meeting count, last activity date
Historical outcomes: all closed deals (enrolled/lost) from past 2–3 intake years
Data Pushed to HubSpot
SprX EnrollIQ engagement score → custom contact property
Score band → custom contact property
Enrolment probability → custom contact property
Pattern flag → custom contact property
AI summary → custom contact property (updated daily)
Key website behaviour signals → HubSpot activity timeline notes
Deal Stage Mapping
HubSpot Deal Stage
SprX EnrollIQ Status
Enquiry
Active — Interested
Tour Booked
Active — Warm
Tour Attended
Active — Warm
Application Submitted
Active — Hot
Offer Made
Active — Hot
Accepted
Active — Hot
Enrolled
Enrolled
Lost
Lost

Functional Requirements
Connect via HubSpot OAuth in Settings page
Sync contacts and deals every 15 minutes
Display HubSpot deal stage as visual pipeline on prospect profile
Show deal owner, value, communications count, last CRM activity
Capture lost reason and competitor when deal marked "Lost"
Aggregate lost reasons for competitor intelligence dashboard
Pull historical deals for predictive enrolment probability model
Push SprX EnrollIQ scores and summaries back to HubSpot
Handle API rate limits gracefully (HubSpot: 100 requests/10 seconds)
Cache HubSpot data locally with 15-minute TTL
Graceful degradation if HubSpot API unavailable (show cached data with "last synced" timestamp)

8.10 Revenue Intelligence
Description A dedicated dashboard page providing financial intelligence — connecting website behaviour and CRM data to actual and projected fee income. Designed for Heads, Bursars, and Directors of Admissions.
Enrolment Funnel Visual funnel showing the full prospect journey with conversion rates at each stage. Data sourced from SprX EnrollIQ tracking (visitors, prospects) and HubSpot Deals (tours onwards). Revenue figure displayed at funnel base: "Projected: 12 enrolled — £1.84M annual fee income."
Pipeline Revenue Forecast Area chart showing projected enrollment revenue over 6 months across three scenarios (optimistic / projected / conservative) with shaded confidence band. Updated in real time as prospects move through HubSpot deal stages.
Campaign Revenue Attribution Traces marketing spend through to enrolled fee income — the feature no other school admissions tool provides.
Campaign
Source
Spend
Sessions
Prospects
Enrolments
Enrolled Revenue
ROI
spring_open_day_2026
Google Ads
£480
142
6
2
£57,000
11,775%
admissions_awareness
Facebook
£320
98
4
1
£28,500
8,806%

Requires: GA4 campaign data + HubSpot deal outcomes + SprX EnrollIQ identity stitching.
Competitor Loss Intelligence Aggregated from HubSpot deal lost reasons. Shows which competitor schools are winning families, total fee value lost per competitor, and behavioural patterns of lost families. Actionable insight generation: "63% of competitor losses showed fee-checking behaviour — consider early bursary discussion in tours."
Family Lifetime Value Calculated from annual fees × projected years (year group to Year 13) × number of children. Factors in known siblings from HubSpot contact data. Top lifetime value prospects highlighted for priority treatment.
Functional Requirements
All monetary values in GBP
Revenue forecast updates in real time as HubSpot deals progress
Campaign attribution requires GA4 + HubSpot + SprX EnrollIQ all connected
Competitor analysis requires minimum 6 months of historical HubSpot deal data
Export revenue forecast as PDF for board reports (V2)

8.11 Website Intelligence
Description A data-driven website audit and recommendation engine that analyses prospect browsing behaviour to identify content gaps, navigation issues, and conversion blockers on the school's website. By comparing the journeys of families who enrolled against those who didn't, Website Intelligence tells schools exactly what to fix on their website to convert more families.
How It Works
SprX EnrollIQ already tracks every page view, scroll depth, click, and session across the school website. Website Intelligence aggregates this data to surface actionable patterns:
1. Compare enrolled vs non-enrolled families — identify which pages, content, and journeys correlate with successful enrolment
2. Detect missing content — if prospects repeatedly search for or navigate towards content that doesn't exist (e.g. fees, bursaries, bus routes), flag it
3. Identify drop-off points — pages where prospects leave the site or disengage, indicating poor content or UX
4. Benchmark engagement — compare the school's website engagement metrics against anonymised benchmarks from the SprX portfolio (V2)
Website Health Score
An overall score (0–100) reflecting how well the school's website supports the admissions journey. Composed of:
Component | Weight | Measures
Content completeness | 30% | Do key admissions pages exist and contain sufficient detail?
Navigation effectiveness | 20% | Can prospects find key pages within 2 clicks?
Engagement depth | 25% | Average scroll depth, time on page, pages per session
Mobile experience | 15% | Mobile bounce rate, mobile session duration vs desktop
Conversion path clarity | 10% | Is the journey from landing page to enquiry form clear and short?
Recommendation Categories
Priority | Type | Example
High | Missing content | "73% of visitors search for 'fees' but no dedicated fees page exists — schools with visible fees convert 2x better"
High | Thin content | "Average time on your admissions page is 18 seconds — this suggests insufficient detail. Add entry requirements, key dates, and a clear call to action"
High | Conversion blockers | "Your enquiry form is 4 clicks deep from the homepage — move it to 2 clicks or add a sticky CTA"
Medium | Mobile issues | "68% of parents browse on mobile but your mobile bounce rate is 3x desktop — investigate mobile layout"
Medium | Missing media | "Schools with virtual tour content see 40% more open day bookings — consider adding a virtual tour"
Medium | Buried content | "Your prospectus download is 3 clicks deep — it's your most downloaded asset, make it prominent"
Low | Navigation | "23% of visitors use site search for 'scholarships' — add it to your main navigation"
Low | Engagement | "Your staff profiles page has high engagement (4.2 min avg) but low discoverability — promote it on the homepage"
Enrolled vs Non-Enrolled Analysis
The most powerful insight: comparing the website journeys of families who enrolled against those who didn't.
Enrolled families typically: | Non-enrolled families typically:
Visited fees page (92%) | Left after 2 pages (70%)
Viewed admissions process (88%) | Never found fees page (65%)
Watched virtual tour (76%) | Short sessions under 1 minute (58%)
Booked open day online (71%) | Never saw admissions process (54%)
Visited staff profiles (65%) | Visited homepage only (48%)
Output: "Families who don't find your fees and admissions pages within their first visit are 4x less likely to enrol. Make these pages more prominent in your navigation."
Functional Requirements
Calculate and display Website Health Score (0–100) with breakdown by component
Generate prioritised recommendations based on actual visitor behaviour data
Compare enrolled vs non-enrolled family journeys (requires HubSpot integration and minimum 20 historical outcomes)
Detect missing or thin content pages based on search queries, navigation patterns, and exit pages
Identify mobile-specific issues by comparing mobile vs desktop engagement metrics
Track recommendation status (new / acknowledged / actioned / dismissed)
Refresh recommendations weekly based on latest behavioural data
Display before/after metrics when a recommendation is actioned (e.g. "Since adding a fees page, fee-page views increased 340% and enquiry rate increased 12%")
Dashboard Page
Page 6 — Website Intelligence
Website Health Score with component breakdown ring chart
Priority recommendations list with actionable detail
Enrolled vs non-enrolled journey comparison (visual flow)
Content gap detection panel
Page-level engagement heatmap (top pages by time, scroll, exits)
Mobile vs desktop comparison metrics
Trend chart showing Website Health Score over time
Data Requirements
Minimum 30 days of tracking data to generate initial recommendations
Minimum 20 historical enrolled/lost outcomes (from HubSpot) for enrolled vs non-enrolled analysis
Recommendations improve in accuracy and specificity as more data accumulates
Note: Website Intelligence is a unique differentiator — no other admissions tool analyses school website content effectiveness using actual prospect behaviour data. This feature positions SprX EnrollIQ not just as an admissions tool but as a website optimisation advisor, increasing its value proposition and stickiness.

8.12 Nurture Email Sequences
Description Automated, behaviour-triggered email sequences sent to prospects on behalf of the school.
Sequences (MVP)
Trigger
Sequence
Enquiry submitted
3-email welcome sequence over 7 days
Open day not booked after 5 days
Open day invite email
Prospect going cold (score decaying)
Re-engagement email from Head
Open day attended, no follow-up action
Post-visit nurture sequence

Functional Requirements
Emails sent from school's own email domain (via Resend)
Personalised with prospect and child name
School branding (logo, colours)
Unsubscribe link (GDPR compliant)
Open and click tracking feeds back into prospect score
Admissions team can pause or override sequences per prospect

9. Technical Architecture
Stack
Layer
Technology
Tracking Script
track.js wrapper + PostHog JS SDK (loaded from CDN)
Event Tracking & Analytics
PostHog Cloud (event ingestion, person profiles, insights API)
Backend API
FastAPI (Python) — reads from PostHog API, serves dashboard data
Database
PostgreSQL (school config, alert preferences, notes, nurture sequences)
Scoring Engine
Python (reads PostHog person properties, computes engagement score)
Predictive Model
Python (pattern matching V1.5, ML V2)
AI Summaries
Claude API (claude-sonnet-4-20250514)
Dashboard Frontend
React + Tailwind CSS + Vite
Email Delivery
Resend API
GA Integration
Google Analytics Data API v1 (optional — PostHog covers core metrics)
CRM Integration
HubSpot API v3
Hosting
AWS
Authentication
JWT + school-scoped data isolation

Data Flow
School Website
      ↓
track.js (loads PostHog JS SDK, configures with school API key)
      ↓
PostHog Cloud (event store, person profiles, analytics)
      ↓
FastAPI Backend (reads PostHog API: persons, events, insights)
      ↓
Scoring Engine (computes engagement score from PostHog data)
      ↓
Claude API (summary generation)
      ↓
React Dashboard + Alert Emails

HubSpot CRM ←→ SprX EnrollIQ API (bi-directional, every 15 mins)
      ↓
Predictive Model (historical outcomes → enrolment probability)
      ↓
Revenue Intelligence (funnel, forecast, attribution, competitor analysis)

GA4 Data API → SprX EnrollIQ API (optional enrichment, every 24 hours)
      ↓
Supplementary campaign attribution data
Security & Compliance
All data encrypted at rest (PostgreSQL)
HTTPS only (Let's Encrypt)
School data fully isolated (school_id scoping on all queries)
GDPR compliant — anonymous tracking until explicit form consent
HubSpot data accessed via school's own API credentials
Data retention: prospect data deleted after 2 years of inactivity
No data sold or shared with third parties

10. Data Ownership & Portability
Note: Full data ownership policy to be confirmed following internal company discussion. Interim position below.
Schools own their prospect data
Full CSV/JSON export available to schools at any time on request
On subscription cancellation: 90-day data retention window before permanent deletion
SprX EnrollIQ does not sell or share school-level data with any third party
Use of aggregate anonymised data for cross-school benchmarking: TBD — pending internal review
HubSpot data remains the school's property at all times and is accessed under the school's own credentials

11. Installation & Deployment
SprXcms Sites (Primary)
Single template modification in SprXcms base layout. Script tag added to <head> of all pages with school ID as data attribute. Deployable across all Interactive Schools sites in a single push.
Google Tag Manager
Published as GTM tag template. Installed via existing GTM container — no code deployment required.
Manual Installation
html
<script src="https://app.sprxenrolliq.io/track.js"
        data-school-id="YOUR_SCHOOL_ID"
        data-api-key="YOUR_POSTHOG_PROJECT_API_KEY"
        async>
</script>
Note: Each school requires a PostHog project to be provisioned. The data-api-key is the PostHog public project API key (phc_...) used for event capture. A separate personal API key (phx_...) is configured on the backend for reading data from the PostHog API.
HubSpot Connection
OAuth-based connection flow in the Settings page. School admin authorises SprX EnrollIQ to read/write their HubSpot data. Automatic deal stage mapping with one-click setup. Historical deal import on first connection (past 2–3 years).

12. Pricing Model
Tier
Price
Features
Free
£0/month
Anonymous tracking only, limited dashboard, "upgrade to see who" teaser
Starter
£299/month
Up to 50 named prospects/month, full scoring, email alerts
Growth
£499/month
Unlimited prospects, nurture sequences, Claude AI summaries, GA4 insights
Pro
£799/month
HubSpot integration, Revenue Intelligence, predictive scoring, campaign ROI, competitor analysis
Enterprise
£1,199/month
Multi-site (school groups), API access, priority support, custom integrations

Pro tier available from V1.5 launch (Month 4–6) once HubSpot integration is complete.
Setup Fee
£500 one-time onboarding fee (form mapping, GA4 connection, HubSpot connection, team training). Waived for the first 10 pilot schools.
ROI Justification
One additional enrolment = £15,000–£50,000 in annual fees. SprX EnrollIQ Pro = £9,588/year. ROI: 1.5x–5x on a single converted prospect. Revenue Intelligence provides the board-level data to justify this spend: "Our £480 Google Ads campaign generated £57,000 in enrolled fee income."

13. Go-To-Market Strategy
Phase 0 — Pre-Build (Now)
Conduct discovery interviews with 3–5 admissions directors from existing Interactive Schools clients
Identify 1 champion school for pilot
Confirm GDPR compliance position before any pilot deployment
Confirm HubSpot App Marketplace application timeline
Phase 1 — Internal Pilot (Months 1–3)
Deploy tracking script across all 200 Interactive Schools websites (free tier)
Identify 3 schools with highest prospect volume as paid pilot candidates
Offer 3-month free trial of Growth tier in exchange for feedback and case study
Phase 2 — Paid Launch (Months 4–6)
Convert pilot schools to paid
Connect HubSpot for pilot schools — demonstrate Revenue Intelligence
Apply to HubSpot App Marketplace for verified integration listing
Present at AMCIS (Admissions, Marketing & Communications in Independent Schools) conference
Case studies:
"How [School Name] increased open day bookings by X% with SprX EnrollIQ"
"How [School Name] traced £450K in fee income back to a single £480 campaign"
Target: 10 paying schools
Phase 3 — Scale (Months 7–24)
LinkedIn content targeting admissions directors, registrars, and bursars
Partner with iSAMS and OpenApply as complementary enrichment layer
School referral programme
Revenue Intelligence demo as primary sales tool for Heads and Bursars
Target: 50 paying schools

14. Risks & Mitigations
Risk
Likelihood
Impact
Mitigation
Schools concerned about GDPR
High
High
Clear privacy policy template, anonymous-first approach, legal review before pilot
Low dashboard adoption by admissions staff
Medium
High
Obsess over UX simplicity, onboarding training session included in setup fee
GA4 API access blocked by school
Medium
Medium
Fall back to own tracking script for all data — no feature loss
Competitor copies the idea
Low
Medium
Speed to market + distribution moat (200 sites) + HubSpot integration depth
HubSpot API changes or rate limits
Medium
Medium
Cache data locally, build abstraction layer, monitor HubSpot changelog
Schools don't have clean HubSpot data
Medium
Medium
Provide onboarding data audit, deal stage mapping wizard, minimum viable data approach
Predictive model accuracy low with small datasets
Medium
Low
Start with pattern-matching heuristics, require minimum 20 historical deals, clearly label confidence level


15. Phased Roadmap
V1.0 — MVP (Weeks 1–12)
Tracking script (SprXcms + GTM)
GA4 API integration
Identity stitching
Scoring engine
Dashboard: Pipeline Overview, Prospect List, Prospect Profile
Email alerts (Resend)
Claude API summaries
V1.5 — Revenue Intelligence & Website Intelligence (Months 4–6)
HubSpot CRM integration (contacts, deals, communications)
HubSpot deal stage visualisation on prospect profiles
Closed-loop revenue attribution (campaign → enrolled revenue)
Enrolment funnel visualisation
Predictive enrolment probability (pattern-matching vs historical outcomes)
Pipeline revenue forecast
Competitor loss intelligence
Family lifetime value calculation
Revenue Intelligence dashboard page
Website Intelligence — health score, recommendations, content gap detection
Enrolled vs non-enrolled journey comparison
Recommendation tracking and before/after impact metrics
Nurture email sequences
Score decay and going-cold alerts
Pattern detection flags
Dashboard mobile optimisation
Notes and call logging
V2.0 — Scale (Months 7–12)
iSAMS and OpenApply integration
Multi-user team accounts with roles
Self-serve onboarding and billing (Stripe)
ML-trained predictive scoring model
Revenue forecast PDF export for board reports
Anonymised cross-school benchmarking
V3.0 — Intelligence (Year 2)
Pre-enquiry chat capture (identity before form submission)
Personalised video message triggers
Predictive re-enrolment risk scoring (existing families)
AI-generated open day invitation copy
School group / multi-campus support

16. Open Questions
Question
Owner
Priority
GDPR legal review — required before pilot or post-pilot?
TBD
🔴 Critical
Data ownership policy — use of aggregate data for benchmarking
Internal discussion pending
🟡 Important
HubSpot App Marketplace — apply during V1.5 build or post-launch?
TBD
🟡 Important
Minimum historical deal count required for reliable predictive scoring?
Technical
🟢 V1.5


Document version 2.2 — Updated: PostHog integrated as event tracking and analytics engine (replacing custom event ingestion), GA4 integration reclassified as optional, tracking script updated to reflect PostHog JS SDK wrapper architecture, data flow diagram updated, Live Activity Feed added to dashboard, installation instructions updated with PostHog API key requirements.
Previous: v2.1 — product renamed to SprX EnrollIQ, HubSpot adoption confirmed across majority of client base, data ownership section added (pending internal review), open questions refined.
Subject to revision following pilot school discovery interviews.


