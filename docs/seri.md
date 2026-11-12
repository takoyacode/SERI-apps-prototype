# SERI

SERI uses Next.js, Payload, and Tailwind. The previous Vite design is preserved
in Git history; the app has been migrated rather than replacing the Payload template.

## Application

- `/`: Beranda, program day, daily check-in, progress, creator and article carousels.
- `/rutinitas`: morning/evening completion and the editable skincare catalog.
- `/explore`: educational articles, category/search filters, and public creator channels.
- `/profil`: account, skin profile, program, reminder preferences, privacy, and feedback.
- `/check-in`: emoticon reflection, four symptom scores, reactions, and a private journal.
- `/progres`: actual check-in history, symptom chart, and routine totals.
- `/tanya`: article-based educational guide, explicitly not a generative AI service.

Application pages are static shells with tagged, cached public CMS reads.
Private account data is fetched separately and is never included in cached HTML.
CMS hooks invalidate the shared `seri-content` tag and affected pages on changes
and deletions. Media writes also invalidate dependent views. A public revision
check when a page opens covers CLI writes outside the Next.js cache context;
its content read is cached by revision, not replaced by a static fixture.

## Accounts and private data

Application email/password accounts use `users`, not the Figma SSO `admins`
collection. `createAppAuth` uses Payload-native login/JWT verification and a
dedicated HTTP-only `app-session` cookie. It never forwards ambient CMS cookies
into app authentication. The application uses a named Payload instance through
the existing shared loader to initialize new app-user strategies independently
of the Admin singleton's hot-reload lifecycle.

Check-ins, daily routine completion, skin profiles, and reminder preferences
persist in Payload. Server routes validate and allowlist submitted fields.
Collection rules enforce ownership and protect plan, phase, and program-start
fields. A confirmed account deletion removes associated private records and
profile uploads before removing the account.

Avatar uploads are deliberately public images, with explicit consent in the
upload UI; medical/progress images should not be uploaded there. Journal and
check-in content is private. The privacy view exports up to the 100 latest
check-ins/routine records loaded by the application.

## CMS

Editors use the existing `/admin` integration. The application adds:

- Products: ingredients, composition notes, rationale, estimates, source dates,
  brand URLs, verified marketplace links, and affiliate disclosure.
- Articles: educational copy, category, sources, reading time, and Media relationships.
- Creators: public channels, expertise, descriptions, and optional Media portraits.
- Beranda SERI: hero text/photo and the gentle advice.
- Feedback: private member messages and non-binding interest in Pro.

Starter records were created and read back through the installed Payload CLI.
Product illustrations are labeled as illustrations. Article photographs are
stored as Media relationships and rendered through the template's image loader.

## Integration boundaries

- Google OAuth is not configured; its control explains this rather than claiming a connection.
- The chat searches curated articles; it is not connected to an AI model.
- Pro records non-binding interest, not payment, subscription, or a free-trial charge.
- Product prices are editorial estimates, not scraped/live store prices.
  Shopee/TikTok links only appear once the editor has supplied verified official
  store links. No affiliate URLs are fabricated.
- Reminder preferences persist. Notifications can be shown while SERI is open,
  with browser permission; background push delivery is not configured.
- No diagnosis, healing deadline, or automatic medical phase upgrade is generated.

## Verification

Use the repository entry points:

```sh
pnpm exec tsc --noEmit
figma make verify-bootstrap
figma make verify-deploy
```

`pnpm run format <intended-paths>` formats changed source.
The host manages the development server; do not start a second development server.
