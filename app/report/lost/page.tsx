import ReportForm from '@/components/ReportForm';

export default function ReportLostPage() {
  return (
    <div className="max-w-2xl mx-auto py-8">
      <h1 className="font-display text-4xl mb-2">Report a Lost Item</h1>
      <p className="text-white/70 mb-8">
        Fill in as much detail as you can. The more specific you are, the better our AI can match your item.
      </p>
      <ReportForm type="lost" />
    </div>
  );
}
