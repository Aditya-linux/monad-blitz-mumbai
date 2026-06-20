import { create } from 'zustand';

// Types
export type AgentType = 'ai' | 'human';

export type Agent = {
  id: string;
  name: string;
  description: string;
  category: string;
  priceInr: number;
  priceUsdc: number;
  reputationScore: number;
  tasksCompleted: number;
  capabilities: string[];
  agentType: AgentType;
  autonomousMode?: boolean; // AI agents can auto-complete tasks
};

export type TaskStatus = 'pending' | 'paid' | 'escrowed' | 'in_progress' | 'delivered' | 'completed' | 'disputed';

export type Task = {
  id: string;
  agentId: string;
  title: string;
  description: string;
  budgetInr: number;
  budgetUsdc: number;
  status: TaskStatus;
  createdAt: string;
  deadline: string;
  txHash?: string;
  upiRef?: string;
  deliverableUrl?: string;
  deliverableText?: string;
  reputationNftMinted?: boolean;
  reputationNftTxHash?: string;
};

export type ReputationNFT = {
  id: string;
  agentId: string;
  taskId: string;
  taskTitle: string;
  hirerRating: number;
  budgetUsdc: number;
  mintedAt: string;
  txHash: string;
  tokenId: number;
};

export type Notification = {
  id: string;
  message: string;
  read: boolean;
  timestamp: string;
  type: 'payment' | 'task' | 'dispute' | 'nft' | 'stream' | 'voucher';
};

export type SubscriptionStream = {
  id: string;
  agentId: string;
  title: string;
  monthlyInr: number;
  monthlyUsdc: number;
  ratePerSecondUsdc: number;
  startedAt: string;
  totalStreamed: number;
  isActive: boolean;
  txHash: string;
};

export type GiftVoucher = {
  id: string;
  code: string;
  amountInr: number;
  amountUsdc: number;
  redeemedAt: string;
  txHash: string;
};

interface AppState {
  // Mock Data
  agents: Agent[];
  tasks: Task[];
  notifications: Notification[];
  reputationNFTs: ReputationNFT[];
  streams: SubscriptionStream[];
  vouchers: GiftVoucher[];
  platformBalanceInr: number;
  platformBalanceUsdc: number;
  
  // Wallet & Role State
  role: 'none' | 'hirer' | 'agent' | 'admin';
  walletAddress: string | null;
  priceInrToUsdc: number;
  
  // Actions
  setRole: (role: 'none' | 'hirer' | 'agent' | 'admin') => void;
  connectWallet: (address: string) => void;
  disconnectWallet: () => void;
  
  // Task Actions
  createTask: (task: Omit<Task, 'id' | 'status' | 'createdAt'>) => string;
  updateTaskStatus: (taskId: string, status: TaskStatus, txHash?: string, upiRef?: string) => void;
  submitDeliverable: (taskId: string, url: string, text?: string) => void;
  
  // Reputation NFT Actions
  mintReputationNFT: (taskId: string, rating: number, txHash?: string) => void;
  
  // Subscription Streaming
  startStream: (agentId: string, title: string, monthlyInr: number, monthlyUsdc: number) => string;
  stopStream: (streamId: string) => void;
  updateStreamTotal: (streamId: string, total: number) => void;
  
  // Gift Card Vouchers
  redeemVoucher: (code: string, amountInr: number) => boolean;
  
  // Notifications
  addNotification: (message: string, type: 'payment' | 'task' | 'dispute' | 'nft' | 'stream' | 'voucher') => void;
  markNotificationsRead: () => void;
}

// Initial Mock Data
const MOCK_AGENTS: Agent[] = [
  {
    id: 'agent-1',
    name: 'DataWizard AI',
    description: 'Autonomous AI agent specializing in Python data analysis, Pandas transformations, and data visualization. Processes tasks without human intervention.',
    category: 'Data Analysis',
    priceInr: 150,
    priceUsdc: 1.8,
    reputationScore: 4.8,
    tasksCompleted: 124,
    capabilities: ['Python', 'Pandas', 'Data Viz'],
    agentType: 'ai',
    autonomousMode: true,
  },
  {
    id: 'agent-2',
    name: 'CodeReviewer Agent',
    description: 'AI-powered smart contract auditor that finds vulnerabilities, gas optimizations, and security issues in Solidity code automatically.',
    category: 'Code Review',
    priceInr: 500,
    priceUsdc: 6.0,
    reputationScore: 4.9,
    tasksCompleted: 45,
    capabilities: ['Solidity', 'Security', 'Auditing'],
    agentType: 'ai',
    autonomousMode: true,
  },
  {
    id: 'agent-3',
    name: 'DesignBot Pro',
    description: 'Autonomous AI design agent that generates UI mockups, logos, and brand assets using generative models. Delivers in minutes, not days.',
    category: 'Design',
    priceInr: 250,
    priceUsdc: 3.0,
    reputationScore: 4.6,
    tasksCompleted: 89,
    capabilities: ['UI/UX', 'Logo Design', 'Brand Assets'],
    agentType: 'ai',
    autonomousMode: true,
  },
  {
    id: 'agent-4',
    name: 'ContentCraft AI',
    description: 'AI writing agent that produces SEO-optimized blog posts, marketing copy, and technical documentation autonomously.',
    category: 'Content Writing',
    priceInr: 100,
    priceUsdc: 1.2,
    reputationScore: 4.5,
    tasksCompleted: 210,
    capabilities: ['SEO', 'Blog Posts', 'Copywriting'],
    agentType: 'ai',
    autonomousMode: true,
  },
  {
    id: 'agent-5',
    name: 'Sarah Chen',
    description: 'Full-stack developer with 8 years experience. Specializes in React, Node.js, and cloud architecture. Available for complex projects.',
    category: 'Full-Stack Development',
    priceInr: 2000,
    priceUsdc: 24.0,
    reputationScore: 5.0,
    tasksCompleted: 32,
    capabilities: ['React', 'Node.js', 'AWS'],
    agentType: 'human',
  },
  {
    id: 'agent-6',
    name: 'SmartDeploy Agent',
    description: 'Autonomous DevOps AI agent that provisions infrastructure, sets up CI/CD pipelines, and deploys containers to cloud environments.',
    category: 'DevOps',
    priceInr: 800,
    priceUsdc: 9.6,
    reputationScore: 4.7,
    tasksCompleted: 67,
    capabilities: ['Docker', 'CI/CD', 'Kubernetes'],
    agentType: 'ai',
    autonomousMode: true,
  },
];

// Pre-existing reputation NFTs for demo purposes
const MOCK_REPUTATION_NFTS: ReputationNFT[] = [
  {
    id: 'nft-1',
    agentId: 'agent-1',
    taskId: 'task-demo-1',
    taskTitle: 'Sales Data Pipeline Analysis',
    hirerRating: 5,
    budgetUsdc: 1.8,
    mintedAt: '2025-12-15T10:30:00Z',
    txHash: '0x7a3f8c1d2e4b5a6f9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b',
    tokenId: 1001,
  },
  {
    id: 'nft-2',
    agentId: 'agent-1',
    taskId: 'task-demo-2',
    taskTitle: 'Customer Churn Prediction Model',
    hirerRating: 5,
    budgetUsdc: 1.8,
    mintedAt: '2026-01-22T14:00:00Z',
    txHash: '0x1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c',
    tokenId: 1002,
  },
  {
    id: 'nft-3',
    agentId: 'agent-2',
    taskId: 'task-demo-3',
    taskTitle: 'DeFi Protocol Security Audit',
    hirerRating: 5,
    budgetUsdc: 6.0,
    mintedAt: '2026-03-10T09:00:00Z',
    txHash: '0x3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d',
    tokenId: 1003,
  },
];

export const useAppStore = create<AppState>((set, get) => ({
  agents: MOCK_AGENTS,
  tasks: [],
  notifications: [],
  reputationNFTs: MOCK_REPUTATION_NFTS,
  streams: [],
  vouchers: [],
  platformBalanceInr: 0,
  platformBalanceUsdc: 0,
  role: 'hirer',
  walletAddress: null,
  priceInrToUsdc: 83.0,

  setRole: (role) => set({ role }),
  connectWallet: (address) => set({ walletAddress: address }),
  disconnectWallet: () => set({ walletAddress: null }),

  createTask: (taskData) => {
    const newTask: Task = {
      ...taskData,
      id: `task-${Date.now()}`,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    set((state) => ({ tasks: [newTask, ...state.tasks] }));
    get().addNotification(`New task created: ${newTask.title}`, 'task');
    return newTask.id;
  },

  updateTaskStatus: (taskId, status, txHash, upiRef) => {
    set((state) => ({
      tasks: state.tasks.map((task) =>
        task.id === taskId
          ? { ...task, status, ...(txHash && { txHash }), ...(upiRef && { upiRef }) }
          : task
      ),
    }));
    get().addNotification(`Task status updated to ${status}`, 'task');
  },

  submitDeliverable: (taskId, url, text) => {
    set((state) => ({
      tasks: state.tasks.map((t) =>
        t.id === taskId ? { ...t, status: 'delivered', deliverableUrl: url, deliverableText: text } : t
      ),
    }));
    get().addNotification(`Deliverable submitted for task`, 'task');
  },

  mintReputationNFT: (taskId, rating, txHash) => {
    const task = get().tasks.find(t => t.id === taskId);
    if (!task) return;

    const actualTxHash = txHash || ('0x' + Array(64).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join(''));
    const tokenId = 1000 + get().reputationNFTs.length + 1;

    const nft: ReputationNFT = {
      id: `nft-${Date.now()}`,
      agentId: task.agentId,
      taskId: task.id,
      taskTitle: task.title,
      hirerRating: rating,
      budgetUsdc: task.budgetUsdc,
      mintedAt: new Date().toISOString(),
      txHash: actualTxHash,
      tokenId,
    };

    set((state) => ({
      reputationNFTs: [...state.reputationNFTs, nft],
      tasks: state.tasks.map((t) =>
        t.id === taskId ? { ...t, reputationNftMinted: true, reputationNftTxHash: actualTxHash } : t
      ),
    }));

    get().addNotification(`Soulbound Reputation NFT #${tokenId} minted for ${task.title}`, 'nft');
  },

  startStream: (agentId, title, monthlyInr, monthlyUsdc) => {
    const txHash = '0x' + Array(64).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join('');
    const ratePerSecond = monthlyUsdc / (30 * 24 * 60 * 60); // USDC per second
    
    const stream: SubscriptionStream = {
      id: `stream-${Date.now()}`,
      agentId,
      title,
      monthlyInr,
      monthlyUsdc,
      ratePerSecondUsdc: ratePerSecond,
      startedAt: new Date().toISOString(),
      totalStreamed: 0,
      isActive: true,
      txHash,
    };

    set((state) => ({ streams: [stream, ...state.streams] }));
    get().addNotification(`Subscription stream started: ${title} (${monthlyUsdc} USDC/mo)`, 'stream');
    
    // Create a corresponding task so the agent workspace picks it up and can respond
    const taskId = get().createTask({
      agentId,
      title: `Subscription: ${title}`,
      description: `Ongoing subscription at ${monthlyUsdc} USDC/mo. Please begin the initial setup and acknowledge the subscription.`,
      budgetInr: monthlyInr,
      budgetUsdc: monthlyUsdc,
      deadline: 'Ongoing'
    });
    
    // Automatically transition to escrowed so the agent can start working
    get().updateTaskStatus(taskId, 'escrowed', txHash);

    return stream.id;
  },

  stopStream: (streamId) => {
    const txHash = '0x' + Array(64).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join('');
    set((state) => ({
      streams: state.streams.map(s =>
        s.id === streamId ? { ...s, isActive: false } : s
      ),
    }));
    get().addNotification('Subscription stream cancelled', 'stream');
  },

  updateStreamTotal: (streamId, total) => {
    set((state) => ({
      streams: state.streams.map(s =>
        s.id === streamId ? { ...s, totalStreamed: total } : s
      ),
    }));
  },

  redeemVoucher: (code, amountInr) => {
    const existingVoucher = get().vouchers.find(v => v.code === code);
    if (existingVoucher) return false;

    const amountUsdc = parseFloat((amountInr / get().priceInrToUsdc).toFixed(2));
    const txHash = '0x' + Array(64).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join('');
    
    const voucher: GiftVoucher = {
      id: `voucher-${Date.now()}`,
      code,
      amountInr,
      amountUsdc,
      redeemedAt: new Date().toISOString(),
      txHash,
    };

    set((state) => ({
      vouchers: [...state.vouchers, voucher],
      platformBalanceInr: state.platformBalanceInr + amountInr,
      platformBalanceUsdc: parseFloat((state.platformBalanceUsdc + amountUsdc).toFixed(2)),
    }));

    get().addNotification(`Gift card redeemed: ₹${amountInr} → ${amountUsdc} USDC loaded`, 'voucher');
    
    return true;
  },

  addNotification: (message, type) => {
    set((state) => ({
      notifications: [
        { id: `notif-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`, message, read: false, timestamp: new Date().toISOString(), type },
        ...state.notifications,
      ],
    }));
  },

  markNotificationsRead: () => {
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, read: true })),
    }));
  },
}));
