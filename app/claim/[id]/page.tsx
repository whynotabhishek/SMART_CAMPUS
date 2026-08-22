import ClaimVerification from '@/components/ClaimVerification';

export default function ClaimPage({ params }: { params: { id: string } }) {
  return <ClaimVerification matchId={params.id} />;
}
