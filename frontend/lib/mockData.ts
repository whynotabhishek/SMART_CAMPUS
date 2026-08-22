import type { Report, MatchResult } from './types';

const now = new Date();
const hoursAgo = (h: number) => new Date(now.getTime() - h * 60 * 60 * 1000).toISOString();

export const MOCK_REPORTS: Report[] = [
  {
    id: 'mock-1',
    type: 'lost',
    title: 'Blue JBL Earbuds Case',
    description: 'Small blue JBL earbuds charging case, has a small scratch on the lid. Contains wireless earbuds inside.',
    category: 'Electronics',
    location_zone: 'Library',
    reported_at: hoursAgo(2),
    contact_name: 'Rahul Sharma',
    contact_email: 'rahul.s@iitd.ac.in',
    status: 'open',
    created_at: hoursAgo(2),
    updated_at: hoursAgo(2)
  },
  {
    id: 'mock-2',
    type: 'found',
    title: 'Wireless Earbuds in Blue Case',
    description: 'Found a compact blue case with wireless earbuds near the reading section. Brand looks like JBL, minor scratch visible.',
    category: 'Electronics',
    location_zone: 'Library',
    reported_at: hoursAgo(1),
    contact_name: 'Library Admin',
    contact_email: 'library@iitd.ac.in',
    status: 'open',
    created_at: hoursAgo(1),
    updated_at: hoursAgo(1)
  },
  {
    id: 'mock-3',
    type: 'lost',
    title: 'Black North Face Backpack',
    description: 'Black North Face backpack with a broken front zipper. Has a water bottle in side pocket and laptop inside.',
    category: 'Bags & Wallets',
    location_zone: 'Canteen',
    reported_at: hoursAgo(26),
    contact_name: 'Sneha Patel',
    contact_email: 'sneha.p@iitd.ac.in',
    status: 'open',
    created_at: hoursAgo(26),
    updated_at: hoursAgo(26)
  },
  {
    id: 'mock-4',
    type: 'found',
    title: 'Dark Backpack with Broken Zipper',
    description: 'Found a dark-colored large backpack near the canteen counter. Front zipper seems broken. Feels heavy.',
    category: 'Bags & Wallets',
    location_zone: 'Canteen',
    reported_at: hoursAgo(22),
    contact_name: 'Canteen Staff',
    contact_email: 'canteen@iitd.ac.in',
    status: 'open',
    created_at: hoursAgo(22),
    updated_at: hoursAgo(22)
  },
  {
    id: 'mock-5',
    type: 'lost',
    title: 'Student ID Card — Priya Mehta',
    description: 'Lost my student ID card around the hostel. Name: Priya Mehta, 3rd year CSE. Blue lanyard attached.',
    category: 'ID & Documents',
    location_zone: 'Hostel Block A',
    reported_at: hoursAgo(5),
    contact_name: 'Priya Mehta',
    contact_email: 'priya.m@iitd.ac.in',
    status: 'open',
    created_at: hoursAgo(5),
    updated_at: hoursAgo(5)
  }
];

export const MOCK_MATCHES: Record<string, MatchResult[]> = {
  'mock-1': [
    {
      id: 'match-1',
      matched_report: MOCK_REPORTS[1],
      overall_score: 88.5,
      scores: {
        visual_score: 0.0,
        text_score: 0.92,
        location_score: 1.0,
        time_score: 0.85
      },
      explanation: "Strong match because the descriptions point to a very similar Electronics item, both reports are from the Library, and the reports are only 1 hours apart."
    }
  ],
  'mock-2': [
    {
      id: 'match-1',
      matched_report: MOCK_REPORTS[0],
      overall_score: 88.5,
      scores: {
        visual_score: 0.0,
        text_score: 0.92,
        location_score: 1.0,
        time_score: 0.85
      },
      explanation: "Strong match because the descriptions point to a very similar Electronics item, both reports are from the Library, and the reports are only 1 hours apart."
    }
  ],
  'mock-3': [
    {
      id: 'match-2',
      matched_report: MOCK_REPORTS[3],
      overall_score: 76.2,
      scores: {
        visual_score: 0.0,
        text_score: 0.85,
        location_score: 1.0,
        time_score: 0.65
      },
      explanation: "Likely match because the written details are a strong match, both were reported in the same area (Canteen), and the timing of the reports aligns well."
    }
  ],
  'mock-4': [
    {
      id: 'match-2',
      matched_report: MOCK_REPORTS[2],
      overall_score: 76.2,
      scores: {
        visual_score: 0.0,
        text_score: 0.85,
        location_score: 1.0,
        time_score: 0.65
      },
      explanation: "Likely match because the written details are a strong match, both were reported in the same area (Canteen), and the timing of the reports aligns well."
    }
  ]
};
