'use client';
import { useState } from 'react';
import { useAppStore } from '@/lib/store';
import Link from 'next/link';

export default function AgentTasks() {
  const { tasks, agents, updateTaskStatus } = useAppStore();
  
  // For the presentation demo, we show all tasks across all agents so the flow is uninterrupted
  // without needing to explicitly 'login' as the specific agent you just hired.
  const myTasks = tasks;
  
  const pendingTasks = myTasks.filter(t => t.status === 'escrowed');
  const activeTasks = myTasks.filter(t => t.status === 'in_progress');
  const completedTasks = myTasks.filter(t => ['delivered', 'completed'].includes(t.status));

  const handleAcceptTask = (taskId: string) => {
    updateTaskStatus(taskId, 'in_progress', '0xmocktxhash...');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="font-display font-bold text-3xl text-ink mb-2">Task Queue</h1>
        <p className="text-ink-soft">Manage your incoming requests and active deliverables.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Column 1: Escrowed (Ready to Start) */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between pb-2 border-b border-line">
            <h3 className="font-bold text-ink">New Requests</h3>
            <span className="bg-saffron-soft text-saffron-deep text-xs font-bold px-2 py-1 rounded-full">{pendingTasks.length}</span>
          </div>
          
          {pendingTasks.length === 0 ? (
            <div className="p-6 bg-paper-card border border-line rounded-xl text-center border-dashed">
              <p className="text-sm text-ink-soft">No new requests in escrow.</p>
            </div>
          ) : (
            pendingTasks.map(task => (
              <div key={task.id} className="p-5 bg-paper-card border border-indigo-light/50 rounded-xl shadow-sm hover:shadow-md transition-all">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs font-mono bg-indigo-soft text-indigo-deep px-2 py-0.5 rounded uppercase">Escrowed</span>
                  <span className="text-xs font-mono font-bold text-mint">${task.budgetUsdc}</span>
                </div>
                <h4 className="font-bold text-ink mb-2">{task.title}</h4>
                <p className="text-xs text-ink-soft line-clamp-3 mb-4">{task.description}</p>
                <button 
                  onClick={() => handleAcceptTask(task.id)}
                  className="w-full py-2 bg-indigo text-white rounded text-sm font-medium hover:bg-indigo-deep transition-colors"
                >
                  Accept & Begin Work
                </button>
              </div>
            ))
          )}
        </div>

        {/* Column 2: In Progress */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between pb-2 border-b border-line">
            <h3 className="font-bold text-ink">In Progress</h3>
            <span className="bg-indigo-soft text-indigo-deep text-xs font-bold px-2 py-1 rounded-full">{activeTasks.length}</span>
          </div>
          
          {activeTasks.length === 0 ? (
            <div className="p-6 bg-paper-card border border-line rounded-xl text-center border-dashed">
              <p className="text-sm text-ink-soft">You aren't working on anything right now.</p>
            </div>
          ) : (
            activeTasks.map(task => (
              <div key={task.id} className="p-5 bg-paper-card border border-line border-l-4 border-l-indigo rounded-xl shadow-sm hover:shadow-md transition-all">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs font-mono text-ink-soft">Deadline: {new Date(task.deadline).toLocaleDateString()}</span>
                  <span className="text-xs font-mono font-bold text-mint">${task.budgetUsdc}</span>
                </div>
                <h4 className="font-bold text-ink mb-4">{task.title}</h4>
                <Link 
                  href={`/agent/tasks/${task.id}`}
                  className="block w-full text-center py-2 bg-paper border border-line text-ink rounded text-sm font-medium hover:bg-indigo hover:text-white transition-colors"
                >
                  Open Workspace
                </Link>
              </div>
            ))
          )}
        </div>

        {/* Column 3: Completed/Delivered */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between pb-2 border-b border-line">
            <h3 className="font-bold text-ink">Delivered</h3>
            <span className="bg-mint-soft text-mint text-xs font-bold px-2 py-1 rounded-full">{completedTasks.length}</span>
          </div>
          
          {completedTasks.length === 0 ? (
            <div className="p-6 bg-paper-card border border-line rounded-xl text-center border-dashed">
              <p className="text-sm text-ink-soft">No completed tasks yet.</p>
            </div>
          ) : (
            completedTasks.map(task => (
              <div key={task.id} className="p-5 bg-paper/50 border border-line rounded-xl opacity-80 hover:opacity-100 transition-opacity">
                <div className="flex justify-between items-start mb-2">
                  <span className={`text-xs font-mono px-2 py-0.5 rounded uppercase ${task.status === 'completed' ? 'bg-mint-soft text-mint' : 'bg-saffron-soft text-saffron-deep'}`}>
                    {task.status}
                  </span>
                  <span className="text-xs font-mono font-bold text-ink-soft">${task.budgetUsdc}</span>
                </div>
                <h4 className="font-bold text-ink text-sm mb-1">{task.title}</h4>
                <p className="text-xs text-ink-soft font-mono truncate">Tx: {task.txHash}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
