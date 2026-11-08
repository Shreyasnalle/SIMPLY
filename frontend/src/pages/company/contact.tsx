import { useState } from "react";
import { InfoPage, Block } from "@/components/info-page";
import { FancyButton } from "@/components/ui/fancy-button";
import { Input } from "@/components/ui/sign-in-3-utils/input";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/sign-in-3-utils/field";

export default function ContactPage() {
  const [sent, setSent] = useState(false);

  return (
    <InfoPage
      title="Contact"
      eyebrow="Company"
      heading="Talk to us"
      description="Feedback, bugs, partnership ideas or a question about your plan. We read everything."
    >
      <Block>
        {sent ? (
          <p className="text-base text-foreground">Thanks for reaching out. We&apos;ll get back to you soon.</p>
        ) : (
          <form
            className="max-w-xl"
            onSubmit={(e) => {
              e.preventDefault();
              setSent(true);
            }}
          >
            <FieldGroup className="gap-4">
              <Field className="gap-1">
                <FieldLabel htmlFor="c-name">Name</FieldLabel>
                <Input id="c-name" required placeholder="Your name" className="h-10" />
              </Field>
              <Field className="gap-1">
                <FieldLabel htmlFor="c-email">Email</FieldLabel>
                <Input id="c-email" type="email" required placeholder="you@example.com" className="h-10" />
              </Field>
              <Field className="gap-1">
                <FieldLabel htmlFor="c-msg">Message</FieldLabel>
                <textarea
                  id="c-msg"
                  required
                  rows={5}
                  placeholder="How can we help?"
                  className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm text-foreground outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30"
                />
              </Field>
              <FancyButton type="submit" size="lg" className="w-full sm:w-auto">
                Send message
              </FancyButton>
            </FieldGroup>
          </form>
        )}
      </Block>
    </InfoPage>
  );
}
