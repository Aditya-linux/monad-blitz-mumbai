import { Star, Bot, User } from 'lucide-react';
import type { Agent } from '@/lib/store';

export default function AgentCard({ agent, onHire }: { agent: Agent, onHire?: (agent: Agent) => void }) {
  const isAI = agent.agentType === 'ai';
  
  return (
    <div className="bg-paper-card border border-line rounded-2xl p-6 sm:p-7 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden flex flex-col h-full">
      {/* AI/Human Badge */}
      <div className={`absolute top-0 right-0 px-4 py-2 rounded-bl-2xl text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5 ${
        isAI 
          ? 'bg-indigo/10 text-indigo border-b border-l border-indigo/20' 
          : 'bg-mint-soft text-mint border-b border-l border-mint/20'
      }`}>
        {isAI ? <Bot className="w-3.5 h-3.5" /> : <User className="w-3.5 h-3.5" />}
        {isAI ? 'AI Agent' : 'Human'}
      </div>

      <div className="flex justify-between items-start mb-5 pr-20">
        <h3 className="font-display font-bold text-xl text-ink leading-tight">{agent.name}</h3>
        <div className="flex items-center gap-1.5 bg-saffron-soft text-saffron-deep px-2.5 py-1 rounded text-sm font-semibold">
          <Star className="w-3.5 h-3.5 fill-current" />
          {agent.reputationScore}
        </div>
      </div>
      
      <p className="text-[15px] leading-relaxed text-ink-soft mb-6 line-clamp-3">{agent.description}</p>
      
      {/* Autonomous badge for AI agents */}
      {isAI && agent.autonomousMode && (
        <div className="flex items-center gap-2 mb-6 text-xs font-medium text-indigo bg-indigo/5 px-3 py-2 rounded-lg border border-indigo/10 w-fit">
          <span className="w-1.5 h-1.5 rounded-full bg-indigo animate-pulse"></span>
          Autonomous — Completes tasks without human input
        </div>
      )}

      <div className="flex flex-wrap gap-2 mb-8">
        {agent.capabilities.map((cap) => (
          <span key={cap} className="px-2.5 py-1.5 bg-paper text-ink-soft text-xs font-medium rounded-md border border-line">
            {cap}
          </span>
        ))}
      </div>
      
      <div className="flex items-center justify-between mt-auto pt-5 border-t border-line/60">
        <div>
          <div className="text-[11px] font-semibold text-ink-soft uppercase tracking-widest mb-1.5">Starting at</div>
          <div className="font-mono font-bold text-ink text-lg">₹{agent.priceInr} <span className="text-sm font-medium text-ink-soft">({agent.priceUsdc} USDC)</span></div>
        </div>
        
        <button 
          onClick={() => onHire && onHire(agent)}
          className="px-6 py-2.5 bg-indigo text-white rounded-xl text-sm font-bold hover:bg-indigo-deep transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5"
        >
          Hire Agent
        </button>
      </div>
    </div>
  );
}
