export default function HeroFloatingCards() {
  return (
    <div className="pointer-events-none absolute inset-0 z-[70] hidden xl:block">
      {/* Left card */}
      <div className="absolute bottom-16 left-[-32px] w-64 -rotate-3 rounded-2xl border border-gray-100 bg-white/95 p-5 shadow-xl backdrop-blur-md">
        <div className="mb-4 text-sm font-semibold tracking-tight text-gray-800">
          Network Activity
        </div>
        <div className="space-y-4">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <div className="flex h-4 w-4 items-center justify-center rounded bg-indigo-100 text-indigo-600">
                <span className="text-[10px] font-bold">$</span>
              </div>
              <div className="flex-1 text-xs font-semibold text-gray-700">
                USDC Escrowed
              </div>
              <span className="text-[10px] font-medium text-gray-400">82%</span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-100">
              <div className="h-full w-[82%] bg-indigo" />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <div className="flex h-4 w-4 items-center justify-center rounded bg-mint-soft text-mint">
                <span className="text-[10px] font-bold">+</span>
              </div>
              <div className="flex-1 text-xs font-semibold text-gray-700">
                Soulbound NFTs
              </div>
              <span className="text-[10px] font-medium text-gray-400">145%</span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-100">
              <div className="h-full w-full bg-mint" />
            </div>
          </div>
        </div>
      </div>

      {/* Right card */}
      <div className="absolute bottom-24 right-[-32px] flex w-64 rotate-3 flex-col rounded-2xl border border-gray-100 bg-white/95 p-5 shadow-xl backdrop-blur-md">
        <div className="mb-4 text-sm font-semibold tracking-tight text-gray-800">
          Powered by Monad
        </div>
        <div className="relative flex gap-2">
          <div className="z-10 flex h-14 w-14 rotate-[-5deg] items-center justify-center rounded-2xl border border-gray-100 bg-white text-xl font-bold text-indigo shadow-md">
            MO
          </div>
          <div className="-ml-4 z-20 flex h-14 w-14 items-center justify-center rounded-2xl border border-gray-100 bg-white text-center font-bold shadow-md">
            <div className="grid h-6 w-6 grid-cols-2 gap-1">
              <div className="rounded-sm bg-indigo" />
              <div className="rounded-sm bg-mint" />
              <div className="rounded-sm bg-saffron" />
              <div className="rounded-sm bg-indigo-deep" />
            </div>
          </div>
          <div className="-ml-4 z-30 flex h-14 w-14 rotate-[8deg] items-center justify-center rounded-2xl border border-gray-100 bg-white text-xl font-bold text-saffron shadow-md">
            AI
          </div>
        </div>
      </div>
    </div>
  );
}
