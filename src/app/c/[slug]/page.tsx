'use client';

import { useParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import { getCampaign, getCodeLength, checkFinalAnswer } from '@/lib/campaigns';
import { useCampaignProgress } from '@/hooks/useCampaignProgress';
import ScreenLayout from '@/components/ScreenLayout';
import NeonButton from '@/components/NeonButton';
import ProgressCircles from '@/components/ProgressCircles';
import LetterPicker from '@/components/LetterPicker';
import FeedbackToast from '@/components/FeedbackToast';
import ResetLink from '@/components/ResetLink';
import { useEffect, useState } from 'react';

// Dynamic import for VaultScene to avoid SSR issues with Spline
const VaultScene = dynamic(() => import('@/components/VaultScene'), {
  ssr: false,
  loading: () => (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin" />
    </div>
  ),
});

const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

type Screen =
  | { type: 'landing' }
  | { type: 'how-to-play' }
  | { type: 'question'; index: number }
  | { type: 'final' }
  | { type: 'unlocked' }
  | { type: 'enter' };

export default function CampaignPage() {
  const params = useParams();
  const slug = params.slug as string;
  const baseCampaign = getCampaign(slug);

  const [screen, setScreen] = useState<Screen>({ type: 'landing' });
  const [selectedLetter, setSelectedLetter] = useState('A');
  const [finalInput, setFinalInput] = useState('');
  const [feedback, setFeedback] = useState<{
    type: 'success' | 'error';
    message: string;
    visible: boolean;
  }>({
    type: 'success',
    message: '',
    visible: false,
  });

  // Form state
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Vault scene state
  const [showVaultScene, setShowVaultScene] = useState(false);

  if (!baseCampaign) {
    return (
      <ScreenLayout>
        <div className="flex-1 flex items-center justify-center px-6">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Campaign Not Found</h1>
            <p className="text-zinc-400">This campaign does not exist.</p>
          </div>
        </div>
      </ScreenLayout>
    );
  }

  const campaign = baseCampaign;

  const {
    progress,
    markAnswered,
    unlock,
    reset,
    getFirstUnansweredIndex,
    allLettersCollected,
  } = useCampaignProgress(campaign);

  const codeLength = getCodeLength(campaign);

  // Auto-redirect to unlocked if already unlocked
  useEffect(() => {
    if (progress.unlocked && screen.type !== 'unlocked' && screen.type !== 'enter') {
      setScreen({ type: 'unlocked' });
    }
  }, [progress.unlocked, screen.type]);

  const handlePrevLetter = () => {
    const currentIndex = LETTERS.indexOf(selectedLetter);
    const prevIndex = currentIndex === 0 ? LETTERS.length - 1 : currentIndex - 1;
    setSelectedLetter(LETTERS[prevIndex]);
  };

  const handleNextLetter = () => {
    const currentIndex = LETTERS.indexOf(selectedLetter);
    const nextIndex = currentIndex === LETTERS.length - 1 ? 0 : currentIndex + 1;
    setSelectedLetter(LETTERS[nextIndex]);
  };

  const handleJumpToStart = () => {
    setSelectedLetter('A');
  };

  const handleJumpToEnd = () => {
    setSelectedLetter('Z');
  };

  const handleQuestionSubmit = (questionIndex: number) => {
    const question = campaign.questions[questionIndex];
    const correctLetter = question.accepted.value.toUpperCase();
    const isCorrect = selectedLetter === correctLetter;

    if (isCorrect) {
      setFeedback({
        type: 'success',
        message: 'Correct!',
        visible: true,
      });

      const reward = question.rewards;
      if (reward && reward.type === 'LOCK_LETTER' && reward.letter) {
        markAnswered(questionIndex, reward.letter, reward.position);
      } else {
        markAnswered(questionIndex);
      }

      setTimeout(() => {
        setFeedback((prev) => ({ ...prev, visible: false }));
        setSelectedLetter('A');

        if (questionIndex + 1 < campaign.questions.length) {
          setScreen({ type: 'question', index: questionIndex + 1 });
        } else {
          setScreen({ type: 'final' });
        }
      }, 600);
    } else {
      setFeedback({
        type: 'error',
        message: 'Try again',
        visible: true,
      });
    }
  };

  const handleFinalSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const canSubmit = allLettersCollected() && finalInput.trim().length > 0;
    if (!canSubmit) return;

    const isCorrect = checkFinalAnswer(finalInput, campaign);

    if (isCorrect) {
      setFeedback({
        type: 'success',
        message: 'Vault Unlocked!',
        visible: true,
      });

      unlock();
      setShowVaultScene(true);

      setTimeout(() => {
        setFeedback((prev) => ({ ...prev, visible: false }));
        setScreen({ type: 'unlocked' });
      }, 1500);
    } else {
      setFeedback({
        type: 'error',
        message: 'Incorrect. Try again.',
        visible: true,
      });
    }
  };

  const handleReset = () => {
    if (confirm('Are you sure you want to reset your progress?')) {
      reset();
      setScreen({ type: 'landing' });
      setSelectedLetter('A');
      setFinalInput('');
    }
  };

  // LANDING SCREEN
  if (screen.type === 'landing') {
    return (
      <ScreenLayout accentColor={campaign.theme.accent} showVaultHeader={false}>
        <div className="absolute bottom-0 left-0 right-0 px-6 pb-6">
          <div className="max-w-md mx-auto w-full text-center space-y-4">
            <img
              src="/images/logo.png"
              alt="Redthread Market Access"
              className="mx-auto w-32"
            />
            <p className="text-white text-lg leading-snug">
              {campaign.copy.landingTitle}{' '}
              <span className="font-bold italic">{campaign.copy.landingBody}</span>
            </p>
            <NeonButton
              onClick={() => setScreen({ type: 'how-to-play' })}
              accentColor={campaign.theme.accent}
              fullWidth
            >
              &gt; GET STARTED
            </NeonButton>
          </div>
        </div>
      </ScreenLayout>
    );
  }

  // HOW TO PLAY SCREEN
  if (screen.type === 'how-to-play') {
    return (
      <ScreenLayout accentColor={campaign.theme.accent} showVaultHeader={false}>
        <div className="absolute bottom-0 left-0 right-0 px-6 pb-6">
          <div className="max-w-md mx-auto space-y-4">
            <div className="text-center">
              <h1 className="text-2xl font-bold tracking-wide">HOW TO PLAY</h1>
              <svg className="w-5 h-5 mt-1 text-white mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>

            <div className="space-y-2">
              {campaign.copy.howToPlaySteps.map((step, index) => (
                <div key={index} className="flex items-start gap-2">
                  <span className="text-base font-bold flex-shrink-0" style={{ color: campaign.theme.accent }}>
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <p className="text-white text-sm leading-snug">{step}</p>
                </div>
              ))}
            </div>

            <NeonButton
              onClick={() => {
                const firstUnanswered = getFirstUnansweredIndex();
                setScreen({ type: 'question', index: firstUnanswered });
              }}
              accentColor={campaign.theme.accent}
              fullWidth
            >
              &gt; LETS GO
            </NeonButton>
          </div>
        </div>
      </ScreenLayout>
    );
  }

  // QUESTION SCREEN
  if (screen.type === 'question') {
    const questionIndex = screen.index;
    const question = campaign.questions[questionIndex];
    const questionNumber = questionIndex + 1;

    // Safety check: if question doesn't exist, go back to landing
    if (!question) {
      setScreen({ type: 'landing' });
      return null;
    }

    return (
      <ScreenLayout accentColor={campaign.theme.accent} showVaultHeader={false}>
        <div className="absolute bottom-0 left-0 right-0 px-6 pb-6">
          <div className="max-w-md w-full mx-auto flex flex-col items-center gap-3">
            <h1 className="text-3xl font-bold" style={{ color: campaign.theme.accent }}>
              Q{questionNumber}
            </h1>

            <p className="text-base leading-snug text-white text-center">
              {question.prompt}
            </p>

            <LetterPicker
              value={selectedLetter}
              onPrev={handlePrevLetter}
              onNext={handleNextLetter}
              onJumpToStart={handleJumpToStart}
              onJumpToEnd={handleJumpToEnd}
              accentColor={campaign.theme.accent}
            />

            <ProgressCircles
              count={codeLength}
              letters={progress.lockedLetters}
              accentColor={campaign.theme.accent}
            />

            <div className="w-full pt-1">
              <NeonButton
                onClick={() => handleQuestionSubmit(questionIndex)}
                accentColor={campaign.theme.accent}
                fullWidth
              >
                &gt; LOCK IT IN
              </NeonButton>
            </div>
          </div>
        </div>

        <FeedbackToast
          type={feedback.type}
          message={feedback.message}
          visible={feedback.visible}
          onClose={() => setFeedback((prev) => ({ ...prev, visible: false }))}
          accentColor={campaign.theme.accent}
        />
      </ScreenLayout>
    );
  }

  // FINAL SCREEN
  if (screen.type === 'final') {
    const canSubmit = allLettersCollected() && finalInput.trim().length > 0;

    return (
      <ScreenLayout accentColor={campaign.theme.accent} showVaultHeader={false}>
        {/* 3D Vault Scene - shows when unlocking */}
        {showVaultScene && (
          <div className="absolute inset-0 z-10">
            <VaultScene />
          </div>
        )}

        {/* Content at bottom */}
        <div className={`absolute bottom-0 left-0 right-0 px-6 pb-6 z-20 ${showVaultScene ? 'opacity-0 transition-opacity duration-500' : ''}`}>
          <div className="max-w-md mx-auto space-y-3">
            <div className="flex items-center justify-center gap-2">
              {progress.lockedLetters.map((letter, i) => (
                <div
                  key={i}
                  className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold"
                  style={{
                    backgroundColor: '#1e1a3a',
                    border: `2px solid ${campaign.theme.accent}`,
                    boxShadow: `0 0 10px ${campaign.theme.accent}50`,
                    color: '#ffffff',
                  }}
                >
                  {letter}
                </div>
              ))}
            </div>

            <p className="text-sm leading-snug text-white text-center">
              Unscramble the letters to reveal the vault keyword. Type it below and submit to see if you&apos;ve <span className="font-bold">cracked the code</span>
            </p>

            <form onSubmit={handleFinalSubmit} className="space-y-3">
              <input
                type="text"
                value={finalInput}
                onChange={(e) => setFinalInput(e.target.value.toUpperCase())}
                placeholder="TYPE ANSWER"
                className="w-full px-4 py-3 min-h-[48px] rounded-lg text-center text-lg font-bold tracking-widest uppercase bg-white/10 border-2 border-white/50 focus:border-white focus:outline-none transition-all text-white placeholder-white/40"
                autoComplete="off"
                autoCapitalize="characters"
                autoCorrect="off"
                spellCheck="false"
                enterKeyHint="done"
              />

              <NeonButton
                type="submit"
                accentColor={campaign.theme.accent}
                disabled={!canSubmit}
                fullWidth
              >
                &gt; SUBMIT CODE
              </NeonButton>
            </form>
          </div>
        </div>

        <FeedbackToast
          type={feedback.type}
          message={feedback.message}
          visible={feedback.visible}
          onClose={() => setFeedback((prev) => ({ ...prev, visible: false }))}
          accentColor={campaign.theme.accent}
        />
      </ScreenLayout>
    );
  }

  // UNLOCKED SCREEN
  if (screen.type === 'unlocked') {
    return (
      <ScreenLayout accentColor={campaign.theme.accent} showVaultHeader={false}>
        {/* 3D Vault Scene */}
        <div className="absolute inset-0 z-10">
          <VaultScene autoOpen />
        </div>

        {/* Content at bottom - allows taps through to vault */}
        <div className="absolute bottom-0 left-0 right-0 px-6 pb-6 z-20 pointer-events-none">
          <div className="max-w-md mx-auto text-center space-y-3 pointer-events-auto">
            <div>
              <h1 className="text-2xl font-bold text-white">Congratulations!</h1>
              <p className="text-lg italic text-white">you&apos;re an expert codebreaker!</p>
            </div>

            <p className="text-xs text-white/80">Tap the vault to open it</p>

            <p className="text-sm text-white leading-snug">
              Enter your details for a chance to win a{' '}
              <span className="font-bold italic">Quest 3S virtual reality headset</span>
            </p>

            <NeonButton
              onClick={() => setScreen({ type: 'enter' })}
              accentColor={campaign.theme.accent}
              fullWidth
            >
              &gt; {campaign.entry.entryCta}
            </NeonButton>
          </div>
        </div>
      </ScreenLayout>
    );
  }

  // ENTER SCREEN
  if (screen.type === 'enter') {
    const handleFormSubmit = async (e: React.FormEvent) => {
      e.preventDefault();

      if (!agreedToTerms) {
        setFeedback({
          type: 'error',
          message: 'Please agree to the terms',
          visible: true,
        });
        return;
      }

      setIsSubmitting(true);

      try {
        const response = await fetch('/api/submit-entry', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            firstName,
            lastName,
            email,
            campaign: campaign.title,
          }),
        });

        if (response.ok) {
          setSubmitSuccess(true);
        } else {
          throw new Error('Failed to submit');
        }
      } catch {
        setFeedback({
          type: 'error',
          message: 'Failed to submit. Please try again.',
          visible: true,
        });
      } finally {
        setIsSubmitting(false);
      }
    };

    if (submitSuccess) {
      return (
        <ScreenLayout accentColor={campaign.theme.accent} showVaultHeader={false}>
          <div className="absolute bottom-0 left-0 right-0 px-6 pb-6">
            <div className="max-w-md mx-auto text-center space-y-3">
              <h1 className="text-2xl font-bold text-white">Thank You!</h1>
              <p className="text-base text-white">Your entry has been submitted. Good luck!</p>
              <ResetLink onReset={handleReset} />
            </div>
          </div>
        </ScreenLayout>
      );
    }

    return (
      <ScreenLayout accentColor={campaign.theme.accent} showVaultHeader={false}>
        <div className="absolute bottom-0 left-0 right-0 px-6 pb-6">
          <div className="max-w-md mx-auto">
            <form onSubmit={handleFormSubmit} className="space-y-2">
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="First Name"
                required
                autoComplete="given-name"
                autoCapitalize="words"
                enterKeyHint="next"
                className="w-full px-4 py-2.5 min-h-[44px] rounded-lg bg-white/10 border-2 border-white/50 focus:border-white focus:outline-none transition-all text-white text-base placeholder-white/70"
              />
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Last Name"
                required
                autoComplete="family-name"
                autoCapitalize="words"
                enterKeyHint="next"
                className="w-full px-4 py-2.5 min-h-[44px] rounded-lg bg-white/10 border-2 border-white/50 focus:border-white focus:outline-none transition-all text-white text-base placeholder-white/70"
              />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email Address"
                required
                autoComplete="email"
                inputMode="email"
                enterKeyHint="done"
                className="w-full px-4 py-2.5 min-h-[44px] rounded-lg bg-white/10 border-2 border-white/50 focus:border-white focus:outline-none transition-all text-white text-base placeholder-white/70"
              />

              <p className="text-xs text-white/70 leading-snug pt-1">
                By entering, your data will be used to administer the competition. See our{' '}
                <a href="https://redthreadmarketaccess.com/privacy-policy/" target="_blank" rel="noopener noreferrer" className="font-bold underline">Privacy Policy</a>.
              </p>

              <label className="flex items-center gap-2 cursor-pointer py-2 touch-manipulation">
                <input
                  type="checkbox"
                  checked={agreedToTerms}
                  onChange={(e) => setAgreedToTerms(e.target.checked)}
                  className="w-5 h-5 min-w-[20px] rounded border-2 border-white/50 bg-transparent checked:bg-green-500 checked:border-green-500 cursor-pointer accent-green-500"
                />
                <span className="text-sm text-white/80">I agree to the terms</span>
              </label>

              <NeonButton
                type="submit"
                accentColor={campaign.theme.accent}
                disabled={isSubmitting || !agreedToTerms}
                fullWidth
              >
                {isSubmitting ? 'Submitting...' : '> SUBMIT ENTRY'}
              </NeonButton>
            </form>
          </div>
        </div>

        <FeedbackToast
          type={feedback.type}
          message={feedback.message}
          visible={feedback.visible}
          onClose={() => setFeedback((prev) => ({ ...prev, visible: false }))}
          accentColor={campaign.theme.accent}
        />
      </ScreenLayout>
    );
  }

  return null;
}
