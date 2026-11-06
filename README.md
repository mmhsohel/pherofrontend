# StudioSpace

**Peer-to-peer marketplace for creative workspaces and production studios.**

Discover, compare and reserve photography cyc walls, film sound stages, podcast lounges, music suites and art workshops, with transparent pricing and conflict-free booking.

[![Live Site](https://img.shields.io/badge/Live-studiopha.netlify.app-E8590C?style=for-the-badge)](https://studiopha.netlify.app)

![Next.js](https://img.shields.io/badge/Next.js-App_Router-000000?logo=nextdotjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?logo=tailwindcss&logoColor=white)
![DaisyUI](https://img.shields.io/badge/DaisyUI-5A0EF8?logo=daisyui&logoColor=white)
![Better Auth](https://img.shields.io/badge/Better_Auth-1C1917)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?logo=mongodb&logoColor=white)

---

## Table of Contents

1. [Live Demo](#live-demo)
2. [Examiner Test Credentials](#examiner-test-credentials)
3. [Features](#features)
4. [Tech Stack](#tech-stack)
5. [Architecture](#architecture)
6. [Application Routes](#application-routes)
7. [Project Structure](#project-structure)
8. [Local Setup](#local-setup)
9. [Environment Variables](#environment-variables)
10. [Available Scripts](#available-scripts)
11. [Security](#security)
12. [Deployment](#deployment)
13. [Related Repositories](#related-repositories)
14. [Roadmap](#roadmap)

---

## Live Demo

| Resource | Link |
|---|---|
| Production site | https://studiopha.netlify.app |
| Client repository | https://github.com/mmhsohel/pherofrontend |
| Server repository | _Add your server repository URL here_ |

## Examiner Test Credentials

| Role | Email | Password |
|---|---|---|
| Examiner (guest and host) | `examiner@studiospace.com` | `Studio123` |

Google sign-in is also available on the Login and Register pages. Email verification and password recovery are intentionally not enforced, so testing is not blocked.

**Suggested walkthrough:** log in, open **My Bookings** to see all four booking statuses, open **My Studio Listings** to edit or delete a listing, then try booking an already confirmed slot to see the double-booking protection.

---

## Features

- **Studio discovery:** search by name or location, filter by category, and sort by newest, rating or price. Home categories deep-link into Explore with the filter pre-selected.
- **Rich studio pages:** image gallery carousel, full specifications, amenities, host details, ratings and guest reviews.
- **Reviews:** logged-in guests can post a star rating and comment. The studio average updates immediately.
- **Booking engine:** date and time-range selection, live price breakdown (rate x hours + deposit), visible taken slots, and server-side rejection of overlapping confirmed bookings.
- **Booking management:** status badges (Pending, Confirmed, Completed, Cancelled), status filter tabs, and cancellation for pending bookings.
- **Host tools:** create, update and delete listings with image upload, amenity tags and read-only host identity. Ownership is enforced on the server.
- **PDF invoices:** downloadable receipt for confirmed bookings.
- **Wishlist:** save favorite studios from the card heart icon.
- **Theme system:** light and dark themes across the whole interface.
- **Resilient UX:** skeleton loaders, branded 404 page, friendly empty states, and toast and modal feedback instead of browser alerts.
- **Responsive design:** mobile, tablet and desktop layouts with equal-height cards and consistent spacing.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js (App Router), React |
| Language | TypeScript |
| Styling | Tailwind CSS, DaisyUI |
| Authentication | Better Auth (email and password, Google OAuth), MongoDB adapter |
| API access | Same-origin proxy to the Express API through Next.js rewrites |
| UI libraries | Swiper (sliders), Lucide and React Icons, Sonner (toasts), next-themes |
| Documents | @react-pdf/renderer (invoices) |
| Hosting | Netlify |

Backend: Express.js, MongoDB, JWT in HTTP-only cookies (see the server repository).

---

## Architecture

```
Browser
  |  same-origin requests (cookies attached automatically)
  v
Next.js client (Netlify)
  |-- /api/auth/*          Better Auth (sessions in MongoDB)
  |-- /api/server-auth/*   rewrite -> Express  (issues JWT cookie)
  |-- /api/studios/*       rewrite -> Express
  |-- /api/bookings/*      rewrite -> Express
  |-- /api/wishlist/*      rewrite -> Express
  v
Express API  ->  MongoDB Atlas
```

**Authentication flow**

1. Better Auth signs the user in (email and password or Google) and stores the session in MongoDB.
2. After login, the client calls the JWT endpoint. Express validates the session and sets a signed JWT in an HTTP-only cookie.
3. Every protected mutation (create, update or delete a studio, create a booking) must carry a valid JWT, otherwise the API returns `401 Unauthorized`.

Because the browser only talks to the client domain, cookies stay first-party and are not affected by third-party cookie blocking.

---

## Application Routes

| Route | Access | Description |
|---|---|---|
| `/` | Public | Hero slider, featured studios, categories, how booking works, host guarantee |
| `/studios` | Public | Explore with search, category filter and sorting |
| `/studios/[id]` | Public | Studio details, gallery, reviews, booking modal |
| `/how-it-works` | Public | Guest and host workflows, FAQ |
| `/about` | Public | Mission, story, values, team |
| `/login`, `/register` | Public | Authentication |
| `/dashboard` | Private | Account overview |
| `/add-studio` | Private | Create a listing |
| `/studios/edit/[id]` | Private | Update a listing (owner only) |
| `/my-listings` | Private | Manage owned listings |
| `/my-bookings` | Private | Track and cancel reservations, download invoices |

Private routes are guarded at the edge and on the client, so a logged-in user is not redirected to Login on reload.

---

## Project Structure

```
src/
  app/                  App Router pages and layouts
    api/auth/[...all]/  Better Auth handler
  components/
    layout/             Navbar, Footer, ThemeToggle
    home/               HeroSlider, FeaturedStudios, Categories, ...
    studios/            StudioCard, BookingModal, ReviewForm, ConfirmModal, ...
  lib/                  auth, auth-client, api helper, upload
  middleware.ts         Private route protection
public/                 Static assets and hero images
```

---

## Local Setup

**Prerequisites:** Node.js 20 or later, a MongoDB Atlas database, and the running StudioSpace API.

1. Clone the repository and enter it:

   ```bash
   git clone https://github.com/mmhsohel/pherofrontend.git
   cd pherofrontend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create `.env.local` in the project root and fill in the values from the table below.

4. Start the API from the server repository (default port `5000`).

5. Start the client:

   ```bash
   npm run dev
   ```

6. Open http://localhost:3000.

---

## Environment Variables

| Variable | Description |
|---|---|
| `MONGODB_URI` | MongoDB connection string used by Better Auth |
| `BETTER_AUTH_SECRET` | Long random string for signing sessions |
| `BETTER_AUTH_URL` | Public URL of the client (`http://localhost:3000` locally) |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret |
| `API_URL` | Base URL of the Express API (`http://localhost:5000` locally) |
| Image upload keys | Credentials for your image host, as used by `src/lib/upload.ts` |

Never commit `.env.local`. Add the same variables in your hosting dashboard for production.

---

## Available Scripts

| Command | Purpose |
|---|---|
| `npm run dev` | Start the development server |
| `npm run build` | Create a production build |
| `npm run start` | Run the production build |
| `npm run lint` | Run ESLint |

---

## Security

- JWT stored in **HTTP-only cookies**, never exposed to client scripts.
- Mutations are protected server-side and return `401 Unauthorized` without a valid token.
- Listing ownership is enforced inside database queries, so users can only edit or delete their own studios.
- Booking collisions are checked against confirmed bookings before saving (`409 Conflict` with a clear message).
- Owner identity is taken from the token, never from the request body.
- Secrets live in environment variables only.

---

## Deployment

The client is deployed on **Netlify**.

1. Connect the repository and set the build command to `npm run build`.
2. Add every variable from [Environment Variables](#environment-variables), with `BETTER_AUTH_URL=https://studiopha.netlify.app` and `API_URL` set to the deployed API.
3. In the Google Cloud console, add the redirect URI `https://studiopha.netlify.app/api/auth/callback/google`.
4. In MongoDB Atlas, allow access from your hosting provider's network.
5. Set the API's `CLIENT_URL` to `https://studiopha.netlify.app` so CORS accepts the client.

---

## Related Repositories

- **Server (Express API):** _Add your server repository URL here_

---

## Roadmap

- Host-side booking inbox with confirm and decline actions
- Online payments for deposits
- Calendar sync for hosts
- Review moderation and host replies
- Map view for Explore