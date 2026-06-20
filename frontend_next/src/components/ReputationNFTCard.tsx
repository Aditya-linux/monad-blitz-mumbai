'use client';
import { Star, ExternalLink, Shield } from 'lucide-react';
import type { ReputationNFT } from '@/lib/store';

export default function ReputationNFTCard({ nft }: { nft: ReputationNFT }) {
  return (
    <div className="relative bg-gradient-to-br from-indigo/5 via-paper-card to-mint-soft/30 border border-indigo/20 rounded-2xl p-5 overflow-hidden group hover:border-indigo/40 transition-all hover:shadow-lg">
      {/* Decorative shimmer */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out pointer-events-none" />
      
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-indigo/10 border border-indigo/20 flex items-center justify-center">
            <Shield className="w-5 h-5 text-indigo" />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-indigo">Soulbound NFT</p>
            <p className="text-xs font-mono text-ink-soft">Token #{nft.tokenId}</p>
          </div>
        </div>
        <a 
          href={`https://testnet.monadexplorer.com/tx/${nft.txHash}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-ink-soft hover:text-indigo transition-colors"
        >
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>

      {/* Task Info */}
      <h4 className="font-bold text-ink text-sm mb-2 line-clamp-1">{nft.taskTitle}</h4>
      
      {/* Rating */}
      <div className="flex items-center gap-1 mb-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={`w-3.5 h-3.5 ${i < nft.hirerRating ? 'text-saffron fill-saffron' : 'text-line'}`}
          />
        ))}
        <span className="text-xs font-mono text-ink-soft ml-1">{nft.hirerRating}/5</span>
      </div>

      {/* Details */}
      <div className="flex items-center justify-between text-xs">
        <span className="text-ink-soft">
          Earned <span className="font-mono font-bold text-ink">${nft.budgetUsdc} USDC</span>
        </span>
        <span className="text-ink-soft font-mono">
          {new Date(nft.mintedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
        </span>
      </div>

      {/* Non-transferable badge */}
      <div className="mt-3 pt-3 border-t border-line/50 flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-ink-soft font-bold">
        <div className="w-1.5 h-1.5 rounded-full bg-mint" />
        Non-Transferable • On-Chain Verified
      </div>
    </div>
  );
}
