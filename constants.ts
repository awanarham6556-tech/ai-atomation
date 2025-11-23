import React from 'react';
import { FacebookPage } from './types';

export const MOCK_FB_PAGES: FacebookPage[] = [
  { id: 'fb1', name: 'Tech Daily', followers: 12500, category: 'Technology', isConnected: false },
  { id: 'fb2', name: 'Viral Shorts', followers: 45000, category: 'Entertainment', isConnected: false },
  { id: 'fb3', name: 'Healthy Living', followers: 8900, category: 'Lifestyle', isConnected: false },
];

export const MOCK_VIDEO_TITLES = [
  "Top 10 AI Tools in 2024",
  "How to Cook Perfect Pasta",
  "Travel Vlog: Japan Diaries",
  "Coding a React App from Scratch",
  "Unboxing the New iPhone",
  "Morning Yoga Routine",
  "Crypto Market Analysis",
  "Funny Cat Compilation #42"
];

export const DEFAULT_CONFIG = {
  videosPerDay: 3,
  postingWindowStart: "08:00",
  postingWindowEnd: "20:00",
  autoApprove: true,
  targetAudience: "General Audience"
};
