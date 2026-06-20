'use client';

import { useEffect, useState } from "react";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAppStore } from '@/lib/store';
import PriceTicker from './PriceTicker';
import NotificationBell from './NotificationBell';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Bot } from "lucide-react";

export default function Navbar() {
  const { role, setRole } = useAppStore();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Temporary role switcher for dev/demo purposes
  const RoleSwitcher = () => (
    <select 
      value={role} 
      onChange={(e) => setRole(e.target.value as any)}
      className="text-xs bg-paper border border-line rounded px-2 py-1.5 font-mono outline-none"
    >
      <option value="none">Role: None</option>
      <option value="hirer">Role: Hirer</option>
      <option value="agent">Role: Agent</option>
    </select>
  );

  return (
    <>
    <nav
      className={[
        "fixed right-0 left-0 z-[110] mx-auto flex max-w-7xl justify-center top-0 px-2 md:px-4 transition-all duration-300",
        scrolled ? "mt-2" : "mt-0",
        pathname !== '/' && !scrolled ? "mt-2" : "" // Add a bit of margin on app pages even when not scrolled
      ].join(" ")}
    >
      <div className="w-full">
        <div
          className={[
            "flex w-full items-center justify-between py-2.5 transition-all duration-300 sm:py-3 md:px-4 rounded-xl px-2 sm:rounded-2xl sm:px-4",
            scrolled || pathname !== '/'
              ? "bg-white/90 shadow-sm border border-black/10 backdrop-blur-lg"
              : "bg-white/0 shadow-none border border-transparent",
          ].join(" ")}
        >
          <div className="flex items-center gap-6">
            <Link href="/" className="cursor-pointer">
              <div className="flex items-center gap-2">
                <div className="grid h-9 w-9 place-items-center rounded-xl bg-indigo shadow-sm transform rotate-4">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <span className="font-bold text-xl tracking-tight text-gray-900 ml-1 hidden sm:block">
                  PAYAGENT
                </span>
              </div>
            </Link>

            <div className="hidden lg:flex items-center gap-6 text-[14px] font-medium text-gray-500">
              {role === 'none' && (
                <>
                  <Link href="/become-an-agent" className="hover:text-indigo transition-colors">Become an Agent</Link>
                  <Link href="#how-it-works" className="hover:text-indigo transition-colors">How it Works</Link>
                </>
              )}
              {role === 'hirer' && (
                <>
                  <Link href="/app" className="hover:text-indigo transition-colors">Dashboard</Link>
                  <Link href="/app/marketplace" className="hover:text-indigo transition-colors">Marketplace</Link>
                  <Link href="/app/tasks" className="hover:text-indigo transition-colors">My Tasks</Link>
                  <Link href="/app/subscriptions" className="hover:text-indigo transition-colors">Streams</Link>
                  <Link href="/app/vouchers" className="hover:text-indigo transition-colors">Gift Cards</Link>
                </>
              )}
              {role === 'agent' && (
                <>
                  <Link href="/agent" className="hover:text-indigo transition-colors">Dashboard</Link>
                  <Link href="/agent/tasks" className="hover:text-indigo transition-colors">Task Queue</Link>
                  <Link href="/agent/earnings" className="hover:text-indigo transition-colors">Earnings</Link>
                </>
              )}
              {role === 'admin' && (
                <>
                  <Link href="/admin" className="hover:text-indigo transition-colors">Overview</Link>
                  <Link href="/admin/transactions" className="hover:text-indigo transition-colors">Ledger</Link>
                </>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden xl:block">
              <PriceTicker />
            </div>
            <RoleSwitcher />
            
            {role !== 'none' && <NotificationBell />}
            
            <ConnectButton showBalance={false} />
          </div>
        </div>
      </div>
    </nav>
    {pathname !== '/' && <div className="h-24 w-full" aria-hidden="true" />}
    </>
  );
}
