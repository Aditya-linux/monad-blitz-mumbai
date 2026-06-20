import Link from "next/link";
import type { ReactNode } from "react";
import { Bot } from "lucide-react";

function LogoBadge() {
  return (
    <div className="hidden absolute right-[6rem] top-1/2 size-32 -translate-y-1/2 items-center justify-center rounded-3xl border-3 border-white/30 bg-white/90 p-4 backdrop-blur xl:flex">
      <div className="grid h-16 w-16 rotate-6 place-items-center rounded-2xl bg-indigo p-2.5 backdrop-blur shadow-xl">
        <Bot className="w-8 h-8 text-white" />
      </div>
    </div>
  );
}

function FooterLink({
  href,
  children,
}: {
  href: string;
  children: ReactNode;
}) {
  return (
    <li>
      <Link
        href={href}
        className="text-zinc-600 hover:text-indigo transition-colors"
      >
        {children}
      </Link>
    </li>
  );
}

export default function Footer() {
  return (
    <footer className="mt-16 relative left-1/2 w-screen -translate-x-1/2 px-4 sm:px-6">
      <div className="bg-white/60 w-full rounded-3xl border border-zinc-200 p-2">
        <div className="relative min-h-[18rem] w-full overflow-hidden rounded-2xl border border-zinc-200 sm:h-[20rem] bg-indigo-deep">
          
          {/* Subtle gradient background instead of image */}
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-deep via-indigo to-indigo-deep opacity-80" />

          <LogoBadge />

          <div className="relative z-10 flex h-full flex-col items-start justify-between px-4 pt-2 pb-2 sm:justify-center sm:pb-4 md:px-8">
            <div className="relative flex flex-col items-start justify-start">
              <p className="mt-2 max-w-xl text-left text-xl font-semibold tracking-tight text-white sm:mt-3 sm:text-2xl md:text-4xl">
                Ready to hire global talent?
              </p>
              <p className="max-w-xl pt-2 text-left text-xs text-indigo-light sm:pt-3 sm:text-sm">
                Pay with your local UPI app, get instant results from Grok AI, and mint permanent Soulbound Reputation on the Monad testnet.
              </p>
            </div>

            <div className="mt-4 flex w-full flex-row flex-wrap items-stretch justify-center gap-2 sm:mt-6 md:items-start md:justify-start md:gap-4">
              <Link
                href="/app/marketplace"
                className="inline-flex items-center justify-center whitespace-nowrap rounded-md bg-white px-3 py-2 text-sm font-medium text-indigo shadow-sm transition-colors hover:bg-gray-50 w-full sm:w-auto"
              >
                Hire an Agent
              </Link>
              <Link
                href="/become-an-agent"
                className="inline-flex items-center justify-center whitespace-nowrap rounded-md border border-indigo-light/30 bg-indigo-deep/50 px-3 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-indigo-deep w-full sm:w-auto"
              >
                Become an Agent
              </Link>
            </div>

            <div className="mt-6 text-xs text-indigo-light/50">
              © {new Date().getFullYear()} PAYAGENT
            </div>
          </div>
        </div>

      {/* Links section */}
      <div className="px-4 pt-12 pb-2 md:pb-12">
        <div className="mx-auto w-full max-w-7xl">
          <div className="mb-8 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            <div className="lg:col-span-1">
              <div className="mb-4 flex items-center">
                <div className="flex items-center justify-center">
                  <div className="grid h-10 w-10 place-items-center rounded-xl bg-indigo p-2">
                    <Bot className="w-5 h-5 text-white" />
                  </div>
                </div>
              </div>
              <p className="mb-4 text-sm text-zinc-600">
                The bridge between 600M+ Indian users and the global agent economy on Monad.
              </p>
            </div>

            <div>
              <h4 className="mb-4 font-semibold">Platform</h4>
              <ul className="space-y-3 text-sm">
                <FooterLink href="/app/marketplace">Marketplace</FooterLink>
                <FooterLink href="/app">Hirer Dashboard</FooterLink>
                <FooterLink href="/agent">Agent Dashboard</FooterLink>
              </ul>
            </div>

            <div>
              <h4 className="mb-4 font-semibold">Features</h4>
              <ul className="space-y-3 text-sm">
                <FooterLink href="#">UPI Gift Cards</FooterLink>
                <FooterLink href="#">Soulbound NFTs</FooterLink>
                <FooterLink href="#">Superfluid Streaming</FooterLink>
                <FooterLink href="#">Grok AI Integration</FooterLink>
              </ul>
            </div>

            <div>
              <h4 className="mb-4 font-semibold">Legal & Info</h4>
              <ul className="space-y-3 text-sm">
                <FooterLink href="#">Terms of Service</FooterLink>
                <FooterLink href="#">Privacy Policy</FooterLink>
              </ul>
            </div>
          </div>

          <div className="border-t border-zinc-200 pt-8">
            <div className="flex flex-col items-center justify-between md:flex-row">
              <p className="text-sm text-zinc-500">
                © {new Date().getFullYear()} PAYAGENT. Built for Monad Madness.
              </p>
            </div>
          </div>
        </div>
      </div>
      </div>
    </footer>
  );
}
