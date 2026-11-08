export function AuthQuotePanel() {
  return (
    <div className="relative flex items-center justify-center overflow-hidden rounded-[2rem] bg-muted p-12 max-lg:hidden">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-primary/20 via-primary/5 to-transparent" />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-3/4"
        style={{
          background:
            "radial-gradient(ellipse 70% 100% at 50% 100%, rgba(255,255,255,0.35) 0%, rgba(255,255,255,0.12) 40%, transparent 70%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-24 left-1/2 h-48 w-2/3 -translate-x-1/2 rounded-full bg-white/50 blur-3xl"
      />
      <p className="relative max-w-md text-center text-2xl leading-relaxed font-medium text-balance">
        &ldquo;Stop switching tabs. Ask your video{" "}
        <span className="text-primary">anything</span> and get answers straight from its content.&rdquo;
      </p>
    </div>
  );
}
