# Vault Codebreaker

A mobile-first web application for interactive puzzle-solving campaigns. Users solve clues to collect letters and unscramble the final keyword to "unlock the vault."

## Features

- **Mobile-first design** with dark navy gradients and neon red accents
- **Fully configurable** campaigns via JSON - no code changes needed
- **Flexible question count** - support for any number of questions (3, 5, 10, etc.)
- **Configurable answer length** - support for any final answer length
- **Progress tracking** via localStorage (no database required)
- **Route guarding** - users must complete questions in order
- **Letter picker UI** with smooth animations and feedback
- **No personal data collection** during gameplay
- **GDPR-friendly** with external form integration

## Tech Stack

- Next.js 14 (App Router)
- React 18
- TypeScript
- Tailwind CSS
- Deployed on Vercel (or any Node.js host)

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

The default campaign will be available at `/c/reimbursement-vault-2026`.

### Build for Production

```bash
npm run build
npm start
```

## Deploy to Vercel

1. Push your code to GitHub
2. Import your repository in Vercel
3. Vercel will auto-detect Next.js and deploy
4. No environment variables needed

## How to Update Questions for Next Year

This is the key feature: **updating campaigns requires editing only one file.**

### Step 1: Edit the Campaign Config

Open `src/data/campaigns.json`

### Step 2: Update Campaign Settings

```json
{
  "slug": "your-campaign-2027",
  "version": "2.0",
  "title": "Your Campaign Title",
  "theme": {
    "accent": "#ff2b2b"
  }
}
```

**Important:** Increment the `version` field whenever you make changes. This will automatically reset user progress to prevent mismatched states.

### Step 3: Update Copy

```json
{
  "copy": {
    "landingTitle": "Can you solve the clues?",
    "landingBody": "Your description here...",
    "howToPlaySteps": [
      "Step 1",
      "Step 2",
      "Step 3",
      "Step 4"
    ],
    "prizeTitle": "Vault Unlocked!",
    "prizeBody": "You've won! Enter for your prize."
  }
}
```

### Step 4: Set Final Answer and Code Length

```json
{
  "code": {
    "finalAnswer": "TREASURE",
    "codeLength": 8,
    "caseSensitive": false,
    "stripSpaces": true
  }
}
```

- `finalAnswer`: The correct answer users must unscramble
- `codeLength`: (Optional) Number of circles to show. If omitted, uses `finalAnswer.length`
- `caseSensitive`: Whether answer matching is case-sensitive
- `stripSpaces`: Whether to ignore spaces in answers

### Step 5: Update Questions

```json
{
  "questions": [
    {
      "prompt": "What letter starts the word 'Tiger'?",
      "inputMode": "LETTER_PICKER",
      "accepted": {
        "type": "LETTER",
        "value": "T"
      },
      "rewards": {
        "type": "LOCK_LETTER",
        "letter": "T",
        "position": null
      },
      "helperText": "Think of big cats"
    }
  ]
}
```

**To add more questions:** Add more objects to the array.

**To remove questions:** Delete objects from the array.

**To reorder questions:** Move objects in the array.

### Step 6: Understanding Position-Based Letter Locking

By default, letters are collected in the order questions are answered (`position: null`).

If you want letters to appear in specific positions regardless of question order:

```json
{
  "rewards": {
    "type": "LOCK_LETTER",
    "letter": "T",
    "position": 0
  }
}
```

This locks the letter "T" into the first circle (index 0), even if it's the last question answered.

**Use case:** You want to reorder questions but keep the final anagram layout the same.

### Step 7: Update Entry Form URL

```json
{
  "entry": {
    "entryFormUrl": "https://your-form-provider.com/entry",
    "entryCta": "ENTER DETAILS"
  }
}
```

### Step 8: Test Your Changes

1. Save `campaigns.json`
2. Restart dev server: `npm run dev`
3. Navigate to `/c/your-campaign-slug`
4. Test the full flow

## Config Examples

### Example: 3 Questions, 3-Letter Answer

```json
{
  "slug": "mini-vault-2027",
  "version": "1.0",
  "code": {
    "finalAnswer": "CAT",
    "caseSensitive": false,
    "stripSpaces": true
  },
  "questions": [
    {
      "prompt": "First letter of 'Computer'?",
      "accepted": { "type": "LETTER", "value": "C" },
      "rewards": { "type": "LOCK_LETTER", "letter": "C" }
    },
    {
      "prompt": "First letter of 'Apple'?",
      "accepted": { "type": "LETTER", "value": "A" },
      "rewards": { "type": "LOCK_LETTER", "letter": "A" }
    },
    {
      "prompt": "First letter of 'Tiger'?",
      "accepted": { "type": "LETTER", "value": "T" },
      "rewards": { "type": "LOCK_LETTER", "letter": "T" }
    }
  ]
}
```

### Example: 10 Questions, 6-Letter Answer

```json
{
  "code": {
    "finalAnswer": "REWARD",
    "codeLength": 6
  },
  "questions": [
    // 6 questions that award letters
    { "prompt": "Q1", "accepted": { "value": "R" }, "rewards": { "letter": "R" } },
    { "prompt": "Q2", "accepted": { "value": "E" }, "rewards": { "letter": "E" } },
    { "prompt": "Q3", "accepted": { "value": "W" }, "rewards": { "letter": "W" } },
    { "prompt": "Q4", "accepted": { "value": "A" }, "rewards": { "letter": "A" } },
    { "prompt": "Q5", "accepted": { "value": "R" }, "rewards": { "letter": "R" } },
    { "prompt": "Q6", "accepted": { "value": "D" }, "rewards": { "letter": "D" } },
    // 4 bonus questions with no letter rewards
    { "prompt": "Bonus Q1", "accepted": { "value": "X" }, "rewards": { "type": "NONE" } },
    { "prompt": "Bonus Q2", "accepted": { "value": "Y" }, "rewards": { "type": "NONE" } },
    { "prompt": "Bonus Q3", "accepted": { "value": "Z" }, "rewards": { "type": "NONE" } },
    { "prompt": "Bonus Q4", "accepted": { "value": "Q" }, "rewards": { "type": "NONE" } }
  ]
}
```

## Multiple Campaigns

You can run multiple campaigns simultaneously. Each campaign is isolated by its slug:

```json
{
  "campaigns": [
    { "slug": "campaign-2026", ... },
    { "slug": "campaign-2027", ... },
    { "slug": "holiday-special", ... }
  ]
}
```

Users access campaigns via `/c/[slug]`.

Progress is stored separately per campaign slug in localStorage.

## Routes

- `/c/[slug]` - Landing page
- `/c/[slug]/how-to-play` - Instructions
- `/c/[slug]/q/[index]` - Question pages (1-indexed)
- `/c/[slug]/final` - Final keyword entry
- `/c/[slug]/unlocked` - Success screen
- `/c/[slug]/enter` - Prize entry with external form link
- `/privacy` - Privacy policy
- `/terms` - Terms of service

## Architecture Notes

- **No database** - Progress stored in browser localStorage only
- **Version checking** - When campaign version changes, old progress is automatically reset
- **Route guards** - Users cannot skip ahead or access pages out of order
- **Responsive design** - Mobile-first with support for larger screens
- **No tracking** - No analytics, no cookies (except localStorage for gameplay)

## Browser Support

- Modern browsers (Chrome, Safari, Firefox, Edge)
- Mobile browsers (iOS Safari, Chrome Mobile)
- Requires localStorage support

## License

Proprietary - All rights reserved

## Support

For questions or issues, contact your development team.
