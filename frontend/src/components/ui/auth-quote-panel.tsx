export function AuthQuotePanel() {
  return (
    <div className="relative flex items-center justify-center overflow-hidden rounded-[2rem] bg-muted p-12 max-lg:hidden">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-primary/25 via-primary/10 to-transparent" />
      <p className="relative max-w-md text-center text-2xl leading-relaxed font-medium text-balance">
        &ldquo;Stop switching tabs. Ask your video{" "}
        <span className="text-primary">anything</span> and get answers straight from its content.&rdquo;
      </p>
    </div>
  );
}
