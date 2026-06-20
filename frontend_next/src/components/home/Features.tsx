type Feature = {
  title: string;
  body: string;
  accent: string;
  badge: string;
  variant: "run" | "pricing" | "payouts" | "nocode";
};

const FEATURES: Feature[] = [
  {
    title: "Soulbound Reputation",
    body: "Every completed task mints an ERC-8004 Soulbound NFT on the Monad testnet. Real, un-fakeable work history.",
    accent: "from-cyan-300/14 via-white/0 to-white/0",
    badge: "ERC-8004",
    variant: "run",
  },
  {
    title: "UPI to Crypto Escrow",
    body: "Onboard non-crypto natives instantly with local UPI gift cards. Seamlessly converted to USDC for platform escrow.",
    accent: "from-lime-300/14 via-white/0 to-white/0",
    badge: "Frictionless",
    variant: "pricing",
  },
  {
    title: "Streaming Subscriptions",
    body: "Retain agents with real-time Superfluid money streams. Pay continuously by the second, cancel anytime.",
    accent: "from-fuchsia-400/14 via-white/0 to-white/0",
    badge: "Pay-as-you-go",
    variant: "payouts",
  },
  {
    title: "Grok AI Execution",
    body: "Hire autonomous AI agents that complete deliverables instantly via Grok-2 APIs without human intervention.",
    accent: "from-zinc-200/12 via-white/0 to-white/0",
    badge: "Autonomous",
    variant: "nocode",
  },
];

export default function Features() {
  return (
    <section id="features" aria-label="Features" className="space-y-8">
      <div className="max-w-2xl">
        <h2 className="text-pretty text-2xl font-semibold tracking-tight sm:text-3xl">
          Everything you need to hire global talent
        </h2>
        <p className="mt-3 text-sm leading-6 text-zinc-600 sm:text-base">
          A seamless P2P marketplace combining the UX of Web2 with the permanent, censorship-resistant infrastructure of Web3.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {FEATURES.map((f) => (
          <div
            key={f.title}
            className="group flex h-[18rem] flex-col overflow-hidden rounded-3xl border border-black/10 bg-white p-4 shadow-sm transition-colors hover:border-black/15 hover:bg-zinc-50"
          >
            <div className="relative flex-[7] overflow-hidden rounded-2xl border border-black/10 bg-zinc-50">
              <div
                className={[
                  "pointer-events-none absolute inset-0 bg-gradient-to-br opacity-100 transition-opacity group-hover:opacity-90",
                  f.accent,
                ].join(" ")}
              />

              <div className="absolute left-3 top-3 rounded-full border border-black/10 bg-white px-2.5 py-1 text-[11px] font-semibold text-zinc-800 shadow-sm">
                {f.badge}
              </div>

              {f.variant === "run" ? (
                <div className="absolute inset-x-3 bottom-3 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="text-[11px] font-semibold tracking-[0.14em] text-zinc-600">
                      ON-CHAIN
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-zinc-600">
                      <span className="relative inline-flex h-2 w-2">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400/35" />
                        <span className="relative inline-flex h-2 w-2 rounded-full bg-cyan-500" />
                      </span>
                      monad testnet
                    </div>
                  </div>
                  <div className="space-y-2">
                    {["Minting", "Verifying", "Secured"].map((label, i) => (
                      <div key={label} className="flex items-center gap-3">
                        <div className="w-14 text-[11px] text-zinc-500">
                          {label}
                        </div>
                        <div className="h-2 flex-1 overflow-hidden rounded-full border border-black/10 bg-white">
                          <div
                            className="h-full rounded-full bg-cyan-500/50 animate-pulse"
                            style={{
                              width:
                                i === 0 ? "45%" : i === 1 ? "70%" : "100%",
                              animationDelay: `${i * 120}ms`,
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : f.variant === "pricing" ? (
                <div className="absolute inset-x-3 bottom-3">
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { k: "Users", v: "600M+" },
                      { k: "Avg", v: "₹150" },
                      { k: "Fee", v: "0 Gas" },
                    ].map((m) => (
                      <div
                        key={m.k}
                        className="rounded-2xl border border-black/10 bg-white px-2.5 py-2.5 shadow-sm"
                      >
                        <div className="text-[11px] text-zinc-500">{m.k}</div>
                        <div className="mt-1 text-sm font-semibold tabular-nums text-zinc-900">
                          {m.v}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : f.variant === "payouts" ? (
                <div className="absolute inset-x-3 bottom-3 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="text-[11px] font-semibold tracking-[0.14em] text-zinc-600">
                      STREAMED
                    </div>
                    <div className="rounded-full bg-zinc-900 px-2.5 py-1 text-[11px] font-semibold tabular-nums text-white shadow-sm">
                      $2,418.45
                    </div>
                  </div>
                  <div className="space-y-2">
                    {[
                      { label: "This week", w: 78 },
                      { label: "Last week", w: 62 },
                      { label: "Baseline", w: 44 },
                    ].map((row, idx) => (
                      <div key={row.label} className="flex items-center gap-3">
                        <div className="w-20 text-[11px] text-zinc-500">
                          {row.label}
                        </div>
                        <div className="h-2 flex-1 overflow-hidden rounded-full border border-black/10 bg-white">
                          <div
                            className="h-full rounded-full bg-fuchsia-500/40 animate-pulse"
                            style={{
                              width: `${row.w}%`,
                              animationDelay: `${idx * 120}ms`,
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="absolute inset-x-3 bottom-3">
                  <div className="rounded-2xl border border-black/10 bg-white p-3 shadow-sm">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 animate-pulse rounded-full bg-zinc-900/60" />
                      <div className="text-xs font-semibold text-zinc-700">
                        Agent Brain
                      </div>
                    </div>
                    <div className="mt-3 grid grid-cols-3 gap-2">
                      {["Prompt", "Grok", "Result"].map((t) => (
                        <div
                          key={t}
                          className="rounded-xl border border-black/10 bg-zinc-50 px-2.5 py-1.5 text-[11px] text-zinc-600"
                        >
                          {t}
                        </div>
                      ))}
                    </div>
                    <div className="mt-3 h-2 overflow-hidden rounded-full border border-black/10 bg-zinc-50">
                      <div className="h-full w-[100%] rounded-full bg-zinc-900/25 animate-pulse" />
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="flex-[3] pt-4">
              <div className="text-sm font-semibold tracking-tight">
                {f.title}
              </div>
              <div className="mt-2 text-sm leading-6 text-zinc-600">
                {f.body}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
