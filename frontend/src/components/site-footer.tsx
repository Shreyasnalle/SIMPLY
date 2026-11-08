import BeamWordmarkFooter from "@/components/ui/beam-wordmark-footer";

export default function SiteFooter() {
  return (
    <div id="contact" className="border-t border-white/10">
    <BeamWordmarkFooter
      brand="Simply"
      company="Simply"
      background="#040405"
      ink="#fafafa"
      muted="#a1a1aa"
      accent="#e4e4e7"
      wordTop="#6b6b78"
      wordFoot="#040405"
      fontSans="var(--font-sans)"
      credits={[
        { label: "Simply", tail: " is your AI video learning assistant." },
        { lead: "Learn faster, ", label: "without the ten tabs" },
      ]}
      columns={[
        {
          title: "Our Product",
          links: [
            { label: "How it works", href: "/product/how-it-works" },
            { label: "Features", href: "/product/features" },
            { label: "Pricing", href: "/product/pricing" },
          ],
        },
        {
          title: "Company",
          links: [
            { label: "About Us", href: "/company/about" },
            { label: "FAQ", href: "/company/faq" },
            { label: "Contact", href: "/company/contact" },
          ],
        },
      ]}
    />
    </div>
  );
}
