'use client';
import { useState, useEffect } from 'react';
import { useAppStore } from '@/lib/store';

export default function PriceTicker() {
  const { priceInrToUsdc } = useAppStore();
  const [livePrice, setLivePrice] = useState(priceInrToUsdc);

  useEffect(() => {
    // Simulate a live price ticker with a random walk
    const interval = setInterval(() => {
      setLivePrice((prev) => {
        const change = (Math.random() - 0.5) * 0.1;
        return Number((prev + change).toFixed(2));
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center gap-2 px-3 py-1 bg-indigo-soft text-indigo-deep font-mono text-sm rounded-full">
      <span className="w-2 h-2 rounded-full bg-mint animate-pulse"></span>
      USDC/INR: ₹{livePrice}
    </div>
  );
}
