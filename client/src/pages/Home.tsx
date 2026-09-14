import {
  type FormEvent,
  type ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Check,
  Instagram,
  Linkedin,
  Menu,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { moments, properties, media, siteConfig, stats } from "@/content";
import { submitPublicForm } from "@/lib/forms";

function scrollToId(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
}

function Brand({ inverse = false }: { inverse?: boolean }) {
  return (
    <a className={`brand ${inverse ? "brand--inverse" : ""}`} href="#top">
      <span className="brand__name">LUMAA<sup aria-label="trademark">™</sup></span>
      <span className="brand__meaning">
        Living Unapologetically in Midlife &amp; Aging
      </span>
    </a>
  );
}

function EditorialImage({
  src,
  alt,
  label,
  className = "",
  eager = false,
}: {
  src?: string;
  alt: string;
  label: string;
  className?: string;
  eager?: boolean;
}) {
  return (
    <div className={`editorial-image ${className}`}>
      {src ? (
        <img
          src={src}
          alt={alt}
          loading={eager ? "eager" : "lazy"}
          decoding="async"
        />
      ) : (
        <div className="editorial-image__placeholder" role="img" aria-label={alt}>
          <span>{label}</span>
        </div>
      )}
    </div>
  );
}

function SectionEyebrow({ children }: { children: ReactNode }) {
  return <p className="eyebrow">{children}</p>;
}

function Header() {
  const [open, setOpen] = useState(false);
  const links = [
    ["Moments", "moments"],
    ["Why LUMAA", "why-lumaa"],
    ["What We’re Building", "what-were-building"],
    ["About", "founder"],
  ] as const;

  const follow = (id: string) => {
    setOpen(false);
    window.setTimeout(() => scrollToId(id), 20);
  };

  return (
    <header className="site-header" id="top">
      <div className="page-shell site-header__inner">
        <Brand />
        <nav className="desktop-nav" aria-label="Primary navigation">
          {links.map(([label, id]) => (
            <button key={id} onClick={() => follow(id)} type="button">
              {label}
            </button>
          ))}
        </nav>
        <button className="button button--outline header-join" onClick={() => follow("join-lumaa")}>
          Join LUMAA
        </button>
        <button
          aria-expanded={open}
          aria-label={open ? "Close menu" : "Open menu"}
          className="mobile-menu-button"
          onClick={() => setOpen((value) => !value)}
          type="button"
        >
          {open ? <X /> : <Menu />}
        </button>
      </div>
      {open && (
        <nav className="mobile-nav" aria-label="Mobile navigation">
          {links.map(([label, id]) => (
            <button key={id} onClick={() => follow(id)} type="button">
              {label}
            </button>
          ))}
          <button onClick={() => follow("join-lumaa")} type="button">
            Join LUMAA
          </button>
        </nav>
      )}
    </header>
  );
}

function Hero() {
  return (
    <section className="hero page-shell" aria-labelledby="hero-heading">
      <div className="hero__copy">
        <h1 id="hero-heading">
          Midlife isn’t one thing.
          <br />
          And neither are we.
        </h1>
        <p>
          Our vision is a world where women can live unapologetically through
          midlife and aging, with the experiences, media, products, community
          and research to navigate the whole of it.
        </p>
        <button className="button button--primary" onClick={() => scrollToId("what-were-building")}>
          See what we’re building <ArrowRight aria-hidden="true" />
        </button>
      </div>
      <div className="hero-collage" aria-label="LUMAA women portrait collage">
        <div className="orbit orbit--hero" aria-hidden="true" />
        <EditorialImage
          src={media.heroPrimary}
          alt="A confident woman in midlife"
          label="Licensed hero portrait 01"
          className="hero-collage__primary"
          eager
        />
        <EditorialImage
          src={media.heroSecondary}
          alt="A stylish woman smiling"
          label="Licensed hero portrait 02"
          className="hero-collage__secondary"
          eager
        />
        <EditorialImage
          src={media.heroTertiary}
          alt="A thoughtful woman wearing glasses"
          label="Licensed hero portrait 03"
          className="hero-collage__tertiary"
          eager
        />
        <div className="hero-collage__block" aria-hidden="true" />
      </div>
    </section>
  );
}

function MomentCard({ index }: { index: number }) {
  const moment = moments[index];
  return (
    <article className={`moment-card moment-card--${moment.tone}`}>
      <EditorialImage
        src={moment.image}
        alt={moment.alt}
        label={`Licensed Moment image ${String(index + 1).padStart(2, "0")}`}
      />
      <div className="moment-card__copy">
        <p>{moment.kicker}</p>
        <h3>{moment.title}</h3>
      </div>
    </article>
  );
}

function MomentSubmission({ open, onOpenChange }: { open: boolean; onOpenChange: (value: boolean) => void }) {
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const close = (event: KeyboardEvent) => {
      if (event.key === "Escape") onOpenChange(false);
    };
    document.addEventListener("keydown", close);
    document.body.style.overflow = "hidden";
    dialogRef.current?.focus();
    return () => {
      document.removeEventListener("keydown", close);
      document.body.style.overflow = "";
    };
  }, [open, onOpenChange]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const moment = String(data.get("moment") ?? "").trim();
    if (moment.length < 10) {
      toast.error("Please share at least a sentence.");
      return;
    }
    setSubmitting(true);
    try {
      const result = await submitPublicForm(siteConfig.momentEndpoint, {
        moment,
        anonymous: data.get("anonymous") === "on",
        firstName: String(data.get("firstName") ?? ""),
        email: String(data.get("email") ?? ""),
        marketingConsent: data.get("marketingConsent") === "on",
        submittedAt: new Date().toISOString(),
      });
      setSubmitted(true);
      form.reset();
      toast.success(result.message);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (!open) return null;

  return (
    <div className="modal-backdrop" onMouseDown={() => onOpenChange(false)}>
      <div
        aria-labelledby="moment-dialog-title"
        aria-modal="true"
        className="moment-dialog"
        onMouseDown={(event) => event.stopPropagation()}
        ref={dialogRef}
        role="dialog"
        tabIndex={-1}
      >
        <button
          aria-label="Close submission form"
          className="modal-close"
          onClick={() => onOpenChange(false)}
          type="button"
        >
          <X />
        </button>
        {submitted ? (
          <div className="dialog-success">
            <span className="dialog-success__icon"><Check /></span>
            <SectionEyebrow>Moment received</SectionEyebrow>
            <h2 id="moment-dialog-title">Thank you for trusting us with it.</h2>
            <p>Your Moment will be reviewed before anything is shared.</p>
            <button className="button button--primary" onClick={() => onOpenChange(false)}>
              Close
            </button>
          </div>
        ) : (
          <>
            <SectionEyebrow>The Moments</SectionEyebrow>
            <h2 id="moment-dialog-title">Share your Moment.</h2>
            <p className="dialog-intro">
              Add the one you’ve been carrying. Share it anonymously or leave your name.
            </p>
            <form className="moment-form" onSubmit={submit}>
              <label>
                Your Moment <span aria-hidden="true">*</span>
                <textarea maxLength={300} name="moment" placeholder="The moment I keep thinking about is..." required />
              </label>
              <div className="form-grid">
                <label>
                  First name <span className="optional">Optional</span>
                  <input name="firstName" type="text" />
                </label>
                <label>
                  Email <span className="optional">Optional</span>
                  <input name="email" type="email" />
                </label>
              </div>
              <label className="check-row">
                <input defaultChecked name="anonymous" type="checkbox" />
                <span>Publish anonymously if selected.</span>
              </label>
              <label className="check-row">
                <input name="marketingConsent" type="checkbox" />
                <span>I would also like to receive LUMAA updates.</span>
              </label>
              <p className="form-note">
                Submissions are moderated and are never published automatically. Email addresses are never displayed.
              </p>
              <button className="button button--primary" disabled={submitting} type="submit">
                {submitting ? "Submitting..." : "Submit my Moment"}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

function MomentsSection() {
  const [active, setActive] = useState(0);
  const [submissionOpen, setSubmissionOpen] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);

  const goTo = useCallback((next: number) => {
    const index = (next + moments.length) % moments.length;
    setActive(index);
    const item = carouselRef.current?.querySelector<HTMLElement>(`[data-moment-index="${index}"]`);
    item?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "start" });
  }, []);

  return (
    <section className="moments-section page-shell" id="moments" aria-labelledby="moments-heading">
      <div className="section-heading section-heading--moments">
        <div>
          <SectionEyebrow>The Moments</SectionEyebrow>
          <h2 id="moments-heading">Women are having a moment.</h2>
          <p>You know the ones.</p>
        </div>
        <button className="text-link" onClick={() => goTo(active + 1)}>
          View all Moments <ArrowRight />
        </button>
      </div>
      <div className="moments-carousel" ref={carouselRef} aria-live="polite">
        {moments.map((moment, index) => (
          <div data-moment-index={index} key={moment.title}>
            <MomentCard index={index} />
          </div>
        ))}
      </div>
      <div className="carousel-controls">
        <button aria-label="Previous Moment" onClick={() => goTo(active - 1)}><ArrowLeft /></button>
        <span>{String(active + 1).padStart(2, "0")} / {String(moments.length).padStart(2, "0")}</span>
        <div className="carousel-progress" aria-hidden="true"><span style={{ width: `${((active + 1) / moments.length) * 100}%` }} /></div>
        <button aria-label="Next Moment" onClick={() => goTo(active + 1)}><ArrowRight /></button>
      </div>
      <div className="share-band">
        <div>
          <strong>Share your Moment</strong>
          <span>Add the one you’ve been carrying. Share it anonymously or leave your name.</span>
        </div>
        <button onClick={() => setSubmissionOpen(true)}>Share yours <ArrowUpRight /></button>
      </div>
      <MomentSubmission open={submissionOpen} onOpenChange={setSubmissionOpen} />
    </section>
  );
}

function WhySection() {
  return (
    <section className="why-section" id="why-lumaa" aria-labelledby="why-heading">
      <div className="page-shell">
        <SectionEyebrow>Why LUMAA</SectionEyebrow>
        <h2 id="why-heading">The data is clear. Midlife women are not a niche.</h2>
        <p className="why-section__intro">
          We are one of the largest and most economically powerful populations in the country, yet our health,
          experiences and influence remain under-researched, underrepresented and too often reduced to a single issue.
        </p>
        <div className="stats-grid">
          {stats.map((stat, index) => (
            <article className={`stat-card stat-card--${stat.tone} ${index === 0 ? "stat-card--featured" : ""}`} key={stat.value}>
              {index === 0 && <div className="orbit orbit--stat" aria-hidden="true" />}
              {stat.badge && <span className="stat-card__badge">{stat.badge}</span>}
              <strong>{stat.value}</strong>
              <p>{stat.label}</p>
              {stat.detail && <em>{stat.detail}</em>}
              <a href={stat.sourceUrl} rel="noreferrer" target="_blank">
                {stat.sourceLabel} <span className="sr-only">opens in a new tab</span>
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function PropertiesSection({ onInterest }: { onInterest: (interest: string) => void }) {
  return (
    <section className="properties-section page-shell" id="what-were-building" aria-labelledby="properties-heading">
      <SectionEyebrow>What We’re Building</SectionEyebrow>
      <h2 className="sr-only" id="properties-heading">The LUMAA world</h2>
      <div className="properties-grid">
        {properties.map((property) => (
          <article className={`property-card property-card--${property.tone}`} key={property.title}>
            <div className="property-card__mark" aria-hidden="true"><span /><span /></div>
            <div className="property-card__copy">
              <p>{property.category}</p>
              <h3>{property.title}</h3>
              <div>{property.description}</div>
              {property.note && <em>{property.note}</em>}
            </div>
            <div className="property-card__actions">
              {property.status && <span>{property.status}</span>}
              <button onClick={() => onInterest(property.interest)}>
                Join for updates <ArrowRight />
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function FounderSection() {
  return (
    <section className="founder-section page-shell" id="founder" aria-labelledby="founder-heading">
      <EditorialImage
        src={media.founder}
        alt="Kedma Pognon Brown, founder of LUMAA and The Midicon"
        label="Approved Kedma portrait"
      />
      <div className="founder-section__copy">
        <SectionEyebrow>Why I Built LUMAA</SectionEyebrow>
        <h2 className="sr-only" id="founder-heading">Why Kedma built LUMAA</h2>
        <p>I kept seeing the same thing: women were being asked to navigate some of the biggest changes of our lives as though they were completely unrelated.</p>
        <p className="founder-section__list">Health. Parents. Work. Money. Relationships. Aging. Identity. Reinvention.</p>
        <p>But we’re not experiencing life in categories. We’re experiencing all of it at once.</p>
        <p>I built LUMAA to look at the whole woman.</p>
        <div className="founder-signature">
          <div><strong>Kedma Pognon Brown</strong><span>Founder, LUMAA + The Midicon</span></div>
          <button className="button button--outline" onClick={() => toast.info("Connect this CTA to the final About page.")}>Meet Kedma <ArrowRight /></button>
        </div>
      </div>
    </section>
  );
}

function JoinSection({ interest }: { interest: string }) {
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [complete, setComplete] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      toast.error("Please enter a valid email address.");
      return;
    }
    setSubmitting(true);
    try {
      const result = await submitPublicForm(siteConfig.newsletterEndpoint, {
        firstName: firstName.trim(),
        email,
        interest: interest || "general",
        submittedAt: new Date().toISOString(),
      });
      setComplete(true);
      toast.success(result.message);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="join-section" id="join-lumaa" aria-labelledby="join-heading">
      <div className="page-shell join-section__inner">
        <div>
          <h2 id="join-heading">Stay in the room.</h2>
          <p>Join LUMAA for new Moments, original research, upcoming experiences and what we’re building next.</p>
          {interest && <span className="interest-note">Updates selected: {properties.find((item) => item.interest === interest)?.title}</span>}
        </div>
        {complete ? (
          <div className="join-success"><Check /> You’re in. Watch your inbox.</div>
        ) : (
          <form className="join-form" onSubmit={submit}>
            <label className="sr-only" htmlFor="join-first-name">First name</label>
            <input id="join-first-name" onChange={(event) => setFirstName(event.target.value)} placeholder="FIRST NAME" type="text" value={firstName} />
            <label className="sr-only" htmlFor="join-email">Email address</label>
            <input id="join-email" onChange={(event) => setEmail(event.target.value)} placeholder="EMAIL ADDRESS" type="email" value={email} />
            <button disabled={submitting} type="submit">{submitting ? "Joining..." : "Join LUMAA"}</button>
          </form>
        )}
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="site-footer">
      <div className="page-shell site-footer__inner">
        <Brand inverse />
        <nav aria-label="Footer navigation">
          <a href="#moments">The Moments</a>
          <a href="#why-lumaa">Why LUMAA</a>
          <a href="#what-were-building">What We’re Building</a>
          <a href="#founder">About</a>
        </nav>
        <div className="footer-contact">
          <a className="footer-domain" href={siteConfig.domain}>www.wearelumaa.com</a>
          <div className="social-links">
            {siteConfig.instagramUrl ? <a aria-label="LUMAA on Instagram" href={siteConfig.instagramUrl}><Instagram /></a> : <span aria-label="Instagram link pending"><Instagram /></span>}
            {siteConfig.linkedInUrl ? <a aria-label="LUMAA on LinkedIn" href={siteConfig.linkedInUrl}><Linkedin /></a> : <span aria-label="LinkedIn link pending"><Linkedin /></span>}
          </div>
        </div>
      </div>
    </footer>
  );
}

export default function Home() {
  const [interest, setInterest] = useState("");

  const selectInterest = (value: string) => {
    setInterest(value);
    window.setTimeout(() => scrollToId("join-lumaa"), 30);
  };

  return (
    <div className="lumaa-site">
      <a className="skip-link" href="#main-content">Skip to content</a>
      <Header />
      <main id="main-content">
        <Hero />
        <MomentsSection />
        <WhySection />
        <PropertiesSection onInterest={selectInterest} />
        <FounderSection />
        <JoinSection interest={interest} />
      </main>
      <Footer />
    </div>
  );
}
