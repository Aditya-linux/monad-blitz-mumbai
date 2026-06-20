'use client';
import { useState, useEffect, useRef } from 'react';
import { useAppStore, Agent } from '@/lib/store';
import { Play, Square, Zap, Clock, ExternalLink, ArrowLeft, ChevronDown } from 'lucide-react';
import Link from 'next/link';

function LiveStreamCounter({ stream }: { stream: any }) {
  const [elapsed, setElapsed] = useState(0);
  const { updateStreamTotal, priceInrToUsdc } = useAppStore();
  
  useEffect(() => {
    if (!stream.isActive) return;
    
    const startTime = new Date(stream.startedAt).getTime();
    
    const interval = setInterval(() => {
      const now = Date.now();
      const seconds = (now - startTime) / 1000;
      // Calculate based on INR directly
      const ratePerSecondInr = stream.monthlyInr / (30 * 24 * 60 * 60);
      const streamedInr = parseFloat((seconds * ratePerSecondInr).toFixed(6));
      setElapsed(streamedInr);
      // We still update the USDC total for the backend tracking
      updateStreamTotal(stream.id, parseFloat((seconds * stream.ratePerSecondUsdc).toFixed(8)));
    }, 50); // Update faster for smooth UI
    
    return () => clearInterval(interval);
  }, [stream.isActive, stream.startedAt, stream.ratePerSecondUsdc, stream.monthlyInr, stream.id, updateStreamTotal]);

  const displayed = stream.isActive ? elapsed : stream.totalStreamed * (priceInrToUsdc || 83);

  return (
    <span className="font-mono tabular-nums text-3xl font-bold text-mint tracking-tight">
      ₹{displayed.toFixed(6)}
    </span>
  );
}

export default function SubscriptionsPage() {
  const { agents, streams, startStream, stopStream } = useAppStore();
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [title, setTitle] = useState('');
  const [monthlyInr, setMonthlyInr] = useState(5000);
  const [starting, setStarting] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  // Close dropdown when clicking outside
  const dropdownRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const monthlyUsdc = parseFloat((monthlyInr / 83).toFixed(2));
  const ratePerSecond = (monthlyUsdc / (30 * 24 * 60 * 60));

  const handleStart = () => {
    if (!selectedAgent || !title) return;
    setStarting(true);
    setTimeout(() => {
      startStream(selectedAgent.id, title, monthlyInr, monthlyUsdc);
      setStarting(false);
      setSelectedAgent(null);
      setTitle('');
    }, 1500);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <Link href="/app" className="flex items-center gap-2 text-ink-soft hover:text-indigo mb-6 transition-colors text-sm font-medium w-max">
        <ArrowLeft className="w-4 h-4" /> Back to Dashboard
      </Link>

      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold text-ink mb-2">
          Subscription Streams
        </h1>
        <p className="text-ink-soft">Pay-as-you-go retainer escrows that stream USDC every second via Monad smart contracts.</p>
      </div>

      {/* Create New Stream */}
      <div className="bg-paper-card border border-line rounded-xl p-6 mb-8">
        <h2 className="font-bold text-ink text-lg mb-4">Start a New Stream</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-xs uppercase tracking-wider text-ink-soft font-bold mb-2">Select Agent</label>
            <div className="relative" ref={dropdownRef}>
              <div 
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className={`w-full p-3.5 pr-10 border rounded-xl bg-white text-sm cursor-pointer text-ink font-medium shadow-sm transition-all flex items-center justify-between ${isDropdownOpen ? 'border-indigo ring-2 ring-indigo/20' : 'border-line hover:border-indigo/50'}`}
              >
                <span className={selectedAgent ? 'text-ink' : 'text-ink-soft'}>
                  {selectedAgent ? `${selectedAgent.name} — ${selectedAgent.category}` : 'Choose an agent...'}
                </span>
                <ChevronDown className={`w-4 h-4 text-ink-soft absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
              </div>
              
              {isDropdownOpen && (
                <div className="absolute z-20 w-full mt-2 bg-white border border-line rounded-xl shadow-lg overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="max-h-60 overflow-y-auto">
                    {agents.map(a => (
                      <div 
                        key={a.id} 
                        onClick={() => {
                          setSelectedAgent(a);
                          setIsDropdownOpen(false);
                        }}
                        className={`p-3.5 text-sm cursor-pointer transition-colors border-b border-line/50 last:border-0 ${selectedAgent?.id === a.id ? 'bg-indigo/5 text-indigo font-semibold' : 'hover:bg-paper text-ink'}`}
                      >
                        {a.name} <span className={`ml-1 ${selectedAgent?.id === a.id ? 'text-indigo/70' : 'text-ink-soft'}`}>— {a.category}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
          <div>
            <label className="block text-xs uppercase tracking-wider text-ink-soft font-bold mb-2">Task Description</label>
            <input 
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Monthly social media management"
              className="w-full p-3.5 border border-line rounded-xl bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo/20 focus:border-indigo text-ink font-medium shadow-sm transition-all"
            />
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-xs uppercase tracking-wider text-ink-soft font-bold mb-2">Monthly Budget (INR)</label>
          <div className="flex items-center gap-4">
            <input 
              type="range" min={500} max={50000} step={500}
              value={monthlyInr}
              onChange={(e) => setMonthlyInr(Number(e.target.value))}
              className="flex-1 accent-indigo"
            />
            <div className="text-right min-w-[140px]">
              <p className="text-xl font-mono font-bold text-ink">₹{monthlyInr.toLocaleString()}</p>
              <p className="text-xs text-ink-soft font-mono">{monthlyUsdc} USDC/month</p>
              <p className="text-[10px] text-indigo font-mono">{ratePerSecond.toFixed(8)} USDC/sec</p>
            </div>
          </div>
        </div>

        <button
          onClick={handleStart}
          disabled={starting || !selectedAgent || !title}
          className="w-full py-3 bg-indigo text-white rounded-lg font-bold hover:bg-indigo-deep transition-colors disabled:opacity-40 flex items-center justify-center gap-2"
        >
          {starting ? (
            <><div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" /> Deploying Stream Contract on Monad...</>
          ) : (
            <><Play className="w-5 h-5" /> Start Streaming Escrow</>
          )}
        </button>
      </div>

      {/* Active Streams */}
      <h2 className="font-bold text-ink text-lg mb-4">Active & Past Streams</h2>
      
      {streams.length === 0 ? (
        <div className="p-12 text-center bg-paper-card border border-line rounded-xl border-dashed">
          <p className="text-ink-soft text-sm mt-2">No subscription streams yet. Start one above to see real-time USDC streaming.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {streams.map(stream => {
            const agent = agents.find(a => a.id === stream.agentId);
            return (
              <div key={stream.id} className={`bg-paper-card border rounded-xl p-6 transition-all ${stream.isActive ? 'border-indigo/30 shadow-md' : 'border-line opacity-70'}`}>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      {stream.isActive && <span className="w-2 h-2 rounded-full bg-mint animate-pulse" />}
                      <h3 className="font-bold text-ink">{stream.title}</h3>
                      <span className={`text-[10px] uppercase tracking-widest font-bold px-2 py-0.5 rounded ${stream.isActive ? 'bg-mint-soft text-mint' : 'bg-line text-ink-soft'}`}>
                        {stream.isActive ? 'LIVE' : 'STOPPED'}
                      </span>
                    </div>
                    <p className="text-xs text-ink-soft">
                      Agent: <span className="font-medium">{agent?.name}</span> • Rate: <span className="font-mono">{stream.ratePerSecondUsdc.toFixed(8)} USDC/sec</span>
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <a 
                      href={`https://testnet.monadexplorer.com/tx/${stream.txHash}`}
                      target="_blank" rel="noopener noreferrer"
                      className="p-2 border border-line rounded-lg hover:border-indigo text-ink-soft hover:text-indigo transition-colors"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                    {stream.isActive && (
                      <button
                        onClick={() => stopStream(stream.id)}
                        className="px-4 py-2 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm font-bold hover:bg-red-100 transition-colors flex items-center gap-1.5"
                      >
                        <Square className="w-3.5 h-3.5" /> Stop Stream
                      </button>
                    )}
                  </div>
                </div>

                {/* Live Counter */}
                <div className="bg-paper border border-line rounded-xl p-6 text-center">
                  <p className="text-xs text-ink-soft uppercase tracking-widest font-bold mb-2">Total Streamed to Agent</p>
                  <LiveStreamCounter stream={stream} />
                  <p className="text-xs text-ink-soft mt-2 font-mono">
                    of {stream.monthlyUsdc} USDC/month (₹{stream.monthlyInr.toLocaleString()})
                  </p>
                  
                  {/* Visual streaming bar */}
                  {stream.isActive && (
                    <div className="mt-4 h-2 bg-line rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-indigo to-mint rounded-full transition-all duration-100 animate-pulse"
                        style={{ width: `${Math.min(100, ((stream.totalStreamed || 0) / stream.monthlyUsdc) * 100)}%` }}
                      />
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
