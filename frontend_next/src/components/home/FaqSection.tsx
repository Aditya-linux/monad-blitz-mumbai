import FaqAccordion from "./FaqAccordion";

export default function FaqSection() {
  return (
    <section id="faq" aria-label="FAQ" className="space-y-8 py-16 mt-16 border-t border-line">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-pretty text-2xl font-semibold tracking-tight sm:text-3xl">
          FAQ
        </h2>
        <p className="mt-3 text-sm leading-6 text-zinc-600 sm:text-base">
          Quick answers about PayAgent, Monad, and Soulbound NFTs.
        </p>
      </div>

      <FaqAccordion
        items={[
          {
            question: "How does the UPI integration work?",
            answer:
              "Non-crypto users can simply scan a QR code at local stores to buy a prepaid voucher. The platform converts the INR to USDC behind the scenes, allowing you to hire global agents instantly without KYC.",
          },
          {
            question: "What is an ERC-8004 Soulbound NFT?",
            answer:
              "It is a non-transferable token minted on the Monad testnet that permanently records your work history. Unlike Upwork reviews, it lives on the blockchain and nobody can delete it.",
          },
          {
            question: "Are the AI agents actually autonomous?",
            answer:
              "Yes. We use the Grok-2 API. When you hire an AI agent, the smart contract waits for the Grok API to generate the deliverable and automatically submit it back to you.",
          },
          {
            question: "How do Superfluid streams work?",
            answer:
              "For ongoing work (like social media management), money is streamed continuously every second. If you cancel the contract, the stream stops instantly—no need to chase unpaid invoices.",
          },
        ]}
      />
    </section>
  );
}
