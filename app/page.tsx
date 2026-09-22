"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, ArrowRight, ArrowLeft, CalendarDays, Heart, ShieldCheck, Sparkles, Menu, X, Check, Plus, Phone, MessageCircle, MapPin, Smile, CheckCircle2, RotateCcw } from "lucide-react";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { HeroStory } from "@/components/hero-story";

const services = [
  { id: "preventive", name: "Preventive dentistry", short: "A little care today. A healthier smile tomorrow.", tag: "EVERYDAY CONFIDENCE", image: "preventive", detail: "Make space for your smile with a routine check-up and a conversation about your oral health.", includes: ["Dental check-ups", "Professional cleaning", "Personalised home-care guidance"], note: "Your dentist will assess your teeth and gums, discuss any concerns, and explain which care is appropriate for you." },
  { id: "cosmetic", name: "Cosmetic dentistry", short: "More reasons to share your natural smile.", tag: "FEEL MORE LIKE YOU", image: "cosmetic", detail: "Explore the possibilities for your smile, with choices guided by your preferences and your dental health.", includes: ["Teeth whitening consultations", "Veneer consultations", "Smile planning"], note: "Start with an assessment and a discussion of your goals. Suitability, expected results and costs are explained before you choose." },
  { id: "restorative", name: "Restorative treatments", short: "Bring comfort and confidence back to your smile.", tag: "A FRESH START", image: "restorative", detail: "Understand the options for damaged or missing teeth, and find a path forward with your dentist.", includes: ["Fillings and crowns", "Root canal consultations", "Dental implants and tooth replacement"], note: "The recommended approach depends on your examination. Your dentist will explain your options, the steps involved and a treatment estimate." },
  { id: "orthodontics", name: "Orthodontics", short: "Thoughtful steps towards a more aligned smile.", tag: "SMALL STEPS. BIG SMILES.", image: "orthodontics", detail: "Explore braces and clear aligners with a plan shaped around your teeth, bite and everyday life.", includes: ["Braces consultations", "Clear aligner consultations", "Alignment and bite assessment"], note: "An assessment comes first. The approach, timing, follow-up visits and costs depend on your individual needs." },
];

const gallery = [
  { image: "clinic", title: "A warm welcome", caption: "Room to settle in, take a breath, and feel at home." },
  { image: "hygiene", title: "Care in the details", caption: "A closer look at our illustrative instrument-preparation area." },
  { image: "first-visit", title: "A friendly first hello", caption: "A simple check-in and a familiar face to guide you." },
  { image: "exterior", title: "Your visit starts here", caption: "An exterior concept for Apna Dental Care." },
];
const faqs = [
  ["What happens at my first appointment?", "Your first visit starts with a conversation about your concerns and dental history, followed by an examination. Your dentist can then explain any recommended next steps and discuss costs with you."],
  ["I feel nervous about dental visits. Can I talk about that?", "Absolutely. Let your dentist know how you feel before your visit or at the start of the consultation. You can ask questions, discuss comfort options, and agree on a signal if you need a pause."],
  ["How much will my treatment cost?", "Costs depend on the examination, the treatment chosen and its complexity. Ask the clinic for its consultation fee and a written treatment estimate. Prices have not been added to this concept website."],
  ["Can I book a visit for my child?", "The family-care experience includes children. Select General consultation in the appointment form, and discuss your child's age and needs with the clinic when confirming a real appointment."],
  ["Do I need to know which treatment I need?", "No. Choose General consultation if you are unsure. A dentist can assess your concerns and discuss suitable options with you."],
  ["Is my appointment confirmed when I submit the form?", "This website is an interactive demo: submitting the form shows a request preview and does not contact a clinic. For a live clinic, a requested time would need to be confirmed by its team."],
];

type FormState = { name: string; phone: string; service: string; date: string; time: string };
type ModelContext = { registerTool: (tool: { name: string; title: string; description: string; inputSchema: object; annotations: object; execute: (input: unknown) => unknown }, options?: { signal: AbortSignal }) => void | Promise<void> };
const emptyForm: FormState = { name: "", phone: "", service: "general", date: "", time: "" };
const imagePath = (name: string) => "/images/" + name + ".webp";
const todayLocal = () => { const date = new Date(); return date.getFullYear() + "-" + String(date.getMonth() + 1).padStart(2, "0") + "-" + String(date.getDate()).padStart(2, "0"); };

function Brand({ light = false }: { light?: boolean }) {
  return <a className={"brand" + (light ? " brand-light" : "")} href="#home" aria-label="Apna Dental Care home">
    <img src="/images/logo.png" alt="" width="42" height="43" />
    <span>apna<span>dental care</span></span>
  </a>;
}
function Eyebrow({ children, center = false }: { children: React.ReactNode; center?: boolean }) {
  return <div className={"eyebrow" + (center ? " centered" : "")}><span />{children}<span /></div>;
}

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [serviceOpen, setServiceOpen] = useState<number | null>(null);
  const [galleryOpen, setGalleryOpen] = useState<number | null>(null);
  const [infoOpen, setInfoOpen] = useState<"contact" | "privacy" | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [consent, setConsent] = useState(false);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [minDate, setMinDate] = useState("");
  const successRef = useRef<HTMLDivElement>(null);
  const updateField = (field: keyof FormState, value: string) => {
    setForm(previous => ({ ...previous, [field]: value }));
    setError("");
  };

  const scrollToBooking = (service?: string) => {
    setServiceOpen(null);
    setMenuOpen(false);
    requestAnimationFrame(() => document.getElementById("booking")?.scrollIntoView({ behavior: "smooth", block: "start" }));
  };
  useEffect(() => { setMinDate(todayLocal()); }, []);
  useEffect(() => {
    if (submitted) successRef.current?.focus();
  }, [submitted]);
  useEffect(() => {
    const context = (document as Document & { modelContext?: ModelContext }).modelContext;
    if (!context?.registerTool) return;
    const lifecycle = new AbortController();
    const validServices = ["general", ...services.map(s => s.id)];
    const register = (tool: Parameters<ModelContext["registerTool"]>[0]) => {
      try { Promise.resolve(context.registerTool(tool, { signal: lifecycle.signal })).catch(() => {}); } catch { /* Unsupported registration leaves the visible flow available. */ }
    };
    register({
      name: "get_dental_treatments", title: "Read dental treatments",
      description: "Read the four dental treatment categories available in this Apna Dental Care concept website.",
      inputSchema: { type: "object", properties: {}, additionalProperties: false },
      annotations: { readOnlyHint: true, untrustedContentHint: false },
      execute: () => ({ treatments: services.map(({ id, name, includes }) => ({ id, name, includes })) }),
    });
    register({
      name: "start_appointment_request", title: "Start appointment preview",
      description: "Select a treatment and bring the demo appointment form into view. This does not submit a request or book an appointment.",
      inputSchema: { type: "object", properties: { service: { type: "string", enum: validServices } }, required: ["service"], additionalProperties: false },
      annotations: { readOnlyHint: false, untrustedContentHint: false },
      execute: async (input: unknown) => {
        const value = input as { service?: unknown };
        if (!value || typeof value.service !== "string" || !validServices.includes(value.service)) throw new Error("Choose a listed service.");
        scrollToBooking(value.service);
        await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
        return { status: "form_opened", service: value.service, appointmentBooked: false };
      },
    });
    return () => lifecycle.abort();
  }, []);

  function submitRequest(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const fields = new FormData(event.currentTarget);
    const current = { ...form, name: String(fields.get("name") ?? ""), phone: String(fields.get("phone") ?? ""), date: String(fields.get("date") ?? "") };
    setForm(current);
    const digits = current.phone.replace(/\D/g, "");
    if (current.name.trim().length < 2) { setError("Please enter your full name."); return; }
    if (!/^[6-9]\d{9}$/.test(digits)) { setError("Please enter a valid 10-digit Indian mobile number."); return; }
    if (!current.date || current.date < todayLocal()) { setError("Please choose today or a future date."); return; }
    if (!form.time) { setError("Please choose a preferred time of day."); return; }
    if (!consent) { setError("Please acknowledge that this is a demo request."); return; }
    setError("");
    setSubmitted(true);
  }
  const serviceName = services.find(s => s.id === form.service)?.name ?? "General consultation";
  const formattedDate = form.date ? new Date(form.date + "T12:00:00").toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "long", year: "numeric" }) : "";

  return <>
    <a className="skip-link" href="#care">Skip to main content</a>
    <div className="topline"><div className="wrap"><span>A little care. A lifetime of smiles.</span><span className="demo-label">CONCEPT CLINIC · INTERACTIVE DEMO</span></div></div>
    <header className="header">
      <div className="wrap header-inner">
        <Brand />
        <nav className="desktop-nav" aria-label="Main navigation"><a href="#care">Our care</a><a href="#dentist">Our dentist</a><a href="#clinic">The clinic</a><a href="#visit">Your first visit</a></nav>
        <div className="header-actions"><button className="button compact" onClick={() => window.open("https://cal.com/anup-kumar-rz61qm/apna-dental-care-appointment", "_blank")}>Book a visit <ArrowUpRight size={18} /></button><button className="menu-button" aria-label={menuOpen ? "Close menu" : "Open menu"} aria-expanded={menuOpen} aria-controls="mobile-nav" onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X /> : <Menu />}</button></div>
      </div>
      {menuOpen && <nav id="mobile-nav" className="mobile-nav" aria-label="Mobile navigation">{[["Our care", "care"], ["Our dentist", "dentist"], ["The clinic", "clinic"], ["Your first visit", "visit"], ["Your questions", "faq"]].map(([name, id]) => <a key={id} href={"#" + id} onClick={() => setMenuOpen(false)}>{name}<ArrowUpRight size={18} /></a>)}</nav>}
    </header>

    <main>
      <HeroStory onBook={() => scrollToBooking()} />

      <div className="principles wrap" aria-label="Our approach">
        <div><ShieldCheck /><span>Care you can understand</span></div><div><Heart /><span>Comfort at every step</span></div><div><CalendarDays /><span>Visits that fit your life</span></div><div><Smile /><span>Smiles of every age</span></div>
      </div>

      <section className="intro" aria-labelledby="intro-heading">
        <div className="wrap">
          <Eyebrow center>GOOD DENTISTRY. GREAT HUMAN CONNECTION.</Eyebrow>
          <h2 id="intro-heading">We care for more than teeth.<br /><span>We care for the person<br className="desktop-break" /> behind the smile.</span></h2>
          <p>From a routine check-up to a fresh start for your smile,<br className="desktop-break" /> we make the next step feel a little easier.</p>
          <a href="#dentist" className="text-link intro-link">Get to know Apna <ArrowUpRight size={17} /></a>
        </div>
        <div className="smile-strip" aria-hidden="true">
          {["hygiene", "first-visit", "cosmetic", "family", "orthodontics", "restorative", "clinic"].map((image, i) => <div className={"strip-photo strip-" + i} key={image}><img src={imagePath(image)} alt="" loading="lazy" /></div>)}
        </div>
      </section>

      <section id="care" className="care-section section-pad">
        <div className="wrap">
          <div className="section-heading"><div><Eyebrow>CARE FOR EVERY CHAPTER</Eyebrow><h2>Every smile has a story.<br />Let's care for <em>yours.</em></h2></div><p>Everyday essentials, fresh starts, and everything in between. Find the care that feels right for you.</p></div>
          <div className="service-grid">
            {services.map((service, index) => <button key={service.id} className="service-card" onClick={() => setServiceOpen(index)} aria-label={"Explore " + service.name}>
              <div className="service-photo"><img src={imagePath(service.image)} alt={service.name === "Cosmetic dentistry" ? "A natural, confident smile" : service.name === "Orthodontics" ? "A young adult holding a clear aligner" : service.name === "Restorative treatments" ? "A dentist explaining treatment with a tooth model" : "A gentle routine dental examination"} loading="lazy" width="1152" height="864" /><span className="service-number">0{index + 1}</span></div>
              <div className="service-body"><span className="micro-label">{service.tag}</span><h3>{service.name}</h3><p>{service.short}</p><span className="service-link">Explore treatment <span><ArrowUpRight size={18} /></span></span></div>
            </button>)}
          </div>
          <div className="care-bottom"><span>Not sure where to start? A conversation is a good place.</span><button className="text-link" onClick={() => scrollToBooking("general")}>Book a consultation <ArrowRight size={17} /></button></div>
        </div>
      </section>

      <section id="dentist" className="doctor-section section-pad">
        <div className="wrap doctor-grid">
          <div className="doctor-portrait"><img src={imagePath("dentist")} alt="The fictional Apna dentist, smiling in teal scrubs" loading="lazy" width="1152" height="864" /><span className="portrait-label"><Heart size={16} /> People first. Always.</span></div>
          <div className="doctor-copy"><Eyebrow>MEET THE PERSON BEHIND THE CARE</Eyebrow><h2>A familiar face.<br />A reassuring <em>approach.</em></h2><p>Good care begins with listening. To your questions, your concerns, and what matters most to you.</p><p>At Apna, the conversation is part of the care. A little more explanation. Time to ask one more question. A plan you feel comfortable with.</p>
            <div className="care-values">{[["01", "We listen first", "Your story helps shape your care."], ["02", "We explain clearly", "Understand the options before you decide."], ["03", "We go at your pace", "Talk through your concerns, one step at a time."]].map(([number, title, copy]) => <div key={number}><span>{number}</span><div><h3>{title}</h3><p>{copy}</p></div></div>)}</div>
            <button className="button" onClick={() => scrollToBooking()}>Come say hello <ArrowUpRight size={18} /></button><small className="profile-note">Illustrative clinician profile for the Apna concept clinic.</small>
          </div>
        </div>
      </section>

      <section className="comfort-section">
        <div className="wrap comfort-grid"><div className="comfort-copy"><Eyebrow>FEEL AT EASE</Eyebrow><h2>Big on care.<br /><em>Thoughtful</em> in the details.</h2><p>From an organised treatment space to a clear explanation of your next step, the little things help a visit feel easier.</p><ul className="check-list"><li><Check size={17} /> Space to share your concerns</li><li><Check size={17} /> Hygiene at the heart of the routine</li><li><Check size={17} /> Treatment explained before it begins</li></ul><a className="text-link" href="#visit">What to expect on your first visit <ArrowRight size={17} /></a></div><div className="comfort-photo"><img src={imagePath("hygiene")} alt="A dentist preparing sealed dental instruments in a clean workspace" width="1152" height="864" loading="lazy" /><div className="photo-caption"><ShieldCheck size={19} /><span>Thoughtful care, down to the details.</span></div></div></div>
      </section>

      <section id="clinic" className="clinic-section section-pad">
        <div className="wrap">
          <div className="section-heading"><div><Eyebrow>TAKE A LOOK AROUND</Eyebrow><h2>Come in.<br />Make yourself <em>comfortable.</em></h2></div><div><p>A little light. A little calm. A welcoming space to begin caring for your smile.</p><button className="text-link gallery-trigger" onClick={() => setGalleryOpen(0)}>Explore the clinic <ArrowUpRight size={18} /></button></div></div>
          <div className="clinic-grid">
            <button className="gallery-card gallery-main" onClick={() => setGalleryOpen(0)} aria-label="View reception photo"><img src={imagePath("clinic")} alt="A warm reception with mint seating and pale oak furnishings" loading="lazy" width="1672" height="941" /><span><span>The warm welcome</span><Plus size={22} /></span></button>
            <button className="gallery-card" onClick={() => setGalleryOpen(2)} aria-label="View first visit photo"><img src={imagePath("first-visit")} alt="A patient being welcomed at the reception desk" loading="lazy" width="1152" height="864" /><span><span>The first hello</span><Plus size={22} /></span></button>
            <button className="gallery-card" onClick={() => setGalleryOpen(3)} aria-label="View clinic entrance photo"><img src={imagePath("exterior")} alt="The illustrative clinic entrance with a glass facade" loading="lazy" width="1152" height="648" /><span><span>The way in</span><Plus size={22} /></span></button>
          </div>
        </div>
      </section>

      <section id="visit" className="visit-section">
        <div className="wrap visit-grid">
          <div><Eyebrow>YOUR FIRST VISIT, SIMPLIFIED</Eyebrow><h2>New here?<br />You're in <em>good company.</em></h2><p>You don't need to have all the answers.<br />Just come as you are.</p><button className="button light" onClick={() => scrollToBooking()}>Plan your first visit <ArrowUpRight size={18} /></button></div>
          <div className="visit-steps">{[["01", "Start with a hello", "Tell the team what brings you in and request a time that suits you.", CalendarDays], ["02", "Let's talk about your smile", "Share your concerns, meet the dentist, and understand your oral health.", MessageCircle], ["03", "Choose your next step", "Discuss your options and costs, then decide on your care together.", Heart]].map(([number, title, copy, Icon]) => { const StepIcon = Icon as typeof Heart; return <div className="visit-step" key={number as string}><span className="step-number">{number as string}</span><div><h3>{title as string}</h3><p>{copy as string}</p></div><StepIcon size={25} /></div>; })}</div>
        </div>
      </section>

      <section className="family-section section-pad">
        <div className="wrap family-grid"><div className="family-photo"><img src={imagePath("family")} alt="A dentist speaking with a child and her father in the waiting area" width="1152" height="864" loading="lazy" /><span className="family-label">FOR THE LITTLE ONES. AND THE YOUNG AT HEART.</span></div><div className="family-copy"><Eyebrow>THE APNA WAY</Eyebrow><h2>Different generations.<br />The same <em>thoughtful care.</em></h2><p>A child's first visit. A parent's routine check-up. Your own fresh start. Everyone deserves to feel welcome in the dentist's chair.</p><div className="family-statement"><span>“</span><p>A place to ask questions.<br />A reason to feel at ease.<br />A smile that feels like you.</p><small>OUR APPROACH TO FAMILY CARE</small></div><button className="text-link" onClick={() => scrollToBooking("general")}>Find care for your family <ArrowUpRight size={18} /></button></div></div>
      </section>

      <section className="fees-section wrap">
        <div><Eyebrow>CLARITY COMES FIRST</Eyebrow><h2>Clear options.<br /><em>Clear conversations.</em></h2><p>Ask about the consultation fee, your treatment estimate, and available payment options before you go ahead.</p></div>
        <div className="fees-card"><div className="fees-card-head"><ShieldCheck size={27} /><h3>Before you decide</h3></div><ul className="check-list"><li><Check size={17} /> Your treatment choices, explained</li><li><Check size={17} /> An estimate to discuss with your dentist</li><li><Check size={17} /> Time for the questions that matter</li></ul><span>Clinic-specific fees will be added before launch.</span></div>
      </section>

      <section id="faq" className="faq-section section-pad">
        <div className="wrap faq-grid"><div><Eyebrow>A LITTLE REASSURANCE</Eyebrow><h2>Good questions.<br /><em>Honest answers.</em></h2><p>Wondering what comes next?<br />Let's make it a little clearer.</p><a className="text-link" href="#booking">Have another question? <ArrowUpRight size={17} /></a></div><Accordion type="single" collapsible className="faq-list">{faqs.map(([question, answer], index) => <AccordionItem value={"faq-" + index} key={question}><AccordionTrigger>{question}</AccordionTrigger><AccordionContent>{answer}</AccordionContent></AccordionItem>)}</Accordion></div>
      </section>

      <section id="booking" className="booking-section section-pad">
        <div className="wrap booking-grid">
          <div className="booking-copy"><Eyebrow>LET'S MAKE ROOM FOR YOUR SMILE</Eyebrow><h2>Your next chapter<br />starts with a<br /><em>simple hello.</em></h2><p>Tell us a little about the visit you have in mind. We'll help you find your next step.</p><div className="contact-options"><button onClick={() => window.open("https://wa.me/918980544156", "_blank")}><span><Phone size={20} /></span><div><strong>Prefer a conversation?</strong><small>+91 89805 44156</small></div><ArrowUpRight size={18} /></button><button onClick={() => window.open("https://maps.google.com/?q=Dental+Clinic", "_blank")}><span><MapPin size={20} /></span><div><strong>Find your way to us</strong><small>Clinic location and visiting hours</small></div><ArrowUpRight size={18} /></button></div></div>
          <div className="booking-panel" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', alignSelf: 'center' }}>
            <span className="form-kicker" style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <CalendarDays size={18} /> A GOOD FIRST STEP
            </span>
            <h3 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Let's plan your visit.</h3>
            <p className="form-intro" style={{ marginBottom: '2.5rem', fontSize: '1.1rem' }}>A few details. A little closer to your next smile.</p>
            <a 
              href="https://cal.com/anup-kumar-rz61qm/apna-dental-care-appointment" 
              target="_blank" 
              rel="noopener noreferrer"
              className="button submit-button"
              style={{ width: '100%', maxWidth: '300px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}
            >
              Book Appointment <ArrowUpRight size={19} />
            </a>
            <p className="form-footnote" style={{ marginTop: '2rem', textAlign: 'center' }}><ShieldCheck size={14} /> Opens secure booking page</p>
          </div>
        </div>
      </section>

      <section className="final-cta">
        <img src={imagePath("cta")} alt="The dentist and patient sharing a friendly goodbye in the clinic" width="1672" height="941" loading="lazy" /><div className="cta-wash" /><div className="wrap final-copy"><Eyebrow>YOUR SMILE BELONGS HERE</Eyebrow><h2>Here's to feeling<br />a little more <em>you.</em></h2><button className="button" onClick={() => scrollToBooking()}>Take the first step <ArrowUpRight size={18} /></button></div>
      </section>
    </main>

    <footer className="footer"><div className="wrap footer-top"><div className="footer-brand"><Brand light /><p>Thoughtful care.<br />Familiar faces. Happier smiles.</p><span>MADE FOR EVERY SMILE IN YOUR FAMILY.</span></div><div><h3>Explore Apna</h3><a href="#dentist">Our approach</a><a href="#clinic">Inside the clinic</a><a href="#visit">Your first visit</a><a href="#faq">Your questions</a></div><div><h3>Our care</h3>{services.map((service, index) => <button key={service.id} onClick={() => setServiceOpen(index)}>{service.name}</button>)}</div><div className="footer-visit"><h3>Your smile. Our next hello.</h3><p>Start with a simple conversation.</p><button onClick={() => scrollToBooking()} className="button light">Plan a visit <ArrowUpRight size={18} /></button></div></div><div className="wrap footer-bottom"><span>© {new Date().getFullYear()} Apna Dental Care</span><span>Concept website · Illustrative photography & clinician profile</span><button onClick={() => setInfoOpen("privacy")}>Privacy</button></div></footer>
    <div className="mobile-dock"><button onClick={() => setInfoOpen("contact")} aria-label="Clinic calling information"><Phone size={19} /><span>Call</span></button><button onClick={() => setInfoOpen("contact")} aria-label="WhatsApp information"><MessageCircle size={19} /><span>WhatsApp</span></button><button onClick={() => scrollToBooking()}><CalendarDays size={19} /><span>Book a visit</span><ArrowUpRight size={16} /></button></div>

    <Dialog open={serviceOpen !== null} onOpenChange={open => { if (!open) setServiceOpen(null); }}><DialogContent className="treatment-dialog">{serviceOpen !== null && <><img className="dialog-photo" src={imagePath(services[serviceOpen].image)} alt="" /><div className="dialog-copy"><span className="micro-label">{services[serviceOpen].tag}</span><DialogTitle>{services[serviceOpen].name}</DialogTitle><DialogDescription>{services[serviceOpen].detail}</DialogDescription><h4>Care to explore</h4><ul className="check-list">{services[serviceOpen].includes.map(item => <li key={item}><Check size={17} />{item}</li>)}</ul><p className="treatment-note">{services[serviceOpen].note}</p><button className="button" onClick={() => scrollToBooking(services[serviceOpen].id)}>Ask about this treatment <ArrowUpRight size={18} /></button></div></>}</DialogContent></Dialog>
    <Dialog open={galleryOpen !== null} onOpenChange={open => { if (!open) setGalleryOpen(null); }}><DialogContent className="gallery-dialog">{galleryOpen !== null && <><img src={imagePath(gallery[galleryOpen].image)} alt={gallery[galleryOpen].title} /><div className="gallery-dialog-caption"><div><DialogTitle>{gallery[galleryOpen].title}</DialogTitle><DialogDescription>{gallery[galleryOpen].caption}</DialogDescription></div><div className="gallery-controls"><button aria-label="Previous clinic photo" onClick={() => setGalleryOpen((galleryOpen + gallery.length - 1) % gallery.length)}><ArrowLeft size={20} /></button><span>{galleryOpen + 1} / {gallery.length}</span><button aria-label="Next clinic photo" onClick={() => setGalleryOpen((galleryOpen + 1) % gallery.length)}><ArrowRight size={20} /></button></div></div></>}</DialogContent></Dialog>
    <Dialog open={infoOpen !== null} onOpenChange={open => { if (!open) setInfoOpen(null); }}><DialogContent className="info-dialog"><span className="info-icon">{infoOpen === "privacy" ? <ShieldCheck size={27} /> : <MessageCircle size={27} />}</span><DialogTitle>{infoOpen === "privacy" ? "Your privacy in this demo" : "Let's connect the real clinic."}</DialogTitle><DialogDescription>{infoOpen === "privacy" ? "The appointment form runs entirely in this page. It does not send your name, mobile number or appointment choices to a clinic. Form entries are not saved and disappear when you reload or close the page." : "Apna Dental Care is a concept website. A real clinic's verified phone number, WhatsApp, address and opening hours will appear here when connected. You can explore the appointment experience now."}</DialogDescription>{infoOpen === "contact" && <button className="button" onClick={() => { setInfoOpen(null); scrollToBooking(); }}>Try the appointment demo <ArrowUpRight size={18} /></button>}</DialogContent></Dialog>
  </>;
}
