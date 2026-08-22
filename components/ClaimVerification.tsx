'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

interface ClaimVerificationProps {
  matchId: string;
}

export default function ClaimVerification({ matchId }: ClaimVerificationProps) {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Step 1 Data
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  
  // Step 2 Data
  const [claimId, setClaimId] = useState('');
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  
  // Step 3 Data
  const [result, setResult] = useState<'verified' | 'rejected' | null>(null);
  const [contactInfo, setContactInfo] = useState<{name: string, email: string, phone?: string}>();

  const handleStartClaim = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const res = await api.createClaim(matchId, { claimer_name: name, claimer_email: email });
      setClaimId(res.claim_id);
      setQuestion(res.verification_question);
      setStep(2);
    } catch (err: any) {
      setError(err.message || 'Failed to start claim');
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const res = await api.verifyClaim(claimId, answer);
      setResult(res.status);
      if (res.contact_info) {
        setContactInfo(res.contact_info);
      }
      setStep(3);
    } catch (err: any) {
      setError(err.message || 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-8">
      <h1 className="font-display text-3xl mb-4 text-center">Claim Verification</h1>
      <p className="text-center text-white/70 mb-8">
        To protect against false claims, we need to verify you're the real owner.
      </p>

      {error && <div className="mb-4 p-3 bg-red-500/10 border border-red-500 text-red-400 rounded-lg">{error}</div>}

      {step === 1 && (
        <form onSubmit={handleStartClaim} className="bg-[#151515] p-6 rounded-lg border border-zinc-800 shadow-sm animate-fadeIn">
          <div className="space-y-4 mb-6">
            <Input id="name" label="Your Name" value={name} onChange={e => setName(e.target.value)} required />
            <Input id="email" type="email" label="Your Email" value={email} onChange={e => setEmail(e.target.value)} required />
          </div>
          <Button type="submit" loading={loading} className="w-full">Start Claim</Button>
        </form>
      )}

      {step === 2 && (
        <form onSubmit={handleVerify} className="bg-[#151515] p-6 rounded-lg border border-zinc-800 shadow-sm animate-fadeIn">
          <div className="mb-6 p-4 border-l-4 border-thumbtack-blue bg-blue-600/5">
            <h3 className="text-sm font-medium text-white/60 uppercase tracking-wider mb-2">Verification Question</h3>
            <p className="text-lg font-medium">{question}</p>
          </div>
          
          <div className="mb-6">
            <Input 
              id="answer" label="Your Answer" multiline 
              value={answer} onChange={e => setAnswer(e.target.value)} required 
              placeholder="Be as specific as possible..."
            />
          </div>
          <Button type="submit" loading={loading} variant="success" className="w-full">Submit Answer</Button>
        </form>
      )}

      {step === 3 && result === 'verified' && (
        <div className="bg-[#151515] p-6 rounded-lg border-t-4 border-found-green shadow-sm text-center animate-fadeIn">
          <div className="w-16 h-16 bg-emerald-500 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">✓</div>
          <h2 className="text-2xl font-medium mb-2">Verification Successful!</h2>
          <p className="text-white/70 mb-6">You have been verified as the owner. Please contact the finder to arrange the return.</p>
          
          <div className="bg-zinc-800 p-4 rounded-lg text-left inline-block w-full">
            <h3 className="font-medium mb-3 border-b border-zinc-800 pb-2">Finder Contact Info</h3>
            <p className="mb-1"><span className="text-white/60 w-16 inline-block">Name:</span> {contactInfo?.name}</p>
            <p className="mb-1"><span className="text-white/60 w-16 inline-block">Email:</span> <a href={`mailto:${contactInfo?.email}`} className="text-blue-400 hover:underline">{contactInfo?.email}</a></p>
            {contactInfo?.phone && (
              <p><span className="text-white/60 w-16 inline-block">Phone:</span> {contactInfo.phone}</p>
            )}
          </div>
          <Link href="/" className="block mt-6">
            <Button variant="outline">Return to Home</Button>
          </Link>
        </div>
      )}

      {step === 3 && result === 'rejected' && (
        <div className="bg-[#151515] p-6 rounded-lg border-t-4 border-red-500 shadow-sm text-center animate-fadeIn">
          <div className="w-16 h-16 bg-red-500 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">✕</div>
          <h2 className="text-2xl font-medium mb-2">Verification Failed</h2>
          <p className="text-white/70 mb-6">Your answer didn't match our records. Contact campus security for assistance.</p>
          <Button variant="outline" onClick={() => setStep(2)}>Try Again</Button>
        </div>
      )}
    </div>
  );
}
