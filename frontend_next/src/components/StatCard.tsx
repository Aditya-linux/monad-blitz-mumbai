import React from 'react';

export default function StatCard({ title, value, subtitle, highlight = false }: { title: string, value: string | number, subtitle?: string, highlight?: boolean }) {
  return (
    <div className={`p-5 rounded-xl border ${highlight ? 'bg-indigo text-white border-indigo-deep' : 'bg-paper-card border-line'} shadow-sm`}>
      <h4 className={`text-sm font-medium mb-2 ${highlight ? 'text-indigo-soft' : 'text-ink-soft'}`}>{title}</h4>
      <div className="font-mono text-3xl font-bold mb-1">{value}</div>
      {subtitle && <p className={`text-xs ${highlight ? 'text-indigo-light' : 'text-ink-soft'}`}>{subtitle}</p>}
    </div>
  );
}
