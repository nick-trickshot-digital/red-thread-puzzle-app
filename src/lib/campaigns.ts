import campaignsData from '@/data/campaigns.json';
import { Campaign } from '@/types/campaign';

// Type assertion for JSON data
const campaigns = campaignsData.campaigns as unknown as Campaign[];

// Seeded random number generator for consistent shuffling per user
function seededRandom(seed: string): () => number {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    const char = seed.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }

  return function() {
    hash = (hash * 9301 + 49297) % 233280;
    return hash / 233280;
  };
}

// Fisher-Yates shuffle with seeded random
function shuffleArray<T>(array: T[], seed: string): T[] {
  const shuffled = [...array];
  const random = seededRandom(seed);

  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  return shuffled;
}

export function getCampaign(slug: string): Campaign | null {
  const campaign = campaigns.find((c) => c.slug === slug);
  return campaign || null;
}

export function getCampaignWithShuffledQuestions(slug: string, userSeed: string): Campaign | null {
  const campaign = getCampaign(slug);
  if (!campaign) return null;

  // If randomization is enabled, shuffle questions using user-specific seed
  if (campaign.randomizeQuestions) {
    const shuffledQuestions = shuffleArray(campaign.questions, userSeed);
    return {
      ...campaign,
      questions: shuffledQuestions,
    };
  }

  return campaign;
}

export function getAllCampaignSlugs(): string[] {
  return campaigns.map((c) => c.slug);
}

export function getCodeLength(campaign: Campaign): number {
  return campaign.code.codeLength ?? campaign.code.finalAnswer.length;
}

export function normalizeAnswer(answer: string, campaign: Campaign): string {
  let normalized = answer;

  if (campaign.code.stripSpaces) {
    normalized = normalized.replace(/\s+/g, '');
  }

  if (!campaign.code.caseSensitive) {
    normalized = normalized.toUpperCase();
  }

  return normalized;
}

export function checkFinalAnswer(input: string, campaign: Campaign): boolean {
  const normalizedInput = normalizeAnswer(input, campaign);
  const normalizedAnswer = normalizeAnswer(campaign.code.finalAnswer, campaign);
  return normalizedInput === normalizedAnswer;
}
