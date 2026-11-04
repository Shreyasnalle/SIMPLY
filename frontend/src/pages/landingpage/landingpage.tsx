import Head from "next/head";
import { ArrowRight, Check, CirclePlay, FileText, Globe2, Layers3, MessageCircleQuestion, Sparkles, WandSparkles } from "lucide-react";
import HorizonGlowHero from "@/components/HorizonGlowHero";
import ResizableNavbar from "@/components/resizable-navbar-demo";

const features = [
  { icon: MessageCircleQuestion, eyebrow: "Ask in context", title: "Turn any lesson into a conversation.", copy: "Ask questions in the same tab and get answers grounded in the video you are watching—not a generic web search.", className: "md:col-span-2 md:min-h-[360px]" },
  { icon: WandSparkles, eyebrow: "Understand faster", title: "Make dense ideas feel simple.", copy: "Simply follows the transcript, chapters, and the moment on screen to explain the part that matters now.", className: "md:min-h-[360px]" },
  { icon: Layers3, eyebrow: "Keep your place", title: "Less pausing. More learning.", copy: "Save the thread of a lesson while you explore examples, definitions, and follow-up questions.", className: "md:min-h-[300px]" },
  { icon: FileText, eyebrow: "Built for study", title: "From lectures to working notes.", copy: "Summaries and clean explanations turn passive watching into useful study material.", className: "md:col-span-2 md:min-h-[300px]" },
];

const plans = [
  { name: "Free", price: "$0", description: "For curious learners getting started.", features: ["YouTube learning assistant", "Context-aware questions", "Video summaries"], cta: "Start learning" },
  { name: "Simply Pro", price: "$12", description: "For students who learn every day.", features: ["Everything in Free", "Long-video understanding", "Visual and math context", "Saved learning history"], cta: "Get Pro", featured: true },
  { name: "Teams", price: "Let’s talk", description: "For classrooms and learning communities.", features: ["Shared study spaces", "Admin controls", "Flexible support", "Early access to new tools"], cta: "Contact us" },
];

function SectionHeading({ eyebrow, title, copy }: { eyebrow: string; title: string; copy: string }) {
  return <div className="mx-auto max-w-2xl text-center"><p className="section-eyebrow">{eyebrow}</p><h2 className="section-title">{title}</h2><p className="section-copy">{copy}</p></div>;
}

function ProductPreview() {
  return <div className="preview-shell">
    <div className="preview-topbar"><div className="flex items-center gap-2"><span className="preview-dot bg-[#ff6f5e]" /><span className="preview-dot bg-[#ffbf69]" /><span className="preview-dot bg-[#6fce8b]" /></div><span className="preview-url">youtube.com/watch?v=simply</span><span className="preview-pill">SIMPLY</span></div>
    <div className="preview-body"><div className="preview-video"><div className="preview-video-glow" /><span className="preview-chapter">CHAPTER 03 · 12:48</span><h3>Understanding the idea, not just the answer.</h3><div className="preview-controls"><CirclePlay size={17} fill="currentColor" /><span>12:48 / 28:16</span><span className="preview-progress" /></div></div><div className="preview-chat"><div className="flex items-center justify-between border-b border-white/10 pb-4"><span className="font-semibold text-white">Ask Simply</span><Sparkles size={15} className="text-[#ff8d72]" /></div><div className="preview-question">Why does this step matter?</div><div className="preview-answer"><span className="answer-label">SIMPLY</span><p>It connects the concept to the example you just saw. Think of it as the bridge between the rule and the result.</p></div><div className="preview-input">Ask a follow-up <ArrowRight size={14} /></div></div></div>
  </div>;
}

export default function LandingPage() {
  return <><Head><title>Simply — Learn without leaving the lesson</title><meta name="description" content="Simply is the AI teaching assistant for YouTube." /></Head><main className="landing-page">
    <ResizableNavbar /><HorizonGlowHero className="hero-section" eyebrow="THE AI TEACHING ASSISTANT FOR YOUTUBE" />
    <section id="how-it-works" className="marketing-section explainer-section"><SectionHeading eyebrow="SEE IT IN ACTION" title="The lesson stays open. So does your thinking." copy="Simply sits beside the video, listens to the lesson, and helps you move from confusion to clarity without breaking your flow." /><div className="video-stage"><div className="video-stage-header"><span className="video-label"><span className="live-dot" /> PRODUCT WALKTHROUGH</span><span>02:14</span></div><ProductPreview /><button className="play-button" aria-label="Play product walkthrough"><CirclePlay size={23} fill="currentColor" /><span>Play walkthrough</span></button></div><div className="three-step-grid">{["Open a lesson", "Ask what you need", "Keep learning"].map((step, index) => <div key={step} className="step-item"><span>0{index + 1}</span><div><h3>{step}</h3><p>{["Start any educational YouTube video and open Simply in your browser.", "Ask for an explanation, a summary, or the next step in plain language.", "Get useful answers with the context of the video already attached."][index]}</p></div></div>)}</div></section>
    <section id="features" className="marketing-section features-section"><SectionHeading eyebrow="WHY SIMPLY" title="A better way to watch something difficult." copy="Designed for the moments when a video is almost making sense—but you need one more explanation." /><div className="feature-grid">{features.map(({ icon: Icon, eyebrow, title, copy, className }) => <article className={`feature-card ${className}`} key={title}><div className="feature-icon"><Icon size={21} /></div><p className="card-eyebrow">{eyebrow}</p><h3>{title}</h3><p>{copy}</p><span className="card-arrow"><ArrowRight size={17} /></span></article>)}</div></section>
    <section id="pricing" className="marketing-section pricing-section"><SectionHeading eyebrow="PRICING" title="Start for free. Go deeper when you’re ready." copy="Simple plans for people who want to understand more from the time they already spend learning online." /><div className="pricing-grid">{plans.map((plan) => <article className={`price-card ${plan.featured ? "price-card-featured" : ""}`} key={plan.name}>{plan.featured && <span className="recommended">RECOMMENDED</span>}<p className="card-eyebrow">{plan.name}</p><div className="price">{plan.price}{plan.price.startsWith("$") && <small>/ month</small>}</div><p className="price-description">{plan.description}</p><a className={`price-cta ${plan.featured ? "price-cta-featured" : ""}`} href="#contact">{plan.cta}<ArrowRight size={16} /></a><div className="price-features">{plan.features.map((feature) => <span key={feature}><Check size={15} />{feature}</span>)}</div></article>)}</div></section>
    <section id="contact" className="cta-section"><div><p className="section-eyebrow">LEARNING, MADE SIMPLY</p><h2>Bring better questions<br />to every video.</h2><p>Install the extension and turn your next lesson into a conversation.</p></div><a className="cta-button" href="#how-it-works"><Globe2 size={18} /> Get the extension <ArrowRight size={17} /></a></section>
    <footer className="site-footer"><div className="footer-brand"><span>SIMPLY</span><p>Your AI teaching assistant for YouTube.</p></div><div className="footer-links"><a href="#how-it-works">How it works</a><a href="#features">Features</a><a href="#pricing">Pricing</a><a href="mailto:hello@simply.study">Contact</a></div><span className="footer-copy">© 2026 Simply</span></footer>
  </main></>;
}
