"use client";

import { useId, useState } from "react";
import Link from "next/link";
import { EyeIcon, EyeOffIcon, UserIcon } from "lucide-react";

import { LineBackground } from "@/components/ui/line-background";
import { AuthQuotePanel } from "@/components/ui/auth-quote-panel";
import { Button } from "@/components/ui/sign-in-3-utils/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/sign-in-3-utils/field";
import { Input } from "@/components/ui/sign-in-3-utils/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/sign-in-3-utils/input-group";
import { FancyButton } from "@/components/ui/fancy-button";
import { Icons } from "@/components/ui/sign-in-3-utils/icons";

type SocialProvider = {
  label: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
};

const providers: SocialProvider[] = [
  { label: "Google", icon: Icons.Google },
  { label: "GitHub", icon: Icons.GitHub },
];

export function SignUp() {
  const id = useId();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <main
      aria-label="Create account"
      className="relative flex min-h-screen w-full items-center justify-center bg-background text-foreground"
    >
      <LineBackground />
      <div className="relative z-10 grid h-[80vh] w-[80vw] grid-cols-1 overflow-hidden rounded-[2rem] border border-border bg-background lg:grid-cols-2 lg:p-2">
      <section className="flex flex-col items-center justify-center gap-6 overflow-y-auto px-4 py-6">
        <div className="flex max-w-sm flex-col items-center gap-4">
          <div className="relative flex size-14 items-center justify-center">
            <div className="absolute inset-0 scale-125 rounded-full bg-primary/10" />
            <div className="relative z-10 flex size-14 items-center justify-center rounded-full bg-card ring-1 ring-inset ring-primary/10">
              <UserIcon aria-hidden="true" className="size-6 text-primary" />
            </div>
          </div>
          <div className="text-center">
            <h1 className="text-xl font-semibold tracking-tight text-balance sm:text-2xl">
              Create your account
            </h1>
            <p className="text-base text-muted-foreground">Enter your details to get started.</p>
          </div>
        </div>

        <div className="flex w-full max-w-sm flex-col gap-6">
          <FieldGroup className="gap-3">
            <Field className="gap-1">
              <FieldLabel htmlFor={`${id}-name`}>Full name</FieldLabel>
              <Input id={`${id}-name`} type="text" placeholder="Your name" className="h-10" />
            </Field>

            <Field className="gap-1">
              <FieldLabel htmlFor={`${id}-email`}>Email</FieldLabel>
              <Input id={`${id}-email`} type="email" placeholder="you@example.com" className="h-10" />
            </Field>

            <Field className="gap-1">
              <div className="flex items-center justify-between">
                <FieldLabel htmlFor={`${id}-password`}>Password</FieldLabel>
              </div>
              <InputGroup className="h-10">
                <InputGroupInput
                  id={`${id}-password`}
                  type={showPassword ? "text" : "password"}
                  placeholder="At least 8 characters"
                  className="h-10"
                />
                <InputGroupAddon align="inline-end">
                  <InputGroupButton
                    size="icon-xs"
                    type="button"
                    onClick={() => setShowPassword((s) => !s)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOffIcon aria-hidden="true" /> : <EyeIcon aria-hidden="true" />}
                  </InputGroupButton>
                </InputGroupAddon>
              </InputGroup>
            </Field>

            <Field className="gap-1">
              <div className="flex items-center justify-between">
                <FieldLabel htmlFor={`${id}-confirm`}>Confirm password</FieldLabel>
              </div>
              <InputGroup className="h-10">
                <InputGroupInput
                  id={`${id}-confirm`}
                  type={showConfirm ? "text" : "password"}
                  placeholder="Re-enter your password"
                  className="h-10"
                />
                <InputGroupAddon align="inline-end">
                  <InputGroupButton
                    size="icon-xs"
                    type="button"
                    onClick={() => setShowConfirm((s) => !s)}
                    aria-label={showConfirm ? "Hide confirm password" : "Show confirm password"}
                  >
                    {showConfirm ? <EyeOffIcon aria-hidden="true" /> : <EyeIcon aria-hidden="true" />}
                  </InputGroupButton>
                </InputGroupAddon>
              </InputGroup>
            </Field>

            <FancyButton type="button" size="lg" className="w-full">
              Create account
            </FancyButton>
          </FieldGroup>

          <div className="relative text-center text-xs uppercase text-muted-foreground before:absolute before:inset-x-0 before:top-1/2 before:h-px before:bg-border before:content-['']">
            <span className="relative bg-background px-2">or continue with</span>
          </div>

          <div className="flex flex-col gap-3">
            {providers.map(({ icon: Icon, label }) => (
              <Button key={label} type="button" variant="outline" size="lg" className="w-full [&_svg]:size-5">
                <Icon aria-hidden="true" />
                Continue with {label}
              </Button>
            ))}
          </div>

          <div className="flex flex-wrap items-center justify-center gap-x-1 text-sm text-muted-foreground">
            <span>Already have an account?</span>
            <Button
              variant="link"
              className="h-auto p-0"
              nativeButton={false}
              render={<Link href="/login" />}
            >
              Sign in
            </Button>
          </div>
        </div>
      </section>

      <AuthQuotePanel />
      </div>
    </main>
  );
}

export default SignUp;
