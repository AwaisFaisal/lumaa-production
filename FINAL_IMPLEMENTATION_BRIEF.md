# LUMAA Landing Page

## Final Creative and Implementation Brief

**Status:** Approved content structure and domain; final founder portrait and licensed photography remain to be supplied.  
**Scope:** Copy refinement, corrected statistics, expanded LUMAA ecosystem, Moments interaction, and founder module. This is not a redesign.

## Creative guardrails

Preserve the existing cream, burgundy, terracotta, and muted-gold palette; current typography system; editorial sophistication; diverse photography; collage treatment; circular line motifs; Moments card styling; and overall page rhythm.

Use **LUMAA™** in the primary wordmark, footer wordmark, metadata title, social-share card, and first prominent brand reference. Use plain **LUMAA** in ordinary body copy. Never add the trademark symbol to the domain, URL, email address, hashtag, file name, or code identifier. Replace `™` with `®` only after registration has issued and registered-symbol use is confirmed.

Do not introduce green, the Field Guide, Hot & Bothered, product mockups, specific MIDICON dates or venues, a repeated Moments property card, or premium-looking but unlicensed AI portraits.

## Page hierarchy

The scroll narrative is:

1. **Midlife isn’t one thing. And neither are we.** — the consumer truth.
2. **Women are having a moment.** — the cultural conversation.
3. **The data is clear.** — the business case.
4. **What we’re building.** — the response.
5. **Why I built LUMAA.** — the founder.
6. **Stay in the room.** — the invitation.

## Navigation

| Label | Destination | Behavior |
|---|---|---|
| **Moments** | `#moments` | Smooth-scroll to Moments carousel. |
| **Why LUMAA** | `#why-lumaa` | Smooth-scroll to research and data section. |
| **What We’re Building** | `#what-were-building` | Smooth-scroll to four-property ecosystem. |
| **About** | `/about` or `#founder` | Use `/about` only when the full page exists; otherwise scroll to founder module. |
| **Join LUMAA** | `#join-lumaa` | Smooth-scroll to email form. |

Do not create separate primary navigation items for future properties yet.

## 1. Hero

### Headline

> **Midlife isn’t one thing.**  
> **And neither are we.**

### Supporting copy

> Our vision is a world where women can live unapologetically through midlife and aging, with the experiences, media, products, community and research to navigate the whole of it.

### CTA

**SEE WHAT WE’RE BUILDING →**  
Target: `#what-were-building`

Retain the existing hero photo-collage treatment. Replace provisional AI photography only after final licensed stock or commissioned photography is approved.

## 2. The Moments

### Section copy

> **THE MOMENTS**
>
> **Women are having a moment.**  
> *You know the ones.*

### Carousel behavior

The carousel is horizontally swipeable on touch devices and supports previous/next controls, keyboard arrow navigation, visible focus states, and reduced-motion preferences. Display a partial next card to communicate horizontal movement. The position indicator should update as the user advances, for example `01 / 11`.

**VIEW ALL MOMENTS →** opens the complete collection at `/moments` when available. Before that route is ready, it may expand the carousel in place.

### Submission module

> **SHARE YOUR MOMENT**
>
> Add the one you’ve been carrying. Share it anonymously or leave your name.

The CTA opens a dedicated modal, drawer, or page rather than subscribing the user to email automatically.

Submission requirements:

- A required Moment text field with a 300-character limit.
- Anonymous submission selected by default.
- Optional first name.
- Optional email for follow-up.
- Separate, unchecked consent for LUMAA marketing emails.
- Clear notice that submission does not guarantee publication.
- Moderation status stored privately; no automatic public publishing.
- Email addresses must never be displayed publicly.

At launch, submit Moments to a same-origin Cloudflare Worker or Pages Function and store them in Cloudflare D1 with a default moderation status of `pending`. Keep the optional contact email private. Only add a Moment contributor to the subscriber table when the separate marketing-consent box is checked.

## 3. Why LUMAA

### Headline

> **The data is clear. Midlife women are not a niche.**

### Supporting copy

> We are one of the largest and most economically powerful populations in the country, yet our health, experiences and influence remain under-researched, underrepresented and too often reduced to a single issue.

## 4. Statistics

Use five cards. The source name on every card should be an accessible external link that opens in a new tab. A small source-details disclosure below the cards may explain methodology and limitations.

| Value | Final card copy | Badge | Visible source | Link |
|---:|---|---|---|---|
| **1.14B** | women age 60+ globally by 2050. **Up from 605M in 2020.** | **PROJECTED** | AARP + FP Analytics | [AARP International][1] |
| **8.8%** | of NIH research grant spending in FY2013–FY2023 was estimated to support women’s health research. | **ESTIMATED** | National Academies of Sciences, Engineering, and Medicine | [National Academies][2] |
| **61%** | of family caregivers in the U.S. are women. | None | *Caregiving in the U.S. 2025*, AARP/NAC | [AARP and National Alliance for Caregiving][3] |
| **98%** | of surveyed women entrepreneurs age 40+ said starting their business was the right decision. | **SURVEYED** | AARP Research, 2022 | [AARP Research][4] |
| **13.4%** | of employed women ages 45–60 in a Mayo Clinic study reported a menopause-related adverse work outcome. | **STUDY** | *Mayo Clinic Proceedings* | [PubMed][5] |

### Citation note on the 61% card

The full *Caregiving in the U.S. 2025* report states that women account for **61% of family caregivers** in its detailed analysis of caregivers of adults age 18 or older. The page may use the concise approved card wording above. Do not change the statistic to “61% of women are caregivers”; that would mean something different.

## 5. What We’re Building

Use four public-facing properties in a two-by-two desktop grid and a four-row mobile stack. The section should use typography, restrained color blocking, and the circular motif rather than invented product imagery.

Where **Research** appears as a standalone LUMAA category or pillar, use **Insights + Studies**. The word “research” may remain when it appears naturally within descriptive prose.

### The MIDICON

**Category:** Live Experiences

> Women are having a moment. These are the conversations.  
> One room. One conversation at a time.

**CTA:** JOIN FOR UPDATES →  
The CTA scrolls to the email capture and sets an internal interest value such as `interest=midicon`. Do not display a date or venue.

### The Midlife Power Index

**Category:** Insights + Studies  
**Status:** Coming Soon

> An original LUMAA study exploring how women experience power across the different parts of their lives in midlife and aging.

**CTA:** JOIN FOR UPDATES →  
The CTA scrolls to the email capture and sets an internal interest value such as `interest=power-index`.

### The Load Off

**Category:** Media + Editorial  
**Status:** Coming Soon

> Stories and conversations about what women carry, what we put down and what comes next.

### The LUMAA Collection

**Category:** Apparel + Accessories  
**Status:** Coming Soon

> Made for midlife. Made to say something.

Do not reveal or invent an assortment yet. **Hot & Bothered must not appear anywhere on the site or public roadmap.**

## 6. Founder

This should be a relatively restrained module. LUMAA—not the founder—remains the homepage protagonist.

### Heading

> **WHY I BUILT LUMAA**

### Copy

> I kept seeing the same thing: women were being asked to navigate some of the biggest changes of our lives as though they were completely unrelated.
>
> Health. Parents. Work. Money. Relationships. Aging. Identity. Reinvention.
>
> But we’re not experiencing life in categories. We’re experiencing all of it at once.
>
> I built LUMAA to look at the whole woman.

**Kedma Pognon Brown**  
Founder, LUMAA + The Midicon

**CTA:** MEET KEDMA →

**Asset required:** Replace the visual placeholder with one approved Kedma portrait. Do not generate or substitute a different person.

## 7. Email capture

### Heading

> **Stay in the room.**

### Supporting copy

> Join LUMAA for new Moments, original research, upcoming experiences and what we’re building next.

**Fields:** FIRST NAME and EMAIL ADDRESS  
**CTA:** JOIN LUMAA

The form should record source context when reached from a property CTA, while subscribing the person to one primary LUMAA list. Display a clear success state and preserve the entered address if submission fails.

At launch, submit this form to a same-origin Cloudflare Worker or Pages Function and store `firstName`, normalized `email`, property `interest`, consent-language version, consent timestamp, signup source, creation time, and update time in Cloudflare D1. Upsert by normalized email. No separate inbox or email-marketing application is required for initial capture.

## 8. Footer

Show the LUMAA wordmark, the expansion **Living Unapologetically in Midlife & Aging**, primary navigation, and approved social links.

Remove `themidicon.com` as the primary footer URL. The Midicon should appear as one LUMAA property rather than the owner of the LUMAA website.

**Approved canonical domain:** [www.wearelumaa.com](https://www.wearelumaa.com/). Use the `www` host as the canonical URL and redirect the apex domain to it.

## Developer source object

```ts
export const lumaaStats = [
  {
    id: "global-aging",
    value: "1.14B",
    label: "women age 60+ globally by 2050",
    detail: "Up from 605M in 2020.",
    badge: "PROJECTED",
    sourceLabel: "AARP + FP Analytics",
    sourceUrl: "https://www.aarpinternational.org/resources/unleashing-the-economic-potential-of-older-women",
  },
  {
    id: "womens-health-research",
    value: "8.8%",
    label: "of NIH research grant spending in FY2013–FY2023 was estimated to support women’s health research.",
    badge: "ESTIMATED",
    sourceLabel: "National Academies of Sciences, Engineering, and Medicine",
    sourceUrl: "https://www.nationalacademies.org/read/28586/chapter/12",
  },
  {
    id: "family-caregiving",
    value: "61%",
    label: "of family caregivers in the U.S. are women.",
    badge: null,
    sourceLabel: "Caregiving in the U.S. 2025, AARP/NAC",
    sourceUrl: "https://www.aarp.org/pri/topics/ltss/family-caregiving/caregiving-in-the-us-2025/",
  },
  {
    id: "entrepreneurship",
    value: "98%",
    label: "of surveyed women entrepreneurs age 40+ said starting their business was the right decision.",
    badge: "SURVEYED",
    sourceLabel: "AARP Research, 2022",
    sourceUrl: "https://www.aarp.org/pri/topics/work-finances-retirement/employers-workforce/women-small-business-entrepreneurs/",
  },
  {
    id: "menopause-work",
    value: "13.4%",
    label: "of employed women ages 45–60 in a Mayo Clinic study reported a menopause-related adverse work outcome.",
    badge: "STUDY",
    sourceLabel: "Mayo Clinic Proceedings",
    sourceUrl: "https://pubmed.ncbi.nlm.nih.gov/37115119/",
  },
] as const;
```

## Required assets before launch

1. One approved Kedma portrait for the founder module.
2. Purchased and licensed final photography replacing provisional mockup imagery.
3. Approved destination or temporary expansion behavior for **View All Moments**.
4. Privacy and submission terms for contributed Moments.
5. Publish the approved 1200 × 630 share card at `https://www.wearelumaa.com/social-share.png` so text messages and social platforms can render the branded link preview.

[1]: https://www.aarpinternational.org/resources/unleashing-the-economic-potential-of-older-women "AARP and FP Analytics: Unleashing the Economic Potential of Older Women"
[2]: https://www.nationalacademies.org/read/28586/chapter/12 "National Academies: A New Vision for Women’s Health Research, Appendix A"
[3]: https://www.aarp.org/pri/topics/ltss/family-caregiving/caregiving-in-the-us-2025/ "AARP and National Alliance for Caregiving: Caregiving in the U.S. 2025"
[4]: https://www.aarp.org/pri/topics/work-finances-retirement/employers-workforce/women-small-business-entrepreneurs/ "AARP Research: Women Entrepreneurs"
[5]: https://pubmed.ncbi.nlm.nih.gov/37115119/ "Mayo Clinic Proceedings: Impact of Menopause Symptoms on Women in the Workplace"
