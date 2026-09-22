"use client";

import { useEffect, useRef, useState, type CSSProperties, type KeyboardEvent } from "react";
import { ArrowRight, ArrowUpRight, Heart, Pause, Play, ScanLine } from "lucide-react";

type HeroSlide = {
  id: string;
  label: string;
  chapter: string;
  image: string;
  alt: string;
  headline: string;
  secondLine: string;
  emphasis: string;
  description: string;
  assurance: string;
  detail: string;
  caption: string;
  icon: typeof Heart;
  accent: string;
  position: string;
  mobilePosition: string;
};

// Each entry is one complete scene. Add another entry to extend the experience.
const heroSlides: HeroSlide[] = [
  {
    id: "patient-experience",
    label: "Comfortable Care",
    chapter: "Patient experience",
    image: "/images/hero.webp",
    alt: "An Apna dentist listening to a relaxed patient in a sunlit, welcoming clinic.",
    headline: "Feel at ease.",
    secondLine: "Feel like ",
    emphasis: "you.",
    description: "A warm welcome. Time to be heard. Personalised dental care that puts your comfort first, from the very first visit.",
    assurance: "Your comfort comes first.",
    detail: "Care that starts with listening.",
    caption: "More care. Less worry.",
    icon: Heart,
    accent: "#0f766e",
    position: "center 48%",
    mobilePosition: "73% center",
  },
  {
    id: "advanced-care",
    label: "Modern Dentistry",
    chapter: "Advanced care",
    image: "/images/hero-advanced-care.webp",
    alt: "A dentist wearing protective glasses and gloves carefully using a digital intraoral scanner with a patient.",
    headline: "Modern care.",
    secondLine: "Made ",
    emphasis: "personal.",
    description: "Thoughtful technology. Precise treatment. Explore modern dentistry with clear guidance and a care plan shaped around you.",
    assurance: "Precision in every step.",
    detail: "Thoughtful tools. Clear treatment plans.",
    caption: "Precision with a human touch.",
    icon: ScanLine,
    accent: "#245c6b",
    position: "center 48%",
    mobilePosition: "78% center",
  },
];

const SLIDE_DURATION = 6940;

export function HeroStory({ onBook }: { onBook: () => void }) {
  const [active, setActive] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(true);
  const [inView, setInView] = useState(true);
  const [pageVisible, setPageVisible] = useState(true);
  const [ready, setReady] = useState<boolean[]>(heroSlides.map(() => false));
  const sectionRef = useRef<HTMLElement>(null);
  const progressRef = useRef<HTMLSpanElement>(null);
  const imageRefs = useRef<(HTMLImageElement | null)[]>([]);
  const chapterRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const elapsedRef = useRef(0);
  const next = (active + 1) % heroSlides.length;
  const running = playing && !reducedMotion && inView && pageVisible && ready[active] && ready[next];

  function markReady(index: number) {
    setReady(previous => previous[index] ? previous : previous.map((value, i) => i === index ? true : value));
  }

  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const syncMotion = () => setReducedMotion(preference.matches);
    const syncVisibility = () => setPageVisible(document.visibilityState === "visible");
    syncMotion();
    syncVisibility();
    preference.addEventListener("change", syncMotion);
    document.addEventListener("visibilitychange", syncVisibility);
    imageRefs.current.forEach((image, index) => {
      if (image?.complete && image.naturalWidth > 0) markReady(index);
    });
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting && entry.intersectionRatio >= 0.15),
      { threshold: 0.15 },
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => {
      preference.removeEventListener("change", syncMotion);
      document.removeEventListener("visibilitychange", syncVisibility);
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!running) return;
    let frame: number;
    let last = performance.now();
    function tick(now: number) {
      elapsedRef.current = Math.min(SLIDE_DURATION, elapsedRef.current + now - last);
      last = now;
      if (progressRef.current) {
        progressRef.current.style.transform = "scaleX(" + elapsedRef.current / SLIDE_DURATION + ")";
      }
      if (elapsedRef.current >= SLIDE_DURATION) {
        elapsedRef.current = 0;
        setActive(index => (index + 1) % heroSlides.length);
      } else {
        frame = requestAnimationFrame(tick);
      }
    }
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [active, running]);

  function selectSlide(index: number) {
    if (!ready[index]) return;
    setPlaying(false);
    if (index === active) return;
    elapsedRef.current = 0;
    setActive(index);
  }

  function handleChapterKey(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    let target: number | undefined;
    if (event.key === "ArrowRight") target = (index + 1) % heroSlides.length;
    if (event.key === "ArrowLeft") target = (index + heroSlides.length - 1) % heroSlides.length;
    if (event.key === "Home") target = 0;
    if (event.key === "End") target = heroSlides.length - 1;
    if (target === undefined || !ready[target]) return;
    event.preventDefault();
    selectSlide(target);
    chapterRefs.current[target]?.focus();
  }

  return (
    <section
      id="home"
      className="hero-story"
      ref={sectionRef}
      aria-label="Care at Apna Dental"
      aria-roledescription="carousel"
      data-active-story={heroSlides[active].id}
      data-playing={running ? "true" : "false"}
      data-reduced-motion={reducedMotion ? "true" : "false"}
      style={{ "--story-accent": heroSlides[active].accent } as CSSProperties}
      onFocusCapture={event => {
        if (!(event.target as HTMLElement).closest("[data-rotation-toggle]")) setPlaying(false);
      }}
    >
      <div className="hero-story-visuals" aria-hidden="true">
        {heroSlides.map((slide, index) => (
          <div
            className={"hero-story-visual" + (index === active ? " is-active" : "")}
            key={slide.id}
            style={{ "--story-position": slide.position, "--story-mobile-position": slide.mobilePosition } as CSSProperties}
          >
            <img
              ref={element => { imageRefs.current[index] = element; }}
              src={slide.image}
              alt=""
              width="1672"
              height="941"
              fetchPriority={index === 0 ? "high" : "auto"}
              loading="eager"
              decoding="async"
              onLoad={() => markReady(index)}
            />
          </div>
        ))}
      </div>
      <div className="hero-story-wash" aria-hidden="true" />

      <div className="wrap hero-story-layout">
        <div className="hero-story-stage">
          {heroSlides.map((slide, index) => (
            <div
              id={"hero-scene-" + slide.id}
              className={"hero-story-copy" + (index === active ? " is-active" : "")}
              key={slide.id}
              role="group"
              aria-roledescription="slide"
              aria-label={(index + 1) + " of " + heroSlides.length + ": " + slide.label}
              aria-hidden={index !== active}
              inert={index !== active}
            >
              <div className="hero-story-label"><span />{slide.label}</div>
              <h1>{slide.headline}<br />{slide.secondLine}<em>{slide.emphasis}</em></h1>
              <p>{slide.description}</p>
              <span className="sr-only">{slide.alt}</span>
            </div>
          ))}
        </div>

        <div className="hero-story-actions">
          <button type="button" className="button" onClick={onBook}>Book a consultation <ArrowUpRight size={19} /></button>
          <a className="text-link" href="#care">Explore our care <ArrowRight size={17} /></a>
        </div>

        <div className="hero-story-assurances">
          {heroSlides.map((slide, index) => {
            const Icon = slide.icon;
            return (
              <div key={slide.id} className={"hero-story-assurance" + (index === active ? " is-active" : "")} aria-hidden={index !== active}>
                <span className="hero-story-assurance-icon"><Icon size={21} strokeWidth={1.5} /></span>
                <span><strong>{slide.assurance}</strong><small>{slide.detail}</small></span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="wrap hero-story-footer">
        <div className="hero-story-controls">
          <button
            type="button"
            className="hero-rotation-button"
            data-rotation-toggle
            disabled={reducedMotion}
            aria-label={reducedMotion ? "Automatic rotation is off for reduced motion" : playing ? "Pause automatic rotation" : "Resume automatic rotation"}
            title={reducedMotion ? "Reduced motion: choose a story below" : playing ? "Pause stories" : "Play stories"}
            onClick={() => { setPlaying(value => !value); }}
          >
            {playing && !reducedMotion ? <Pause size={16} fill="currentColor" /> : <Play size={16} fill="currentColor" />}
          </button>
          <div className="hero-story-chapters" role="group" aria-label="Choose a care story">
            {heroSlides.map((slide, index) => (
              <button
                key={slide.id}
                ref={element => { chapterRefs.current[index] = element; }}
                type="button"
                className={"hero-story-chapter" + (index === active ? " is-active" : "")}
                aria-label={"Show " + slide.label}
                aria-pressed={index === active}
                aria-controls={"hero-scene-" + slide.id}
                disabled={!ready[index]}
                onClick={() => selectSlide(index)}
                onKeyDown={event => handleChapterKey(event, index)}
              >
                <span className="hero-chapter-number">{String(index + 1).padStart(2, "0")}</span>
                <span>{slide.chapter}</span>
                <span className="hero-chapter-track" aria-hidden="true">
                  {index === active && <span ref={progressRef} key={slide.id} style={{ transform: "scaleX(" + elapsedRef.current / SLIDE_DURATION + ")" }} />}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="hero-story-captions" aria-hidden="true">
        {heroSlides.map((slide, index) => {
          const Icon = slide.icon;
          return <div key={slide.id} className={"hero-story-caption" + (index === active ? " is-active" : "")}>
            <Icon size={18} strokeWidth={1.5} />
            <span>{slide.caption}</span>
          </div>;
        })}
      </div>
      <span className="sr-only" role="status" aria-live={playing && !reducedMotion ? "off" : "polite"} aria-atomic="true">
        {heroSlides[active].label + ". Story " + (active + 1) + " of " + heroSlides.length + "."}
      </span>
    </section>
  );
}
