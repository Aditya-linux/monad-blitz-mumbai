'use client';
import { useAppStore } from '@/lib/store';
import StatCard from '@/components/StatCard';
import Link from 'next/link';
import { ArrowRight, Plus } from 'lucide-react';

export default function HirerDashboard() {
  const { tasks } = useAppStore();
  
  const activeTasks = tasks.filter(t => ['escrowed', 'in_progress', 'delivered'].includes(t.status));
  const completedTasks = tasks.filter(t => t.status === 'completed');
  const spentUsdc = completedTasks.reduce((sum, task) => sum + task.budgetUsdc, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="font-display font-bold text-3xl text-ink mb-1">Hirer Dashboard</h1>
          <p className="text-ink-soft">Manage your AI agents and active tasks.</p>
        </div>
        
        <Link 
          href="/app/marketplace"
          className="flex items-center gap-2 px-4 py-2 bg-indigo text-white rounded-lg text-sm font-medium hover:bg-indigo-deep transition-colors"
        >
          <Plus className="w-4 h-4" /> Hire New Agent
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <StatCard 
          title="Total Spent" 
          value={`$${spentUsdc.toFixed(2)}`} 
          subtitle="USDC Escrowed & Paid" 
          highlight 
        />
        <StatCard 
          title="Active Tasks" 
          value={activeTasks.length} 
          subtitle="Currently in progress or delivered" 
        />
        <StatCard 
          title="Tasks Completed" 
          value={completedTasks.length} 
          subtitle="Lifetime" 
        />
      </div>

      <div className="bg-paper-card border border-line rounded-xl overflow-hidden">
        <div className="p-5 border-b border-line flex justify-between items-center">
          <h2 className="font-display font-bold text-lg text-ink">Active Deliverables</h2>
          <Link href="/app/tasks" className="text-sm font-medium text-indigo hover:text-indigo-deep flex items-center gap-1">
            View all <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        
        {activeTasks.length === 0 ? (
          <div className="p-12 text-center">
            <h3 className="text-lg font-medium text-ink mb-2">No active tasks</h3>
            <p className="text-ink-soft mb-6">You don't have any agents working for you right now.</p>
            <Link 
              href="/app/marketplace"
              className="px-6 py-2 bg-paper border border-line rounded-lg text-sm font-medium hover:bg-indigo-soft hover:text-indigo transition-colors"
            >
              Browse Marketplace
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-line">
            {activeTasks.map(task => (
              <div key={task.id} className="p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 hover:bg-paper/30 transition-colors">
                <div>
                  <h4 className="font-medium text-ink text-lg">{task.title}</h4>
                  <p className="text-sm text-ink-soft mt-1">Status: <span className="font-mono text-saffron-deep bg-saffron-soft px-1.5 py-0.5 rounded text-xs">{task.status.toUpperCase()}</span></p>
                </div>
                
                <div className="flex items-center gap-3 w-full md:w-auto">
                  <div className="text-right hidden md:block">
                    <div className="font-mono font-medium">₹{task.budgetInr}</div>
                    <div className="text-xs text-ink-soft">{task.budgetUsdc} USDC</div>
                  </div>
                  <Link 
                    href={`/app/tasks/${task.id}`} 
                    className="w-full md:w-auto text-center px-4 py-2 bg-paper border border-line rounded text-sm font-medium hover:bg-indigo-soft hover:text-indigo transition-colors"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
