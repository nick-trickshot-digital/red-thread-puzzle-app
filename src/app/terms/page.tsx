import ScreenLayout from '@/components/ScreenLayout';
import Link from 'next/link';

export default function TermsPage() {
  return (
    <ScreenLayout showVaultHeader={false}>
      <div className="flex-1 px-6 py-12">
        <div className="max-w-2xl mx-auto space-y-6">
          <h1 className="text-3xl font-bold">Terms of Service</h1>

          <div className="space-y-4 text-zinc-300 leading-relaxed">
            <p>
              By using the Vault Codebreaker application, you agree to these
              terms of service.
            </p>

            <h2 className="text-xl font-bold text-white pt-4">Usage</h2>
            <p>
              This application is provided for entertainment and promotional
              purposes. You may play the game and attempt to solve the puzzle as
              intended.
            </p>

            <h2 className="text-xl font-bold text-white pt-4">
              Prize Eligibility
            </h2>
            <p>
              Prize eligibility and rules are subject to the specific terms
              provided in the entry form. Completing the puzzle does not
              guarantee prize eligibility or receipt.
            </p>

            <h2 className="text-xl font-bold text-white pt-4">
              No Warranty
            </h2>
            <p>
              This application is provided "as is" without warranty of any kind.
              We do not guarantee uninterrupted access or error-free operation.
            </p>

            <h2 className="text-xl font-bold text-white pt-4">Fair Play</h2>
            <p>
              Users are expected to solve puzzles fairly without attempting to
              exploit, hack, or reverse-engineer the application.
            </p>

            <h2 className="text-xl font-bold text-white pt-4">
              Changes to Terms
            </h2>
            <p>
              We reserve the right to modify these terms at any time. Continued
              use of the application constitutes acceptance of updated terms.
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
