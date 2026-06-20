'use client';
import { useState } from 'react';
import { useAppStore } from '@/lib/store';
import Link from 'next/link';
import { CheckCircle2, Clock, Play, FileText, Search, AlertCircle } from 'lucide-react';

export default function HirerTasks() {
  const { tasks } = useAppStore();
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'pending': return 'bg-line text-ink-soft';
      case 'paid': return 'bg-saffron-soft text-saffron-deep';
      case 'escrowed': return 'bg-indigo-soft text-indigo-deep';
      case 'in_progress': return 'bg-indigo text-white';
      case 'delivered': return 'bg-mint-soft text-mint';
      case 'completed': return 'bg-mint text-white';
      case 'disputed': return 'bg-red-100 text-red-600';
      default: return 'bg-paper text-ink';
    }
  };

  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'completed': return <CheckCircle2 className="w-4 h-4" />;
      case 'in_progress': return <Play className="w-4 h-4" />;
      case 'disputed': return <AlertCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const filteredTasks = tasks.filter(t => {
    if (filter === 'active') return ['pending', 'paid', 'escrowed', 'in_progress', 'delivered'].includes(t.status);
    if (filter === 'completed') return t.status === 'completed';
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="font-display font-bold text-3xl text-ink mb-1">My Tasks</h1>
          <p className="text-ink-soft">Track the progress of your agent deliverables.</p>
        </div>
        
        <div className="flex gap-2 bg-paper-card border border-line p-1 rounded-lg">
          {(['all', 'active', 'completed'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-1.5 text-sm font-medium rounded-md capitalize transition-colors ${filter === f ? 'bg-indigo text-white' : 'text-ink-soft hover:text-ink'}`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-paper-card border border-line rounded-xl overflow-hidden">
        {filteredTasks.length === 0 ? (
          <div className="p-16 text-center">
            <FileText className="w-12 h-12 text-line mx-auto mb-4" />
            <h3 className="text-xl font-medium text-ink mb-2">No tasks found</h3>
            <p className="text-ink-soft mb-6">You don't have any tasks matching this filter.</p>
            <Link 
              href="/app/marketplace"
              className="px-6 py-2 bg-indigo text-white rounded-lg text-sm font-medium hover:bg-indigo-deep transition-colors"
            >
              Hire an Agent
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-line">
            {filteredTasks.map(task => (
              <div key={task.id} className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:bg-paper/30 transition-colors">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium uppercase tracking-wider ${getStatusColor(task.status)}`}>
                      {getStatusIcon(task.status)} {task.status.replace('_', ' ')}
                    </span>
                    <span className="text-xs text-ink-soft font-mono">ID: {task.id.split('-')[1]}</span>
                  </div>
                  <h3 className="text-lg font-bold text-ink mb-1">{task.title}</h3>
                  <p className="text-sm text-ink-soft line-clamp-2 max-w-3xl">{task.description}</p>
                </div>
                
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <div className="text-xs text-ink-soft mb-1 uppercase tracking-wider">Budget</div>
                    <div className="font-mono font-medium text-ink">₹{task.budgetInr}</div>
                    <div className="text-xs text-indigo-light font-mono">{task.budgetUsdc} USDC</div>
                  </div>
                  
                  <Link 
                    href={`/app/tasks/${task.id}`}
                    className="px-5 py-2.5 bg-paper border border-line rounded-lg text-sm font-medium hover:bg-indigo hover:text-white transition-colors hover:border-indigo"
                  >
                    Manage
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
