# Cubic FTC website

React + TypeScript + Vinext, with Firebase Authentication and Realtime Database.

## Development

Use Node 22.13 or newer. Run `npm install`, then `npm run dev`. Run `npm run build` for production.

## Team content

Only Firebase records are displayed. Members live under `cubic/members` and robots under `cubic/robots`. The public web configuration is in `public/firebase-config.json`.

Open `/admin` and sign in with a Firebase email/password account. Administrator access requires `admins/{uid}: true` in Realtime Database. The rules in `firebase/database.rules.json` enforce public profile reads and administrator-only writes. Apply changes to those rules through Firebase Console.

Each robot supports dimensions, weight, materials, programming tools, drivetrain, custom specifications, display order and homepage featuring. Multiple robots can be featured together. Members support roles, biographies, photo URLs and display order. Photos use publicly reachable HTTPS URLs. Missing photos are omitted.

## Appearance

Light and dark themes follow the system preference initially. The header theme switch remembers the visitor's explicit choice on that device. The supplied Cubic SVG is used in white for dark mode and black for light mode, in both header and footer. The user-supplied favicon is retained. Team admin is linked from the footer only.

## Verification

Public Firebase reads and record validation were verified. Testing does not create or delete live records. Administrator sign-in and writes require an approved user's session.
