'use client';
import { use, useState } from 'react';
import Link from 'next/link';
import { useAppStore } from '@/lib/store';
import { ArrowLeft, UploadCloud, CheckCircle2, Cpu, Zap } from 'lucide-react';
import { useRouter } from 'next/navigation';
import ReactMarkdown from 'react-markdown';

export default function AgentWorkspace({ params }: { params: Promise<{ taskId: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const { tasks, submitDeliverable, updateTaskStatus } = useAppStore();
  
  const task = tasks.find(t => t.id === resolvedParams.taskId);
  const [submitting, setSubmitting] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [generatedText, setGeneratedText] = useState("");

  if (!task) {
    return <div className="text-center p-20">Task not found</div>;
  }

  const handleStartWork = () => {
    updateTaskStatus(task.id, 'in_progress');
  };

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      const res = await fetch('/api/grok', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: task.description })
      });
      const data = await res.json();
      if (data.text) {
        setGeneratedText(data.text);
      } else {
        alert("Failed to generate response: " + data.error);
      }
    } catch (err) {
      console.error(err);
      alert("Error calling Grok API");
    } finally {
      setGenerating(false);
    }
  };

  const handleSubmit = () => {
    setSubmitting(true);
    setTimeout(() => {
      submitDeliverable(task.id, 'grok_deliverable.md', generatedText);
      setSubmitting(false);
      router.push('/agent/tasks');
    }, 1000);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <Link href="/agent/tasks" className="flex items-center gap-2 text-ink-soft hover:text-indigo mb-8 transition-colors text-sm font-medium w-max">
        <ArrowLeft className="w-4 h-4" /> Back to Queue
      </Link>
      
      <div className="bg-paper-card border border-line rounded-xl p-8 shadow-sm">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-2xl font-display font-bold text-ink mb-2">Agent Workspace</h1>
            <p className="text-sm font-mono text-ink-soft bg-paper px-2 py-1 rounded inline-block">Task: {task.id}</p>
          </div>
          <span className="bg-indigo-soft text-indigo-deep px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
            {task.status.replace('_', ' ')}
          </span>
        </div>
        
        <div className="space-y-6 text-sm text-ink-soft">
          <div className="p-4 border border-line rounded-lg">
            <h3 className="font-bold text-ink mb-2">Hirer Requirements:</h3>
            <p>{task.description}</p>
          </div>

          {task.status === 'escrowed' && (
            <button 
              onClick={handleStartWork}
              className="w-full py-3 border-2 border-indigo text-indigo hover:bg-indigo hover:text-white rounded-lg font-bold transition-all"
            >
              Start Working
            </button>
          )}

          {task.status === 'in_progress' && (
            <>
              {!generatedText ? (
                <div className="p-12 bg-indigo/5 border border-indigo/20 rounded-lg border-dashed text-center">
                  <Cpu className="w-12 h-12 text-indigo mx-auto mb-4 animate-pulse" />
                  <p className="font-bold text-ink mb-2">Autonomous Agent Ready</p>
                  <p className="text-sm text-ink-soft mb-6">Click below to trigger the AI agent (via Grok API) to autonomously complete the task based on the hirer's description.</p>
                  
                  <button 
                    onClick={handleGenerate}
                    disabled={generating}
                    className="px-6 py-3 bg-indigo text-white rounded-lg font-bold hover:bg-indigo-deep transition-colors disabled:opacity-50 inline-flex items-center gap-2 shadow-lg shadow-indigo/20"
                  >
                    {generating ? (
                      <><div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div> Generating with Grok...</>
                    ) : (
                      <><Zap className="w-5 h-5 fill-current" /> Auto-Generate Output</>
                    )}
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="p-6 bg-white border border-line rounded-xl max-h-[500px] overflow-y-auto prose prose-sm max-w-none prose-headings:text-ink prose-a:text-indigo prose-strong:text-ink">
                    <ReactMarkdown>{generatedText}</ReactMarkdown>
                  </div>
                  <button 
                    onClick={handleSubmit}
                    disabled={submitting}
                    className="w-full py-3 bg-mint text-white rounded-lg font-bold hover:bg-mint-deep transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {submitting ? 'Submitting...' : 'Submit Deliverable to Hirer'}
                  </button>
                </div>
              )}
            </>
          )}

          {['delivered', 'completed'].includes(task.status) && (
            <div className="p-8 bg-mint-soft border border-mint/20 rounded-xl text-center">
              <CheckCircle2 className="w-12 h-12 text-mint mx-auto mb-3" />
              <h3 className="text-lg font-bold text-ink">Work Submitted Successfully</h3>
              <p className="text-sm text-ink-soft mt-1">Waiting for Hirer to approve and release the {task.budgetUsdc} USDC escrow.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
