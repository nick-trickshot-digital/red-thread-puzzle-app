'use client';

import { useState, useEffect } from 'react';
import { Campaign, CampaignProgress } from '@/types/campaign';
import { getCodeLength } from '@/lib/campaigns';

const STORAGE_PREFIX = 'vault_progress_';

function getStorageKey(slug: string): string {
  return `${STORAGE_PREFIX}${slug}`;
}

function generateUserSeed(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
}

function createInitialProgress(
  campaign: Campaign,
  codeLength: number
): CampaignProgress {
  return {
    version: campaign.version,
    answered: new Array(campaign.questions.length).fill(false),
    lockedLetters: new Array(codeLength).fill(''),
    unlocked: false,
    startedAt: Date.now(),
    userSeed: generateUserSeed(),
  };
}

function loadProgress(
  campaign: Campaign,
  codeLength: number
): CampaignProgress {
  if (typeof window === 'undefined') {
    return createInitialProgress(campaign, codeLength);
  }

  try {
    const stored = localStorage.getItem(getStorageKey(campaign.slug));
    if (!stored) {
      return createInitialProgress(campaign, codeLength);
    }

    const progress: CampaignProgress = JSON.parse(stored);

    // Version mismatch - reset progress
    if (progress.version !== campaign.version) {
      return createInitialProgress(campaign, codeLength);
    }

    // Validate array lengths match current config
    if (
      progress.answered.length !== campaign.questions.length ||
      progress.lockedLetters.length !== codeLength
    ) {
      return createInitialProgress(campaign, codeLength);
    }

    return progress;
  } catch (error) {
    console.error('Failed to load progress:', error);
    return createInitialProgress(campaign, codeLength);
  }
}

function saveProgress(slug: string, progress: CampaignProgress): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(getStorageKey(slug), JSON.stringify(progress));
  } catch (error) {
    console.error('Failed to save progress:', error);
  }
}

export function useCampaignProgress(campaign: Campaign) {
  const codeLength = getCodeLength(campaign);
  const [progress, setProgress] = useState<CampaignProgress>(() =>
    createInitialProgress(campaign, codeLength)
  );
  const [isHydrated, setIsHydrated] = useState(false);

  // Load progress after hydration to avoid SSR mismatch
  useEffect(() => {
    const loaded = loadProgress(campaign, codeLength);
    setProgress(loaded);
    setIsHydrated(true);
  }, [campaign, codeLength]);

  useEffect(() => {
    if (isHydrated) {
      saveProgress(campaign.slug, progress);
    }
  }, [campaign.slug, progress, isHydrated]);

  const markAnswered = (questionIndex: number, letter?: string, position?: number | null) => {
    setProgress((prev) => {
      const newAnswered = [...prev.answered];
      newAnswered[questionIndex] = true;

      let newLockedLetters = [...prev.lockedLetters];

      if (letter !== undefined) {
        if (position !== undefined && position !== null) {
          // Lock to specific position
          newLockedLetters[position] = letter;
        } else {
          // Append to next empty slot
          const emptyIndex = newLockedLetters.findIndex((l) => l === '');
          if (emptyIndex !== -1) {
            newLockedLetters[emptyIndex] = letter;
          }
        }
      }

      return {
        ...prev,
        answered: newAnswered,
        lockedLetters: newLockedLetters,
      };
    });
  };

  const unlock = () => {
    setProgress((prev) => ({
      ...prev,
      unlocked: true,
    }));
  };

  const reset = () => {
    const newProgress = createInitialProgress(campaign, codeLength);
    setProgress(newProgress);
    saveProgress(campaign.slug, newProgress);
  };

  const isQuestionAnswered = (index: number): boolean => {
    return progress.answered[index] || false;
  };

  const getFirstUnansweredIndex = (): number => {
    const index = progress.answered.findIndex((a) => !a);
    return index === -1 ? progress.answered.length : index;
  };

  const allQuestionsAnswered = (): boolean => {
    return progress.answered.every((a) => a);
  };

  const allLettersCollected = (): boolean => {
    return progress.lockedLetters.every((l) => l !== '');
  };

  return {
    progress,
    markAnswered,
    unlock,
    reset,
    isQuestionAnswered,
    getFirstUnansweredIndex,
    allQuestionsAnswered,
    allLettersCollected,
  };
}
