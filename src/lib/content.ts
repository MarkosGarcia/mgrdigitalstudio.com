export type Service = {
  slug: string;
  name: string;
  shortName: string;
  tagline: string;
  description: string;
  longDescription: string;
  features: string[];
  idealFor: string[];
  /** Display string — a range, not a bare floor. A single "From $X" figure
   *  invites everyone to assume that's the price; a range sets expectations
   *  honestly while still giving an answer engine a real number to quote. */
  startingPrice: string;
  /** Numeric low/high in CAD, for the page's structured data — kept separate
   *  from the display string above so the JSON-LD never has to parse prose. */
  priceLow: number;
  priceHigh: number;
  priceUnit: "project" | "month";
};

export const services: Service[] = [
  {
    slug: "landing-pages",
    name: "Landing Pages",
    shortName: "Landing pages",
    tagline: "One page. One offer. One thing to do.",
    description:
      "A single page built around one offer — for when you're running ads or a promotion and need that traffic to actually do something.",
    longDescription:
      "If you're paying for traffic, sending it to your homepage wastes most of it. A landing page gives a visitor one thing to look at and one thing to do. No menu to wander off into, no six other services competing for attention. Just the offer, the reasons to believe it, and an easy way to say yes.",
    features: [
      "One page, one goal",
      "Copy written around your offer",
      "Loads fast on a phone",
      "Form or call button that actually gets used",
      "Set up so you can see what's working",
    ],
    idealFor: ["Google or Facebook ads", "A seasonal promotion", "Launching one new service"],
    startingPrice: "$1,900 – $3,200",
    priceLow: 1900,
    priceHigh: 3200,
    priceUnit: "project",
  },
  {
    slug: "business-websites",
    name: "Business Websites",
    shortName: "Business websites",
    tagline: "The site people find when they look you up.",
    description:
      "Usually four to eight pages: what you do, who you are, proof you're real, and an obvious way to get in touch.",
    longDescription:
      "Most people will check your website before they call you. They're not reading it closely — they're deciding in a few seconds whether you look like a real business worth phoning. A good site answers that fast: here's what you do, here's the area you cover, here's what it costs, here's the button to call. That's most of the job.",
    features: [
      "Four to eight pages, written and designed",
      "Built for phones first",
      "Set up to show in local search",
      "You can edit the text yourself",
      "Hosting and launch handled",
    ],
    idealFor: ["Trades and home services", "Clinics and practices", "Anyone whose site is five years old"],
    startingPrice: "$4,800 – $9,500",
    priceLow: 4800,
    priceHigh: 9500,
    priceUnit: "project",
  },
  {
    slug: "website-care",
    name: "Website Care",
    shortName: "Website care",
    tagline: "Someone keeping an eye on it.",
    description:
      "Updates, backups, monitoring, and small changes when you need them — so the site doesn't quietly rot.",
    longDescription:
      "Websites decay. Software goes out of date, forms silently stop sending, a plugin update breaks a page and nobody notices for two months. Care is the boring, useful stuff: keeping it updated, backed up, and working — plus a bit of time each month for the small changes you'd otherwise never get around to asking for.",
    features: [
      "Updates and backups",
      "I get told if the site goes down, not you",
      "Small text and photo changes each month",
      "Forms checked so leads don't vanish",
      "You email me directly — no ticket queue",
    ],
    idealFor: ["No one in-house who handles this", "Sites taking bookings or payments"],
    startingPrice: "$199 – $349 /month",
    priceLow: 199,
    priceHigh: 349,
    priceUnit: "month",
  },
  {
    slug: "website-growth",
    name: "Website Growth",
    shortName: "Website growth",
    tagline: "Keep improving it after launch.",
    description:
      "Monthly work to get more out of the traffic you already have, instead of buying more of it.",
    longDescription:
      "Launch day is a guess — an educated one, but a guess. Growth is what happens after: looking at what people actually do on the site, changing the things that are losing them, and doing it again next month. It's slower and less exciting than a redesign, and it's usually where the money is.",
    features: [
      "Changes based on what visitors actually do",
      "A plain-English report each month",
      "Testing headlines, offers, and pages",
      "Ongoing search visibility work",
      "A call every quarter to decide what's next",
    ],
    idealFor: ["Sites already getting traffic", "Businesses spending on ads"],
    startingPrice: "$1,300 – $2,600 /month",
    priceLow: 1300,
    priceHigh: 2600,
    priceUnit: "month",
  },
];

export type Capability = { name: string; description: string };

/**
 * The broader toolkit — real skills, not fixed-price packages like the four
 * above. These get scoped on a call rather than quoted sight-unseen, so they
 * show up as a plain list rather than another set of "starting at" cards.
 */
export const capabilities: Capability[] = [
  {
    name: "SEO",
    description: "Getting found in Google for what you actually do, not just your business name.",
  },
  {
    name: "Google Business Profile Optimization",
    description: "The map listing that shows up before your website does, filled in properly and kept current.",
  },
  {
    name: "Conversion Optimization",
    description: "Turning the traffic you already get into more calls and bookings, without spending more on ads.",
  },
  {
    name: "AI Search Optimization",
    description: "Showing up when someone asks ChatGPT or Google's AI answers instead of typing a search.",
  },
  {
    name: "Marketing",
    description: "Planning and running the campaigns that bring people to the site in the first place.",
  },
  {
    name: "Marketing Automation",
    description: "Follow-up emails and reminders that go out on their own, so no lead sits ignored.",
  },
  {
    name: "Analytics",
    description: "Knowing what's actually happening on your site — where visitors come from, and where they leave.",
  },
  {
    name: "Paid Advertising",
    description: "Google and Meta ads set up and managed so the budget goes to people likely to actually call.",
  },
];

export type Project = {
  client: string;
  business: string;
  url: string;
  sector: string;
  summary: string;
  /** What the client's site had to solve, before any design happened. */
  problem: string;
  /** What the site actually does about it — the real, specific choices,
   *  not a feature list. No invented metrics: only claims that are true
   *  of what shipped, not guesses about what it caused. */
  approach: string;
  built: string[];
};

/** Real client work. Every entry here is a site I actually built and a
 *  client who agreed to be named. */
export const projects: Project[] = [
  {
    client: "Courtney Janelle Smith",
    business: "Courtney Janelle Studio",
    url: "https://courtneyjanellestudio.ca/",
    sector: "Original art · Ottawa",
    summary:
      "Large-scale original paintings for luxury homes — statement pieces up to 8'×4' for foyers, great rooms and stairwells. The work is the product, so the site had to get out of its own way and let the paintings fill the screen.",
    problem:
      "An artist selling large, expensive, one-of-a-kind pieces to design-conscious buyers. A generic template would have competed with the paintings instead of showcasing them, and buyers at this price point expect to see the work at real scale before they'll ask about a piece.",
    approach:
      "A gallery-led layout that puts every painting full-bleed and lets it fill the screen, with the enquiry form kept out of the way until someone's actually ready to ask about a piece. Built mobile-first, since a buyer forwarding a link to a partner or a designer is looking at it on a phone.",
    built: ["Gallery-led layout", "Enquiry form", "Mobile-first"],
  },
  {
    client: "Marcio Oliveira",
    business: "BBJ Flooring Corp",
    url: "https://bbjflooring.ca/",
    sector: "Flooring · Ottawa",
    summary:
      "Owner-operated flooring installation — tile and stone, vinyl, laminate and carpet. A trades site where the whole job is making it obvious what he installs, that he's WSIB insured, and how to get a free estimate without hunting for a number.",
    problem:
      "A one-person flooring business competing against larger installers who show up first in search. Homeowners comparing quotes decide fast, and a site that buries the phone number or doesn't say WSIB-insured up front loses that comparison before a call even happens.",
    approach:
      "Click-to-call in the header on every screen, WSIB insurance stated where a homeowner is actually looking for it, and a free-estimate flow that asks for the job details up front instead of making someone wait for a callback to find out if it's even worth booking.",
    built: ["Click-to-call", "Free estimate flow", "Trust signals up front"],
  },
];

export type Testimonial = {
  quote: string;
  client: string;
  business: string;
  url: string;
  /**
   * Only `true` once the client has read the exact wording and confirmed it.
   * Anything false is a draft awaiting sign-off and is never rendered —
   * putting unapproved words next to a real, named, findable person is the
   * same problem as inventing a testimonial outright.
   */
  approved: boolean;
};

export const testimonials: Testimonial[] = [
  {
    quote:
      "Marcos built my site around the paintings instead of around a template. It loads fast, it looks like my work, and people can actually reach me now.",
    client: "Courtney Janelle Smith",
    business: "Courtney Janelle Studio",
    url: "https://courtneyjanellestudio.ca/",
    approved: false,
  },
  {
    quote:
      "He understood the trade straight away. The site says what I install, shows I'm insured, and the call button is right where people need it. Estimates come in from it.",
    client: "Marcio Oliveira",
    business: "BBJ Flooring Corp",
    url: "https://bbjflooring.ca/",
    approved: false,
  },
];

export const approvedTestimonials = () => testimonials.filter((t) => t.approved);

export type ReviewPlatform = { name: string; href: string; icon: "google" | "yelp" | "clutch" };

// Fill in each href once the profile exists — entries with an empty href are
// hidden rather than linking somewhere dead.
export const reviewPlatforms: ReviewPlatform[] = [
  { name: "Google Business Profile", href: "", icon: "google" },
  { name: "Yelp", href: "", icon: "yelp" },
  { name: "Clutch", href: "", icon: "clutch" },
];

export type FaqItem = { question: string; answer: string };

export const faqs: FaqItem[] = [
  {
    question: "How new is this business?",
    answer:
      "New — I started in 2026 and I'm still building my client roster. You can see the sites I've built on the Work page and visit them yourself. That's exactly why the early pricing is what it is, and why you'll get more attention than you would from a shop with forty accounts on the go. If you'd rather hire someone with fifteen years of case studies, that's a completely reasonable call and I won't try to talk you out of it.",
  },
  {
    question: "How much does it cost?",
    answer:
      "Landing pages typically run $1,900–$3,200. Business websites run $4,800–$9,500. Care plans are $199–$349/month, growth work $1,300–$2,600/month. What moves you within the range is how many pages there are and whether you need the writing done. You get a fixed number before anything starts — no hourly surprises.",
  },
  {
    question: "How long does it take?",
    answer:
      "A landing page is usually one to two weeks. A business website is three to six. The part that slows projects down is almost always waiting on content and feedback, so if you're quick, I'm quick.",
  },
  {
    question: "Do I have to be in Ottawa?",
    answer:
      "No. I'm in Ottawa and happy to meet in person if you're local, but most of this works fine over a call and email. I work with businesses across Canada and the U.S.",
  },
  {
    question: "Who writes the words?",
    answer:
      "I can, and it's included in the quote if you want it. Some people would rather write their own — that's fine too, and it's cheaper. What doesn't work is a half-finished document three weeks after launch, so we'll agree up front which of us is doing it.",
  },
  {
    question: "Can I update it myself afterwards?",
    answer:
      "Yes. I set it up so you can change text, photos, and prices without calling me. Anything structural, I'd rather you asked — that's what the care plan is for.",
  },
  {
    question: "What if I already have a website?",
    answer:
      "Then the first question is whether it needs replacing or just fixing. Sometimes it's a rebuild. Sometimes it's a faster host, a clearer homepage, and a phone number people can actually find. I'll tell you which one it is, even when the answer is the cheaper one.",
  },
  {
    question: "What happens on the free review?",
    answer:
      "You send me your site and what you want more of. I spend an hour or so on it and send back two or three specific things I'd change and why. No slide deck, no score out of 100. If you want me to do the work, there's a quote at the bottom. If you don't, keep the list and do it yourself.",
  },
];

export type ProcessStep = { title: string; description: string };

export const processSteps: ProcessStep[] = [
  {
    title: "A call",
    description:
      "Twenty minutes on what your business does, who calls you, and what you wish happened more often.",
  },
  {
    title: "A fixed quote",
    description:
      "What I'd build, what it costs, and when it's done. One page, no retainer language to decode.",
  },
  {
    title: "Build and review",
    description:
      "You see the real site on a private link partway through, not a mockup. Changes happen there.",
  },
  {
    title: "Launch, then check in",
    description:
      "I handle the domain and hosting switch. A few weeks later I look at what's actually happening on it.",
  },
];

// The honest counterweight to a sales page: saying plainly who I'm wrong for
// does more for trust than another paragraph about how great I are.
export const notAFit: string[] = [
  "You need it live this week.",
  "You want the cheapest possible site and nothing else matters.",
  "You're after a big brand identity project — logos, packaging, campaigns.",
  "You need a complex web app, a marketplace, or a custom booking system.",
  "You want someone to run your social media and ads as well.",
];

export const aFit: string[] = [
  "You run a small business and your website isn't pulling its weight.",
  "You'd rather have four pages that work than twelve that don't.",
  "You want to talk to the person actually building it.",
  "You can get me content and feedback within a week or so.",
];

export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  category: string;
  content: string[];
};

export const blogPosts: BlogPost[] = [
  {
    slug: "5-signs-your-website-is-losing-customers",
    title: "Five things to check on your own website tonight",
    excerpt:
      "You don't need an audit to find most of what's wrong with a small business website. Here's what to look at yourself.",
    date: "2026-06-02",
    readTime: "5 min read",
    category: "Conversion",
    content: [
      "A website can look completely fine and still not bring in any work. Most of the reasons are boring and fixable, and you can find them yourself in about ten minutes. Open your site on your phone and go through this list.",
      "Can a stranger tell what you do in three seconds? Not your industry — the actual thing. 'Ottawa plumber, same-day service' beats 'Excellence in residential solutions' every time. Read your homepage headline out loud. If it could belong to any company in your industry, it isn't doing anything.",
      "Is your phone number visible without scrolling? On a phone, right at the top, tappable. A surprising number of small business sites hide the one piece of information most visitors came for.",
      "How long does it take to load on data, not wi-fi? Turn wi-fi off and load it. If you're waiting more than a few seconds, you're losing people who will never know they were about to be a customer.",
      "Is there any evidence you're real? A photo of you or your van, the town you're in, a couple of reviews, a licence number. People are checking whether you're a real business before they call. Give them the answer.",
      "Does anything on it lie about how old it is? A copyright date from three years ago, a promotion that ended, a team member who left. Small things, but they make a visitor wonder what else is out of date.",
      "None of this needs a designer. If you fix these five yourself and the phone rings more, that's a good outcome and you've spent nothing.",
    ],
  },
  {
    slug: "landing-page-vs-website-which-do-you-need",
    title: "Landing page or full website?",
    excerpt:
      "They do different jobs. Here's the short version of which one your situation calls for.",
    date: "2026-05-18",
    readTime: "4 min read",
    category: "Strategy",
    content: [
      "This comes up on nearly every first call, so here's the plain answer.",
      "A landing page is one page with one offer and one action. No navigation, nowhere to wander. You use it when you're sending paid traffic somewhere — an ad campaign, a seasonal promotion, one specific service you're pushing. Because there's nothing else to click, a much higher share of that traffic does the thing you wanted.",
      "A website is the thing people find when they look you up. It has to work for a lot of different visitors: someone who got your name from a neighbour, someone searching at 11pm, someone deciding between you and two competitors. It needs to cover what you do, where you work, roughly what it costs, and how to reach you.",
      "The rough rule: if you're buying the traffic, build a landing page for it. If you're earning the traffic — search, referrals, the sign on your truck — you need the website.",
      "If you're spending money on ads and pointing them at your homepage, that's the most common expensive mistake in this whole category, and it's a cheap one to fix.",
    ],
  },
  {
    slug: "what-a-free-website-assessment-actually-covers",
    title: "What I actually do on a free website review",
    excerpt:
      "Most 'free audits' are a sales call with a PDF attached. Here's exactly what ours is, so you can decide if it's worth your time.",
    date: "2026-04-29",
    readTime: "3 min read",
    category: "Process",
    content: [
      "Let's be honest about what a free audit usually is: a lead magnet. You get an automated report with a score out of 100 and forty red items, most of which don't matter, and then someone calls you.",
      "Here's what mine is instead. You send me your website address and tell me one thing — what you want more of. More calls, more bookings, more quote requests. That's the whole intake.",
      "Then somebody actually opens your site. On a phone, on a laptop, the way a customer would. I look at whether it's clear what you do, whether the next step is obvious, how fast it loads, and whether you'd show up when someone nearby searches for what you sell.",
      "You get back a short email. Two or three specific things, in order of what I'd change first, and why. Sometimes the honest answer is that your site is fine and the problem is somewhere else — in which case I'll say that, and you'll have saved yourself a redesign.",
      "If you want me to do the work, there's a price at the bottom. If you don't, the list is yours. I'm new enough that I'd rather be useful to ten people and hired by two than pester all ten.",
    ],
  },
];

export type Industry = {
  category: string;
  examples: string[];
};

export const industries: Industry[] = [
  {
    category: "Trades and home services",
    examples: ["HVAC", "Plumbing", "Electrical", "Roofing", "Cleaning", "Renovation"],
  },
  {
    category: "Professional services",
    examples: ["Lawyers", "Accountants", "Realtors", "Mortgage brokers"],
  },
  {
    category: "Clinics and practices",
    examples: ["Dental", "Physiotherapy", "Chiropractic", "Massage therapy"],
  },
];
