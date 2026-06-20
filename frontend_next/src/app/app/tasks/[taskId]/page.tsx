'use client';
import { use, useState } from 'react';
import Link from 'next/link';
import { useAppStore } from '@/lib/store';
import { ArrowLeft, CheckCircle2, Clock, Play, FileText, Download, Check, Shield, Star, ExternalLink } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { REPUTATION_REGISTRY_ADDRESS, REPUTATION_REGISTRY_ABI } from '@/lib/contracts';
import { useEffect } from 'react';

export default function TaskTracker({ params }: { params: Promise<{ taskId: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const { tasks, agents, updateTaskStatus, mintReputationNFT } = useAppStore();
  
  const task = tasks.find(t => t.id === resolvedParams.taskId);
  const agent = agents.find(a => a.id === task?.agentId);
  const [releasing, setReleasing] = useState(false);
  const [rating, setRating] = useState(5);
  const [minting, setMinting] = useState(false);

  if (!task || !agent) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold text-ink mb-4">Task Not Found</h1>
        <Link href="/app/tasks" className="text-indigo hover:underline">Return to Tasks</Link>
      </div>
    );
  }

  const handleReleaseEscrow = () => {
    setReleasing(true);
    setTimeout(() => {
      const mockTxHash = '0x' + Array(64).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join('');
      updateTaskStatus(task.id, 'completed', mockTxHash);
      setReleasing(false);
      window.open(`https://testnet.monadexplorer.com/tx/${mockTxHash}`, '_blank');
    }, 2000);
  };

  const { data: hash, isPending, writeContract, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  useEffect(() => {
    if (isSuccess && hash && !task.reputationNftMinted) {
      mintReputationNFT(task.id, rating, hash);
    }
  }, [isSuccess, hash, task.id, rating, mintReputationNFT, task.reputationNftMinted]);

  const handleMintNFT = () => {
    try {
      const numericAgentId = parseInt(agent.id.replace('agent-', ''), 10);
      const contentHash = '0x0000000000000000000000000000000000000000000000000000000000000000';
      
      writeContract({
        address: REPUTATION_REGISTRY_ADDRESS,
        abi: REPUTATION_REGISTRY_ABI,
        functionName: 'giveFeedback',
        args: [BigInt(numericAgentId), BigInt(rating), 0, "excellent,fast", "ipfs://none", contentHash],
      });
    } catch (err) {
      console.error("Failed to execute contract:", err);
      alert("Failed to initiate transaction. Please ensure your wallet is connected to Monad Testnet.");
    }
  };

  const steps = [
    { id: 'escrowed', label: 'Payment Escrowed', icon: Clock },
    { id: 'in_progress', label: 'Agent Working', icon: Play },
    { id: 'delivered', label: 'Delivered', icon: FileText },
    { id: 'completed', label: 'Completed (Paid)', icon: CheckCircle2 },
  ];

  const currentStepIndex = steps.findIndex(s => s.id === task.status);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Link href="/app/tasks" className="flex items-center gap-2 text-ink-soft hover:text-indigo mb-8 transition-colors text-sm font-medium w-max">
        <ArrowLeft className="w-4 h-4" /> Back to Queue
      </Link>
      
      <div className="bg-paper-card border border-line rounded-xl overflow-hidden shadow-sm mb-8">
        <div className="p-8 border-b border-line bg-paper/50">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <div>
              <h1 className="text-3xl font-display font-bold text-ink mb-2">{task.title}</h1>
              <p className="text-sm font-mono text-ink-soft bg-paper border border-line px-2 py-1 rounded inline-block">ID: {task.id}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-ink-soft uppercase tracking-wider mb-1">Contract Value</p>
              <p className="text-2xl font-mono font-bold text-ink">₹{task.budgetInr} <span className="text-lg text-mint">({task.budgetUsdc} USDC)</span></p>
            </div>
          </div>
          
          <div className="flex items-center gap-4 p-4 bg-paper border border-line rounded-lg">
            <div className="w-10 h-10 bg-indigo-soft text-indigo flex items-center justify-center rounded-full font-bold">
              {agent.name.charAt(0)}
            </div>
            <div>
              <p className="text-sm font-medium text-ink">Assigned to <span className="font-bold">{agent.name}</span></p>
              <p className="text-xs text-ink-soft">{agent.category} • {agent.reputationScore} ⭐</p>
            </div>
          </div>
        </div>

        {/* Progress Stepper */}
        <div className="p-8 border-b border-line">
          <h3 className="text-sm font-bold text-ink uppercase tracking-wider mb-6">Contract Status</h3>
          <div className="flex items-center justify-between relative">
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-line -z-10"></div>
            <div 
              className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-indigo -z-10 transition-all duration-500"
              style={{ width: `${(Math.max(0, currentStepIndex) / (steps.length - 1)) * 100}%` }}
            ></div>
            
            {steps.map((step, index) => {
              const isPast = currentStepIndex > index;
              const isCurrent = currentStepIndex === index;
              const Icon = step.icon;
              
              return (
                <div key={step.id} className="flex flex-col items-center gap-2">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center border-4 border-paper-card transition-colors ${
                    isPast || isCurrent ? 'bg-indigo text-white' : 'bg-line text-ink-soft'
                  }`}>
                    {isPast ? <Check className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                  </div>
                  <span className={`text-xs font-medium hidden md:block ${isPast || isCurrent ? 'text-ink' : 'text-ink-soft'}`}>
                    {step.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Deliverables Section */}
        <div className="p-8">
          <h3 className="text-lg font-bold text-ink mb-4">Task Deliverables</h3>
          
          {['escrowed', 'in_progress'].includes(task.status) ? (
            <div className="p-12 text-center border-2 border-dashed border-line rounded-xl bg-paper/30">
              <div className="w-12 h-12 border-4 border-indigo/20 border-t-indigo rounded-full animate-spin mx-auto mb-4"></div>
              <h4 className="font-medium text-ink mb-1">Agent is working...</h4>
              <p className="text-sm text-ink-soft">The deliverable will appear here once submitted.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {task.deliverableText ? (
                <div className="p-6 bg-paper border border-line rounded-xl max-h-96 overflow-y-auto font-mono text-sm whitespace-pre-wrap">
                  {task.deliverableText}
                </div>
              ) : (
                <div className="flex items-center justify-between p-4 bg-mint-soft/30 border border-mint/20 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-mint text-white rounded-lg">
                      <FileText className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-ink">{task.deliverableUrl || 'final_analysis_report.pdf'}</h4>
                      <p className="text-xs text-ink-soft">Submitted by {agent.name}</p>
                    </div>
                  </div>
                  <button className="px-4 py-2 border border-line bg-paper text-ink rounded-lg text-sm font-medium hover:bg-line transition-colors flex items-center gap-2">
                    <Download className="w-4 h-4" /> Download
                  </button>
                </div>
              )}

              {task.status === 'delivered' && (
                <div className="bg-paper p-6 rounded-xl border border-line">
                  <h4 className="font-bold text-ink mb-2">Review & Approve</h4>
                  <p className="text-sm text-ink-soft mb-6">Review the deliverable above. If it meets your requirements, release the escrowed USDC to the agent. If not, you can open a dispute.</p>
                  <div className="flex gap-4">
                    <button 
                      onClick={handleReleaseEscrow}
                      disabled={releasing}
                      className="flex-1 py-3 bg-indigo text-white rounded-lg font-bold hover:bg-indigo-deep transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {releasing ? (
                        <><div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div> Releasing on Monad...</>
                      ) : (
                        <><CheckCircle2 className="w-5 h-5" /> Approve & Release Escrow</>
                      )}
                    </button>
                    <button className="px-6 py-3 border border-red-200 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg font-bold transition-colors">
                      Dispute
                    </button>
                  </div>
                </div>
              )}

              {task.status === 'completed' && (
                <div className="space-y-4">
                  <div className="p-4 bg-mint-soft border border-mint/30 rounded-xl flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-mint shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-mint-deep">Payment Released</p>
                      <p className="text-sm text-mint-deep/80 mt-1">You have successfully approved the task and released {task.budgetUsdc} USDC to the agent via Monad Testnet.</p>
                      <p className="text-xs font-mono text-mint mt-2">
                        TxHash: <a href={`https://testnet.monadexplorer.com/tx/${task.txHash}`} target="_blank" rel="noopener noreferrer" className="underline hover:text-mint-deep">{task.txHash}</a>
                      </p>
                    </div>
                  </div>

                  {/* NFT Minting Section */}
                  {!task.reputationNftMinted ? (
                    <div className="p-6 bg-gradient-to-br from-indigo/5 to-paper-card border border-indigo/20 rounded-xl">
                      <h4 className="font-bold text-ink mb-1 flex items-center gap-2">
                        <Shield className="w-5 h-5 text-indigo" />
                        Mint Reputation NFT
                      </h4>
                      <p className="text-sm text-ink-soft mb-4">Rate the agent and mint a Soulbound NFT on Monad as a permanent, on-chain record of this completed task.</p>
                      
                      <div className="flex items-center gap-2 mb-6">
                        <span className="text-sm font-medium text-ink mr-2">Your Rating:</span>
                        {[1,2,3,4,5].map(star => (
                          <button key={star} onClick={() => setRating(star)} className="focus:outline-none">
                            <Star className={`w-6 h-6 transition-colors ${star <= rating ? 'text-saffron fill-saffron' : 'text-line hover:text-saffron/50'}`} />
                          </button>
                        ))}
                        <span className="text-sm font-mono text-ink-soft ml-2">{rating}/5</span>
                      </div>

                      <button
                        onClick={handleMintNFT}
                        disabled={isPending || isConfirming}
                        className="w-full py-3 bg-indigo text-white rounded-lg font-bold hover:bg-indigo-deep transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                      >
                        {isPending || isConfirming ? (
                          <><div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div> {isPending ? 'Confirm in Wallet...' : 'Minting on Monad...'}</>
                        ) : (
                          <><Shield className="w-5 h-5" /> Mint Soulbound Reputation NFT</>
                        )}
                      </button>
                      {error && (
                        <p className="text-red-500 text-xs mt-2 text-center">Transaction failed. Please try again.</p>
                      )}
                    </div>
                  ) : (
                    <div className="p-4 bg-indigo/5 border border-indigo/20 rounded-xl flex items-start gap-3">
                      <Shield className="w-5 h-5 text-indigo shrink-0 mt-0.5" />
                      <div>
                        <p className="font-bold text-ink">Soulbound NFT Minted ✓</p>
                        <p className="text-sm text-ink-soft mt-1">A non-transferable reputation token has been permanently recorded on Monad for {agent.name}.</p>
                        <p className="text-xs font-mono text-indigo mt-2">
                          NFT TxHash: <a href={`https://testnet.monadexplorer.com/tx/${task.reputationNftTxHash}`} target="_blank" rel="noopener noreferrer" className="underline hover:text-indigo-deep">{task.reputationNftTxHash}</a>
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
