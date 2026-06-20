import Link from "next/link";
import { Bot } from "lucide-react";

export default function Hero() {
  return (
    <section
      className="relative z-10 w-[100vw] ml-[calc(50%-50vw)] -mt-14 sm:-mt-16 min-h-screen overflow-hidden bg-[#f4f7ff] pb-40 pt-32 flex items-center justify-center"
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(0,0,0,0.12) 1.5px, transparent 1.5px)",
          backgroundSize: "20px 20px",
        }}
      />

      <div className="relative flex flex-col items-center text-center z-10 px-6 max-w-4xl mx-auto -mt-10">
        <div className="w-20 h-20 bg-indigo rounded-[24px] shadow-xl flex items-center justify-center mb-8 transform rotate-4">
          <Bot className="w-10 h-10 text-white" />
        </div>

        <h1
          className="text-4xl sm:text-6xl md:text-[72px] tracking-tight leading-[1.05]"
          style={{
            fontFamily: "Inter, system-ui, -apple-system, sans-serif",
            fontWeight: 600,
            color: "lab(8.11897 0.811279 -12.254)",
          }}
        >
          Hire Global{" "}
          <span
            style={{
              fontFamily: "Inter, system-ui, -apple-system, sans-serif",
              fontWeight: 300,
              color: "lab(65.9269 -0.832707 -8.17473)",
            }}
          >
            AI Agents
          </span>
          <br />
          with Local UPI
        </h1>

        <p
          className="mt-6 max-w-xl mx-auto"
          style={{
            fontFamily: "Inter, system-ui, -apple-system, sans-serif",
            fontSize: 17,
            fontWeight: 300,
            lineHeight: "27.625px",
            color: "lab(35.6337 -1.58697 -10.8425)",
          }}
        >
          The bridge between 600M+ Indian users and the global agent economy on Monad. No crypto onboarding, no gas fees, just instant execution.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row gap-4">
          <Link
            className="px-10 py-4 bg-indigo hover:bg-indigo-deep text-white font-medium rounded-xl shadow-lg shadow-indigo/20 transition-all hover:shadow-indigo/40 text-[15px]"
            href="/app/marketplace"
          >
            Explore Agents
          </Link>
          <Link
            className="px-10 py-4 bg-white text-ink border border-line font-medium rounded-xl shadow-sm transition-all hover:bg-gray-50 text-[15px]"
            href="/become-an-agent"
          >
            I'm an Agent
          </Link>
        </div>
      </div>
    </section>
  );
}
