'use client';
import { useAppStore } from '@/lib/store';
import StatCard from '@/components/StatCard';
import { ShieldAlert, Activity, CheckCircle, Search } from 'lucide-react';
import Link from 'next/link';

export default function AdminDashboard() {
  const { tasks } = useAppStore();
  
  const totalVolume = tasks.reduce((sum, task) => sum + task.budgetUsdc, 0);
  const activeTasks = tasks.filter(t => ['escrowed', 'in_progress', 'delivered'].includes(t.status));
  const disputedTasks = tasks.filter(t => t.status === 'disputed');

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="font-display font-bold text-3xl text-ink mb-2">Admin Console</h1>
        <p className="text-ink-soft">Platform overview and dispute resolution.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <StatCard 
          title="Total TVL (Escrow)" 
          value={`$${totalVolume.toFixed(2)}`} 
          subtitle="USDC currently locked" 
          highlight 
        />
        <StatCard 
          title="Active Contracts" 
          value={activeTasks.length} 
          subtitle="Across all agents" 
        />
        <div className="bg-red-50 border border-red-200 rounded-xl p-5">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-medium text-red-800">Active Disputes</h3>
            <ShieldAlert className="w-5 h-5 text-red-500" />
          </div>
          <p className="font-display font-bold text-3xl text-red-900">{disputedTasks.length}</p>
          <p className="text-xs text-red-600 mt-2">Requires immediate attention</p>
        </div>
        <StatCard 
          title="Completed" 
          value={tasks.filter(t => t.status === 'completed').length} 
          subtitle="Successfully delivered" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-paper-card border border-line rounded-xl overflow-hidden">
            <div className="p-5 border-b border-line flex justify-between items-center">
              <h2 className="font-bold text-ink">Recent Transactions (Ledger)</h2>
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-ink-soft" />
                <input 
                  type="text" 
                  placeholder="TxHash or ID..."
                  className="pl-9 pr-4 py-1.5 border border-line rounded-lg bg-paper text-sm focus:outline-none focus:border-indigo"
                />
              </div>
            </div>
            
            <div className="divide-y divide-line">
              {tasks.slice(0, 5).map(task => (
                <div key={task.id} className="p-4 flex items-center justify-between hover:bg-paper/50">
                  <div className="flex items-center gap-4">
                    <Activity className={`w-5 h-5 ${task.status === 'completed' ? 'text-mint' : 'text-indigo'}`} />
                    <div>
                      <p className="text-sm font-medium text-ink">Contract: {task.id.split('-')[1]}</p>
                      <p className="text-xs text-ink-soft font-mono truncate w-32 md:w-64">{task.txHash || 'Pending...'}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold font-mono text-ink">${task.budgetUsdc}</p>
                    <span className="text-[10px] uppercase tracking-wider font-medium px-1.5 py-0.5 rounded bg-line text-ink-soft">
                      {task.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div>
          <div className="bg-paper-card border border-line rounded-xl overflow-hidden">
            <div className="p-5 border-b border-line">
              <h2 className="font-bold text-ink">Dispute Queue</h2>
            </div>
            {disputedTasks.length === 0 ? (
              <div className="p-8 text-center">
                <CheckCircle className="w-10 h-10 text-mint mx-auto mb-3 opacity-50" />
                <p className="text-sm text-ink-soft">No active disputes.</p>
              </div>
            ) : (
              <div className="divide-y divide-line">
                {disputedTasks.map(task => (
                  <div key={task.id} className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <p className="text-sm font-bold text-ink">{task.title}</p>
                      <p className="text-xs font-mono font-bold text-red-600">${task.budgetUsdc}</p>
                    </div>
                    <p className="text-xs text-ink-soft mb-3 line-clamp-2">Agent ID: {task.agentId}</p>
                    <div className="flex gap-2">
                      <button className="flex-1 py-1.5 bg-mint/10 text-mint hover:bg-mint hover:text-white rounded text-xs font-medium transition-colors">
                        Refund Hirer
                      </button>
                      <button className="flex-1 py-1.5 bg-indigo/10 text-indigo hover:bg-indigo hover:text-white rounded text-xs font-medium transition-colors">
                        Pay Agent
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
