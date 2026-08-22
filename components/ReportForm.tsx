'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CATEGORIES, ZONES } from '@/lib/constants';
import { api } from '@/lib/api';
import Input from './ui/Input';
import Select from './ui/Select';
import Button from './ui/Button';
import type { ReportFormData } from '@/lib/types';

export default function ReportForm({ type }: { type: 'lost' | 'found' }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState<ReportFormData>({
    type,
    title: '',
    description: '',
    category: '',
    location_zone: '',
    reported_at: new Date().toISOString().slice(0, 16),
    contact_name: '',
    contact_email: '',
    contact_phone: '',
    hidden_details: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const formattedData = {
        ...formData,
        reported_at: new Date(formData.reported_at).toISOString(),
      };
      const result = await api.createReport(formattedData);
      router.push(`/matches/${result.report.id}`);
    } catch (err: any) {
      setError(err.message || 'Failed to submit report');
      setLoading(false);
    }
  };

  const borderClass = type === 'lost' ? 'border-t-4 border-pin-red' : 'border-t-4 border-found-green';

  return (
    <form onSubmit={handleSubmit} className={`bg-paper-white p-6 rounded-sm shadow-sm ${borderClass} space-y-6`}>
      {error && <div className="p-3 bg-pin-red/10 border border-pin-red text-pin-red rounded-sm text-sm">{error}</div>}
      
      <div className="space-y-4">
        <h3 className="font-medium text-lg border-b border-cork/20 pb-2">Item Details</h3>
        <Input 
          id="title" name="title" label="Title" 
          value={formData.title} onChange={handleChange} 
          required minLength={3} placeholder={type === 'lost' ? 'e.g. Blue Casio Watch' : 'e.g. Found Blue Watch'} 
        />
        <Input 
          id="description" name="description" label="Description" multiline 
          value={formData.description} onChange={handleChange} 
          required minLength={10} placeholder="Describe the item in detail..." 
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Select 
            id="category" name="category" label="Category" 
            value={formData.category} onChange={handleChange} 
            required options={CATEGORIES.map(c => ({ value: c, label: c }))} 
          />
          <Select 
            id="location_zone" name="location_zone" label="Location Zone" 
            value={formData.location_zone} onChange={handleChange} 
            required options={ZONES.map(z => ({ value: z, label: z }))} 
          />
        </div>
        <Input 
          id="reported_at" name="reported_at" type="datetime-local" label="Date & Time" 
          value={formData.reported_at} onChange={handleChange} required 
        />
        <Input 
          id="hidden_details" name="hidden_details" label="Hidden Details (Optional)" multiline 
          value={formData.hidden_details} onChange={handleChange} 
          helperText="Details known only to the owner (e.g., specific scratch, exact contents) to help verify claims." 
        />
      </div>

      <div className="space-y-4">
        <h3 className="font-medium text-lg border-b border-cork/20 pb-2">Contact Information</h3>
        <Input 
          id="contact_name" name="contact_name" label="Your Name" 
          value={formData.contact_name} onChange={handleChange} required 
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input 
            id="contact_email" name="contact_email" type="email" label="Email Address" 
            value={formData.contact_email} onChange={handleChange} required 
          />
          <Input 
            id="contact_phone" name="contact_phone" type="tel" label="Phone Number (Optional)" 
            value={formData.contact_phone} onChange={handleChange} 
          />
        </div>
      </div>

      <div className="pt-4 flex justify-end">
        <Button 
          type="submit" loading={loading} 
          variant={type === 'lost' ? 'danger' : 'success'} size="lg"
        >
          {type === 'lost' ? 'Report Lost Item' : 'Report Found Item'}
        </Button>
      </div>
    </form>
  );
}
