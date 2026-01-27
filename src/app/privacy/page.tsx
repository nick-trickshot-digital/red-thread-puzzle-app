import ScreenLayout from '@/components/ScreenLayout';
import Link from 'next/link';

export default function PrivacyPage() {
  return (
    <ScreenLayout showVaultHeader={false}>
      <div className="flex-1 px-6 py-12">
        <div className="max-w-2xl mx-auto space-y-6">
          <h1 className="text-3xl font-bold">Privacy Policy</h1>

          <div className="space-y-4 text-zinc-300 leading-relaxed">
            <p>
              This privacy policy describes how we handle information in the
              Vault Codebreaker application.
            </p>

            <h2 className="text-xl font-bold text-white pt-4">
              Gameplay Data
            </h2>
            <p>
              During gameplay, we store your progress locally in your browser
              using localStorage. This includes which questions you've answered
              and the letters you've collected. No personal information is
              collected during gameplay, and this data never leaves your device.
            </p>

            <h2 className="text-xl font-bold text-white pt-4">
              Entry Form Data
            </h2>
            <p>
              If you choose to enter the prize draw by clicking the entry form
              link, you will be directed to an external form. Any personal
              information you provide on that form is subject to the privacy
              policy of that external service.
            </p>

            <h2 className="text-xl font-bold text-white pt-4">Cookies</h2>
            <p>
              We do not use cookies or tracking scripts in this application.
              Progress is saved using browser localStorage only.
            </p>

            <h2 className="text-xl font-bold text-white pt-4">Contact</h2>
            <p>
              For questions about this privacy policy, please contact us through
              our website.
            </p>
          </div>

          <div className="pt-8">
            <Link
              href="/"
              className="text-neon-red underline hover:text-red-400"
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    </ScreenLayout>
  );
}
