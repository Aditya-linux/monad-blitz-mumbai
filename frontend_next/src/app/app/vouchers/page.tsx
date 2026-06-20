'use client';
import { useState } from 'react';
import { useAppStore } from '@/lib/store';
import { CreditCard, QrCode, CheckCircle, ArrowRight, Wallet, Gift, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

const DEMO_VOUCHERS: { code: string; amount: number; label: string }[] = [
  { code: 'PAYAGENT500', amount: 500, label: '₹500 Starter' },
  { code: 'PAYAGENT1000', amount: 1000, label: '₹1,000 Standard' },
  { code: 'PAYAGENT2000', amount: 2000, label: '₹2,000 Premium' },
  { code: 'PAYAGENT5000', amount: 5000, label: '₹5,000 Pro' },
];

export default function GiftCardPage() {
  const { platformBalanceInr, platformBalanceUsdc, vouchers, redeemVoucher } = useAppStore();
  const [voucherCode, setVoucherCode] = useState('');
  const [customAmount, setCustomAmount] = useState(500);
  const [step, setStep] = useState<'input' | 'processing' | 'success'>('input');
  const [lastRedeemed, setLastRedeemed] = useState<{ inr: number; usdc: number } | null>(null);

  const handleRedeem = (code: string, amount: number) => {
    setStep('processing');
    setTimeout(() => {
      const success = redeemVoucher(code, amount);
      if (success) {
        setLastRedeemed({ inr: amount, usdc: parseFloat((amount / 83).toFixed(2)) });
        setStep('success');
        setTimeout(() => {
          setStep('input');
          setVoucherCode('');
          setLastRedeemed(null);
        }, 4000);
      } else {
        alert('This voucher code has already been redeemed!');
        setStep('input');
      }
    }, 2000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Link href="/app" className="flex items-center gap-2 text-ink-soft hover:text-indigo mb-6 transition-colors text-sm font-medium w-max">
        <ArrowLeft className="w-4 h-4" /> Back to Dashboard
      </Link>

      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold text-ink mb-2 flex items-center gap-3">
          <Gift className="w-8 h-8 text-saffron" />
          UPI Gift Card Vouchers
        </h1>
        <p className="text-ink-soft">Load platform balance using prepaid voucher codes. No bank account or crypto exchange needed.</p>
      </div>

      {/* Balance Card */}
      <div className="bg-gradient-to-br from-indigo to-indigo-deep rounded-2xl p-6 text-white mb-8 shadow-lg">
        <div className="flex items-center gap-2 mb-4 text-white/60">
          <Wallet className="w-4 h-4" />
          <span className="text-xs uppercase tracking-widest font-bold">Platform Balance</span>
        </div>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div>
            <p className="text-4xl font-mono font-bold">₹{platformBalanceInr.toLocaleString()}</p>
            <p className="text-lg font-mono text-white/70 mt-1">{platformBalanceUsdc} USDC (Monad Testnet)</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-white/50">{vouchers.length} voucher(s) redeemed</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Left: Voucher Input */}
        <div className="lg:col-span-3">
          {step === 'input' && (
            <>
              {/* Quick Buy Cards */}
              <h2 className="font-bold text-ink text-lg mb-4">Quick Load (Demo Vouchers)</h2>
              <p className="text-sm text-ink-soft mb-4">In production, these would be physical cards sold at kirana stores. For the demo, click any card below:</p>
              
              <div className="grid grid-cols-2 gap-3 mb-8">
                {DEMO_VOUCHERS.map(v => (
                  <button
                    key={v.code}
                    onClick={() => handleRedeem(v.code, v.amount)}
                    className="p-4 bg-paper-card border border-line rounded-xl hover:border-saffron hover:shadow-md transition-all text-left group"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <CreditCard className="w-5 h-5 text-saffron" />
                      <span className="text-[10px] font-bold uppercase tracking-widest text-ink-soft group-hover:text-saffron">
                        {v.label}
                      </span>
                    </div>
                    <p className="text-2xl font-mono font-bold text-ink">₹{v.amount.toLocaleString()}</p>
                    <p className="text-xs text-ink-soft font-mono mt-1">≈ {(v.amount / 83).toFixed(2)} USDC</p>
                    <div className="mt-3 flex items-center gap-1 text-xs font-medium text-saffron opacity-0 group-hover:opacity-100 transition-opacity">
                      Tap to load <ArrowRight className="w-3 h-3" />
                    </div>
                  </button>
                ))}
              </div>

              {/* Manual Code Entry */}
              <h2 className="font-bold text-ink text-lg mb-4">Enter Voucher Code</h2>
              <div className="flex gap-3">
                <input
                  type="text"
                  value={voucherCode}
                  onChange={(e) => setVoucherCode(e.target.value.toUpperCase())}
                  placeholder="e.g., PAYAGENT500"
                  className="flex-1 p-3 border border-line rounded-lg bg-paper text-sm font-mono focus:outline-none focus:border-indigo uppercase"
                />
                <button
                  onClick={() => handleRedeem(voucherCode, customAmount)}
                  disabled={!voucherCode}
                  className="px-6 py-3 bg-indigo text-white rounded-lg font-bold hover:bg-indigo-deep transition-colors disabled:opacity-40"
                >
                  Redeem
                </button>
              </div>
            </>
          )}

          {step === 'processing' && (
            <div className="py-20 text-center">
              <div className="w-16 h-16 border-4 border-indigo/20 border-t-indigo rounded-full animate-spin mx-auto mb-6" />
              <h3 className="text-xl font-bold text-ink mb-2">Processing Voucher...</h3>
              <p className="text-sm text-ink-soft">Converting INR → USDC and depositing to Monad Escrow Pool.</p>
            </div>
          )}

          {step === 'success' && lastRedeemed && (
            <div className="py-16 text-center">
              <div className="w-20 h-20 bg-mint text-white rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-bold text-ink mb-2">Balance Loaded!</h3>
              <p className="text-lg font-mono text-ink-soft mb-4">
                ₹{lastRedeemed.inr.toLocaleString()} → <span className="text-mint font-bold">{lastRedeemed.usdc} USDC</span>
              </p>
              <p className="text-xs text-ink-soft">Your Monad escrow pool has been topped up. You can now hire agents using your balance.</p>
            </div>
          )}
        </div>

        {/* Right: How It Works */}
        <div className="lg:col-span-2">
          <div className="bg-paper-card border border-line rounded-xl p-6 sticky top-24">
            <h3 className="font-bold text-ink mb-4 flex items-center gap-2">
              <QrCode className="w-5 h-5 text-indigo" />
              How Gift Cards Work
            </h3>
            
            <div className="space-y-4">
              {[
                { step: '1', title: 'Buy a Voucher', desc: 'Purchase a prepaid PayAgent card at any local kirana store or online.' },
                { step: '2', title: 'Enter the Code', desc: 'Scratch the card and type the code above, or scan the QR on the card.' },
                { step: '3', title: 'Auto-Convert to USDC', desc: 'The platform instantly converts your INR to USDC and deposits it into your Monad escrow pool.' },
                { step: '4', title: 'Hire Agents', desc: 'Use your loaded balance to hire AI or human agents from the marketplace.' },
              ].map(item => (
                <div key={item.step} className="flex gap-3">
                  <div className="w-7 h-7 rounded-full bg-indigo/10 text-indigo flex items-center justify-center text-xs font-bold shrink-0">
                    {item.step}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-ink">{item.title}</p>
                    <p className="text-xs text-ink-soft">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 p-3 bg-saffron-soft border border-saffron/20 rounded-lg text-xs text-saffron-deep">
              <strong>Zero KYC Required.</strong> No bank account, no crypto exchange — just a voucher code and you're in.
            </div>
          </div>
        </div>
      </div>

      {/* Redemption History */}
      {vouchers.length > 0 && (
        <div className="mt-8">
          <h2 className="font-bold text-ink text-lg mb-4">Redemption History</h2>
          <div className="bg-paper-card border border-line rounded-xl overflow-hidden">
            <div className="divide-y divide-line">
              {vouchers.map(v => (
                <div key={v.id} className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <CreditCard className="w-5 h-5 text-saffron" />
                    <div>
                      <p className="text-sm font-bold font-mono text-ink">{v.code}</p>
                      <p className="text-xs text-ink-soft">
                        {new Date(v.redeemedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-mono font-bold text-ink">₹{v.amountInr.toLocaleString()}</p>
                    <p className="text-xs font-mono text-mint">{v.amountUsdc} USDC</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
