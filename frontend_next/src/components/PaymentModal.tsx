'use client';
import { useState, useEffect } from 'react';
import { useAppStore } from '@/lib/store';
import { X, Smartphone, ShieldCheck } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function PaymentModal({ agentId, priceInr, priceUsdc, onClose }: { agentId: string, priceInr: number, priceUsdc: number, onClose: () => void }) {
  const { createTask, updateTaskStatus } = useAppStore();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Dynamically load Razorpay SDK
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);
    return () => { document.body.removeChild(script); };
  }, []);

  const handleRazorpayPayment = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/razorpay/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: priceInr }),
      });
      const order = await res.json();

      if (order.error) throw new Error(order.error);

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID, 
        amount: order.amount,
        currency: order.currency,
        name: "PayAgent Escrow",
        description: "Task Escrow Deposit",
        order_id: order.id,
        handler: function (response: any) {
          const mockTxHash = '0x' + Array(64).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join('');
          
          // Success!
          const newTaskId = createTask({
            agentId,
            title: 'Custom Agent Task',
            description: 'Task funded via Razorpay and escrowed on Monad.',
            budgetInr: priceInr,
            budgetUsdc: priceUsdc,
          });
          
          updateTaskStatus(newTaskId, 'escrowed', mockTxHash, response.razorpay_payment_id);
          
          // Redirect to Monad Explorer
          window.open(`https://testnet.monadexplorer.com/tx/${mockTxHash}`, '_blank');
          
          onClose();
          router.push(`/app/tasks`);
        },
        prefill: {
          name: "Test Hirer",
          email: "hirer@example.com",
          contact: "9999999999",
        },
        theme: { color: "#4f46e5" },
        modal: {
          ondismiss: function() {
            setLoading(false);
          }
        }
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.on('payment.failed', function (response: any) {
        alert("Payment Failed: " + response.error.description);
        setLoading(false);
      });
      rzp.open();

    } catch (err) {
      console.error(err);
      alert('Failed to initialize Razorpay payment');
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/50 backdrop-blur-sm p-4">
      <div className="bg-paper-card w-full max-w-md rounded-2xl shadow-2xl border border-line overflow-hidden">
        <div className="bg-paper px-6 py-4 border-b border-line flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Smartphone className="text-indigo w-5 h-5" />
            <span className="font-bold font-display text-ink text-lg">Deposit to Escrow</span>
          </div>
          <button onClick={onClose} disabled={loading} className="text-ink-soft hover:text-ink disabled:opacity-50">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-8 text-center">
          <h3 className="text-3xl font-bold font-mono text-ink mb-1">₹{priceInr}</h3>
          <p className="text-ink-soft text-sm mb-8">Equivalent to {priceUsdc} USDC on Monad</p>
          
          <div className="bg-mint-soft/30 p-4 rounded-xl border border-mint/20 mb-8 flex items-start gap-3 text-left">
            <ShieldCheck className="w-6 h-6 text-mint shrink-0" />
            <div>
              <p className="text-sm font-bold text-ink">Secure UPI Payment</p>
              <p className="text-xs text-ink-soft mt-1">Your payment will be processed securely by Razorpay and held in the Monad Escrow smart contract.</p>
            </div>
          </div>
          
          <button 
            onClick={handleRazorpayPayment}
            disabled={loading}
            className="w-full py-3.5 bg-indigo text-white rounded-xl font-bold shadow-lg hover:bg-indigo-deep hover:shadow-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <><div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div> Connecting to Razorpay...</>
            ) : (
              'Proceed to Payment'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
