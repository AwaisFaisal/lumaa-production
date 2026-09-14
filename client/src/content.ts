export type Moment = {
  title: string;
  kicker: string;
  image?: string;
  alt: string;
  tone: "cream" | "burgundy" | "terracotta";
};

export type Stat = {
  value: string;
  label: string;
  detail?: string;
  badge?: string;
  sourceLabel: string;
  sourceUrl: string;
  tone: "cream" | "burgundy" | "terracotta";
};

export type Property = {
  title: string;
  category: string;
  description: string;
  note?: string;
  status?: string;
  interest: string;
  tone: "burgundy" | "terracotta" | "cream";
};

/**
 * Replace the empty image strings with licensed image URLs.
 * The layout, responsive crops, and fallback treatments are already implemented.
 */
export const media = {
  heroPrimary: "",
  heroSecondary: "",
  heroTertiary: "",
  founder: "",
} as const;

export const moments: Moment[] = [
  {
    kicker: "The ones you know...",
    title: "The Hot-Flash-in-a-Snowstorm Moments.",
    image: "",
    alt: "A stylish woman outdoors in winter",
    tone: "cream",
  },
  {
    kicker: "And the ones we don’t say out loud...",
    title: "The Everyone-Calls-Me-and-I-Call-No-One Moments.",
    image: "",
    alt: "A woman holding a warm drink in a quiet moment",
    tone: "burgundy",
  },
  {
    kicker: "And the ones that change everything...",
    title: "The Started-Over-and-Never-Felt-More-Myself Moments.",
    image: "",
    alt: "A confident woman beginning a new chapter",
    tone: "terracotta",
  },
  {
    kicker: "The ones that arrive after midnight...",
    title: "The Wide-Awake-at-3AM Moments.",
    image: "",
    alt: "A woman awake and reflective at night",
    tone: "burgundy",
  },
];

export const stats: Stat[] = [
  {
    value: "1.14B",
    label: "women age 60+ globally by 2050.",
    detail: "Up from 605M in 2020.",
    badge: "PROJECTED",
    sourceLabel: "AARP + FP Analytics",
    sourceUrl:
      "https://www.aarpinternational.org/resources/unleashing-the-economic-potential-of-older-women",
    tone: "cream",
  },
  {
    value: "8.8%",
    label:
      "of NIH research grant spending in FY2013–FY2023 was estimated to support women’s health research.",
    badge: "ESTIMATED",
    sourceLabel: "National Academies of Sciences, Engineering, and Medicine",
    sourceUrl: "https://www.nationalacademies.org/read/28586/chapter/12",
    tone: "burgundy",
  },
  {
    value: "61%",
    label: "of family caregivers in the U.S. are women.",
    sourceLabel: "Caregiving in the U.S. 2025, AARP/NAC",
    sourceUrl:
      "https://www.aarp.org/pri/topics/ltss/family-caregiving/caregiving-in-the-us-2025/",
    tone: "cream",
  },
  {
    value: "98%",
    label:
      "of surveyed women entrepreneurs age 40+ said starting their business was the right decision.",
    badge: "SURVEYED",
    sourceLabel: "AARP Research, 2022",
    sourceUrl:
      "https://www.aarp.org/pri/topics/work-finances-retirement/employers-workforce/women-small-business-entrepreneurs/",
    tone: "cream",
  },
  {
    value: "13.4%",
    label:
      "of employed women ages 45–60 in a Mayo Clinic study reported a menopause-related adverse work outcome.",
    badge: "STUDY",
    sourceLabel: "Mayo Clinic Proceedings",
    sourceUrl: "https://pubmed.ncbi.nlm.nih.gov/37115119/",
    tone: "terracotta",
  },
];

export const properties: Property[] = [
  {
    title: "The MIDICON",
    category: "Live Experiences",
    description: "Women are having a moment. These are the conversations.",
    note: "One room. One conversation at a time.",
    interest: "midicon",
    tone: "burgundy",
  },
  {
    title: "The Midlife Power Index",
    category: "Insights + Studies",
    description:
      "An original LUMAA study exploring how women experience power across the different parts of their lives in midlife and aging.",
    status: "Coming Soon",
    interest: "power-index",
    tone: "cream",
  },
  {
    title: "The Load Off",
    category: "Media + Editorial",
    description:
      "Stories and conversations about what women carry, what we put down and what comes next.",
    status: "Coming Soon",
    interest: "load-off",
    tone: "terracotta",
  },
  {
    title: "The LUMAA Collection",
    category: "Apparel + Accessories",
    description: "Made for midlife. Made to say something.",
    status: "Coming Soon",
    interest: "collection",
    tone: "burgundy",
  },
];

export const siteConfig = {
  domain: "https://www.wearelumaa.com",
  instagramUrl: "",
  linkedInUrl: "",
  /** Optional public form endpoints, such as Formspree or a provider embed endpoint. */
  newsletterEndpoint: import.meta.env.VITE_NEWSLETTER_ACTION_URL ?? "",
  momentEndpoint: import.meta.env.VITE_MOMENT_ACTION_URL ?? "",
} as const;
