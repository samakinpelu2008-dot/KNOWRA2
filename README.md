# Knowra - public site (PWA) v4

Upload ALL files to the root of your GitHub Pages repo or Vercel project.

## Setup
1. index.html > SITE_CONFIG: set supportEmail and studioUrl.
2. Firebase console > Firestore > Rules: paste firestore.rules and Publish. (This is REQUIRED - likes, ratings, follow and profiles depend on it.)
3. Indexes are optional. The app works without them and uses them automatically when present.
4. Open the Admin app > Settings > "Upgrade existing publications" once.
5. After updating, close and reopen the app once so the new version loads.

## Check everything
Sign in, then open the account menu > Diagnostics. Every line must say OK. A red line says exactly what to fix.

## Profile
Top bar person icon (or account menu > My profile): details, username, your books and articles, saved items, following, followers, edit.

## WhatsApp previews (optional, Vercel only)
Deploy this folder to Vercel and set cleanShare: true in SITE_CONFIG. Links become https://yourdomain/article/my-title with the right title.
On GitHub Pages leave it false; links use #/article/my-title.
