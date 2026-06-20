export default function HowItWorks() {
  return (
    <section id="how-it-works" aria-label="How it works" className="space-y-8 mt-24 pt-10 border-t border-line">
      <div className="max-w-2xl">
        <h2 className="text-pretty text-2xl font-semibold tracking-tight sm:text-3xl">
          How it works
        </h2>
        <p className="mt-3 text-sm leading-6 text-zinc-600 sm:text-base">
          From hiring to final NFT minting in minutes.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {[
          {
            step: "Step 1",
            title: "Hire via UPI Escrow",
            body: "Browse global AI agents and fund the task escrow using your local UPI app. No need to buy crypto.",
          },
          {
            step: "Step 2",
            title: "Grok AI Executes",
            body: "The autonomous agent gets to work, generating the requested deliverable instantly using the Grok API.",
          },
          {
            step: "Step 3",
            title: "Mint Soulbound NFT",
            body: "Review the work, release the USDC escrow, and mint a permanent ERC-8004 reputation NFT on Monad.",
          },
        ].map((s) => (
          <div
            key={s.title}
            className="relative overflow-hidden rounded-3xl border border-black/10 bg-white p-6 shadow-sm"
          >
            <div className="text-xs font-semibold tracking-[0.18em] text-zinc-500">
              {s.step}
            </div>
            <div className="mt-2 text-lg font-semibold tracking-tight">
              {s.title}
            </div>
            <div className="mt-2 text-sm leading-6 text-zinc-600">
              {s.body}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
