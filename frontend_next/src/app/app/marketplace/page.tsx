'use client';
import { useState } from 'react';
import { Search, Bot, User, LayoutGrid } from 'lucide-react';
import { useAppStore, Agent, AgentType } from '@/lib/store';
import AgentCard from '@/components/AgentCard';
import PaymentModal from '@/components/PaymentModal';

type FilterType = 'all' | AgentType;

export default function Marketplace() {
  const { agents } = useAppStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [typeFilter, setTypeFilter] = useState<FilterType>('all');
  
  const filteredAgents = agents.filter(agent => {
    const matchesSearch = 
      agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agent.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agent.capabilities.some(cap => cap.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesType = typeFilter === 'all' || agent.agentType === typeFilter;
    
    return matchesSearch && matchesType;
  });

  const aiCount = agents.filter(a => a.agentType === 'ai').length;
  const humanCount = agents.filter(a => a.agentType === 'human').length;

  const filterButtons: { label: string; value: FilterType; icon: React.ReactNode; count: number }[] = [
    { label: 'All Agents', value: 'all', icon: <LayoutGrid className="w-3.5 h-3.5" />, count: agents.length },
    { label: 'AI Agents', value: 'ai', icon: <Bot className="w-3.5 h-3.5" />, count: aiCount },
    { label: 'Human', value: 'human', icon: <User className="w-3.5 h-3.5" />, count: humanCount },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="font-display font-bold text-3xl text-ink mb-2">Agent Marketplace</h1>
          <p className="text-ink-soft">Browse and hire autonomous AI agents or skilled humans for your next task.</p>
        </div>
        
        <div className="relative w-full md:w-64">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-ink-soft" />
          <input 
            type="text" 
            placeholder="Search skills, names..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-line rounded-lg bg-paper-card text-sm focus:outline-none focus:border-indigo"
          />
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-8">
        {filterButtons.map(btn => (
          <button
            key={btn.value}
            onClick={() => setTypeFilter(btn.value)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all border ${
              typeFilter === btn.value
                ? 'bg-indigo text-white border-indigo shadow-sm'
                : 'bg-paper-card text-ink-soft border-line hover:border-indigo/30 hover:text-ink'
            }`}
          >
            {btn.icon}
            {btn.label}
            <span className={`ml-1 text-xs px-1.5 py-0.5 rounded-full ${
              typeFilter === btn.value ? 'bg-white/20' : 'bg-line'
            }`}>{btn.count}</span>
          </button>
        ))}
      </div>
      
      {filteredAgents.length === 0 ? (
        <div className="text-center py-20 bg-paper-card border border-line rounded-xl border-dashed">
          <h3 className="text-lg font-medium text-ink mb-2">No agents found</h3>
          <p className="text-sm text-ink-soft">Try adjusting your search terms or filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAgents.map(agent => (
            <AgentCard key={agent.id} agent={agent} onHire={setSelectedAgent} />
          ))}
        </div>
      )}

      {selectedAgent && (
        <PaymentModal 
          agentId={selectedAgent.id}
          priceInr={selectedAgent.priceInr}
          priceUsdc={selectedAgent.priceUsdc}
          onClose={() => setSelectedAgent(null)}
        />
      )}
    </div>
  );
}
