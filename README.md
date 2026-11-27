# rn-fe — রেন্ট এ কার (Frontend)

Bangla, mobile-friendly rent-a-car management site: গাড়ি, ড্রাইভার, ট্রিপ, খরচ, বাকি আর ড্যাশবোর্ড. Phone e "Add to Home screen" korle app er moto chole.

**Stack:** Next.js 16 (App Router) · Tailwind v4 · radix-ui · sonner · zod
**Backend:** [rm-be](https://github.com/Arifur999/rm-be)

## Structure
- Page (Server Component) → `services/*.services.ts` → `lib/httpClient.ts` → API
- Form → `_action.ts` ("use server", never throws) → service → API
- Browser kokhono API URL ba token dekhe na. Login token thake httpOnly cookie te.
- `src/proxy.ts`: login charai sob page `/login` e pathay.
- Roles: **super admin** "ইউজার" page theke account banay ar password reset kore. **Owner (মালিক)** sob hisab dekhe ar lekhe.

## Run
```bash
cp .env.example .env.local   # API_BASE_URL=http://localhost:5000/api/v1
npm install
npm run dev                  # http://localhost:3000
```
Check: `npm run typecheck && npm run lint && npm test`

## Deploy (Vercel, free)
New project → ei repo → env `API_BASE_URL=https://<backend>.vercel.app/api/v1`.

Built by [Arif](https://www.instagram.com/arif_xtwo)
