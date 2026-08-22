import ReportForm from '@/components/ReportForm';

export default function ReportFoundPage() {
  return (
    <div className="max-w-2xl mx-auto py-8">
      <h1 className="font-display text-4xl mb-2">Report a Found Item</h1>
      <p className="text-white/70 mb-8">
        Help reunite this item with its owner. Describe it accurately and we'll find the best match.
      </p>
      <ReportForm type="found" />
    </div>
  );
}
