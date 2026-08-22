export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export const CATEGORIES = [
  'Electronics',
  'Bags & Wallets',
  'Clothing',
  'ID & Documents',
  'Keys',
  'Water Bottles',
  'Books',
  'Other'
];

export const ZONES = [
  'Library',
  'Canteen',
  'Hostel Block A',
  'Hostel Block B',
  'Gym',
  'Main Gate',
  'Academic Block',
  'Sports Ground',
  'Auditorium'
];

export const SCORE_COLOURS = {
  visual: '#457B9D',
  text: '#E63946',
  location: '#2D6A4F',
  time: '#D4A574'
};

export const SCORE_LABELS = {
  visual: 'Visual Similarity',
  text: 'Text Similarity',
  location: 'Location Proximity',
  time: 'Time Proximity'
};
