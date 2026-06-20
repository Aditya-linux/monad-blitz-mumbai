'use client';
import { useAppStore } from '@/lib/store';
import StatCard from '@/components/StatCard';
import ReputationNFTCard from '@/components/ReputationNFTCard';
import Link from 'next/link';
import { ArrowRight, Wallet, Shield, Bot } from 'lucide-react';

export default function AgentDashboard() {
  const { walletAddress, agents, tasks, reputationNFTs } = useAppStore();
  
  // For the demo, automatically act as the agent from the most recent task
  const latestTask = tasks.length > 0 ? tasks[tasks.length - 1] : null;
  const currentAgent = latestTask ? agents.find(a => a.id === latestTask.agentId) || agents[0] : agents[0];
  
  const agentTasks = tasks.filter(t => t.agentId === currentAgent?.id);
  const activeTasks = agentTasks.filter(t => ['escrowed', 'in_progress'].includes(t.status));
  const completedTasks = agentTasks.filter(t => t.status === 'completed');
  const agentNFTs = reputationNFTs.filter(nft => nft.agentId === currentAgent?.id);
  
  const earnings = completedTasks.reduce((sum, task) => sum + task.budgetUsdc, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="font-display font-bold text-3xl text-ink">Agent Workspace</h1>
            {currentAgent?.agentType === 'ai' && (
              <span className="px-2 py-0.5 bg-indigo/10 text-indigo border border-indigo/20 rounded text-[10px] font-bold uppercase tracking-widest flex items-center gap-1">
                <Bot className="w-3 h-3" /> AI Agent
              </span>
            )}
          </div>
          <p className="text-ink-soft">Welcome back, {currentAgent?.name || 'Agent'}</p>
        </div>
        
        {!walletAddress ? (
          <div className="flex items-center gap-3 px-4 py-3 bg-saffron-soft border border-saffron/30 rounded-lg text-saffron-deep text-sm font-medium">
            <Wallet className="w-5 h-5" />
            Connect your wallet to receive x-402 payouts
          </div>
        ) : (
          <div className="flex items-center gap-3 px-4 py-2 bg-mint-soft border border-mint/30 rounded-lg text-mint text-sm font-mono font-medium">
            <div className="w-2 h-2 rounded-full bg-mint"></div>
            Connected: {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard 
          title="Total Earnings" 
          value={`$${earnings.toFixed(2)}`} 
          subtitle="USDC" 
          highlight 
        />
        <StatCard 
          title="Reputation Score" 
          value={currentAgent?.reputationScore || 0} 
          subtitle="Based on verified reviews" 
        />
        <StatCard 
          title="Active Tasks" 
          value={activeTasks.length} 
          subtitle="In your queue" 
        />
        <StatCard 
          title="Soulbound NFTs" 
          value={agentNFTs.length} 
          subtitle="On-chain reputation tokens" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-display font-bold text-xl text-ink">Action Required</h2>
            <Link href="/agent/tasks" className="text-sm font-medium text-indigo hover:text-indigo-deep flex items-center gap-1">
              View all tasks <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          
          <div className="bg-paper-card border border-line rounded-xl overflow-hidden mb-8">
            {activeTasks.length === 0 ? (
              <div className="p-8 text-center text-ink-soft">
                <p>No active tasks require your attention right now.</p>
              </div>
            ) : (
              <div className="divide-y divide-line">
                {activeTasks.slice(0, 3).map(task => (
                  <div key={task.id} className="p-4 flex items-center justify-between hover:bg-paper/50 transition-colors">
                    <div>
                      <h4 className="font-medium text-ink">{task.title}</h4>
                      <p className="text-xs text-ink-soft mt-1">Status: <span className="font-mono text-indigo">{task.status}</span></p>
                    </div>
                    <Link href={`/agent/tasks/${task.id}`} className="px-4 py-2 bg-paper border border-line rounded text-sm font-medium hover:bg-indigo-soft hover:text-indigo transition-colors">
                      Open Workspace
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Reputation NFT Gallery */}
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-display font-bold text-xl text-ink flex items-center gap-2">
              <Shield className="w-5 h-5 text-indigo" />
              On-Chain Reputation
            </h2>
            <span className="text-xs font-mono text-ink-soft bg-paper border border-line px-2 py-1 rounded">{agentNFTs.length} NFTs Minted</span>
          </div>
          
          {agentNFTs.length === 0 ? (
            <div className="p-8 text-center bg-paper-card border border-line rounded-xl">
              <Shield className="w-10 h-10 text-line mx-auto mb-3" />
              <p className="text-ink-soft text-sm">No reputation NFTs yet. Complete tasks to earn Soulbound tokens.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {agentNFTs.map(nft => (
                <ReputationNFTCard key={nft.id} nft={nft} />
              ))}
            </div>
          )}
        </div>
        
        <div>
          <h2 className="font-display font-bold text-xl text-ink mb-4">Quick Links</h2>
          <div className="flex flex-col gap-3">
            <Link href="/agent/tasks" className="p-4 bg-paper-card border border-line rounded-xl hover:border-indigo transition-colors flex justify-between items-center group">
              <div>
                <h4 className="font-medium text-ink group-hover:text-indigo transition-colors">Task Queue</h4>
                <p className="text-xs text-ink-soft mt-1">View and accept new tasks</p>
              </div>
              <ArrowRight className="w-5 h-5 text-ink-soft group-hover:text-indigo transition-colors" />
            </Link>
            <Link href="/agent/earnings" className="p-4 bg-paper-card border border-line rounded-xl hover:border-indigo transition-colors flex justify-between items-center group">
              <div>
                <h4 className="font-medium text-ink group-hover:text-indigo transition-colors">Payout History</h4>
                <p className="text-xs text-ink-soft mt-1">View USDC and INR settlements</p>
              </div>
              <ArrowRight className="w-5 h-5 text-ink-soft group-hover:text-indigo transition-colors" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
