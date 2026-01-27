export interface Campaign {
  slug: string;
  version: string;
  title: string;
  theme: {
    accent: string;
  };
  copy: {
    landingTitle: string;
    landingBody: string;
    howToPlaySteps: string[];
    prizeTitle: string;
    prizeBody: string;
  };
  entry: {
    entryFormUrl: string;
    entryCta: string;
  };
  code: {
    finalAnswer: string;
    codeLength?: number;
    caseSensitive: boolean;
    stripSpaces: boolean;
  };
  questions: Question[];
  randomizeQuestions?: boolean;
}

export interface Question {
  prompt: string;
  inputMode: 'LETTER_PICKER';
  accepted: {
    type: 'LETTER';
    value: string;
  };
  rewards?: {
    type: 'LOCK_LETTER' | 'NONE';
    letter?: string;
    position?: number | null;
  };
  helperText?: string | null;
}

export interface CampaignProgress {
  version: string;
  answered: boolean[];
  lockedLetters: string[];
  unlocked: boolean;
  startedAt: number;
  userSeed?: string;
}
