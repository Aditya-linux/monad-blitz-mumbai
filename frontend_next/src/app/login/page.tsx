'use client';
import { useAppStore } from '@/lib/store';
import { useRouter } from 'next/navigation';
import { UserCircle, Shield, Briefcase } from 'lucide-react';

export default function Login() {
  const { setRole } = useAppStore();
  const router = useRouter();

  const handleLogin = (role: 'hirer' | 'agent' | 'admin', route: string) => {
    setRole(role);
    router.push(route);
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-paper">
      <div className="max-w-md w-full space-y-8 bg-paper-card p-8 rounded-2xl border border-line shadow-lg">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-display font-bold text-ink">Welcome to PayAgent</h2>
          <p className="mt-2 text-sm text-ink-soft">
            Choose your persona to enter the mock platform.
          </p>
        </div>
        
        <div className="mt-8 space-y-4">
          <button
            onClick={() => handleLogin('hirer', '/app')}
            className="w-full flex items-center p-4 border border-line rounded-xl hover:bg-indigo-soft hover:border-indigo transition-all group"
          >
            <div className="bg-indigo text-white p-3 rounded-lg group-hover:scale-110 transition-transform">
              <UserCircle className="w-6 h-6" />
            </div>
            <div className="ml-4 text-left">
              <h3 className="text-lg font-medium text-ink">I am a Hirer</h3>
              <p className="text-sm text-ink-soft">I want to hire AI agents using UPI.</p>
            </div>
          </button>

          <button
            onClick={() => handleLogin('agent', '/agent')}
            className="w-full flex items-center p-4 border border-line rounded-xl hover:bg-mint-soft hover:border-mint transition-all group"
          >
            <div className="bg-mint text-white p-3 rounded-lg group-hover:scale-110 transition-transform">
              <Briefcase className="w-6 h-6" />
            </div>
            <div className="ml-4 text-left">
              <h3 className="text-lg font-medium text-ink">I am an Agent</h3>
              <p className="text-sm text-ink-soft">I want to accept tasks and earn USDC.</p>
            </div>
          </button>

          <button
            onClick={() => handleLogin('admin', '/admin')}
            className="w-full flex items-center p-4 border border-line rounded-xl hover:bg-saffron-soft hover:border-saffron transition-all group"
          >
            <div className="bg-saffron text-white p-3 rounded-lg group-hover:scale-110 transition-transform">
              <Shield className="w-6 h-6" />
            </div>
            <div className="ml-4 text-left">
              <h3 className="text-lg font-medium text-ink">I am an Admin</h3>
              <p className="text-sm text-ink-soft">I want to resolve disputes and view ledgers.</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
