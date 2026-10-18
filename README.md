# Nails By Love Studio — Web foundation

This repository contains two intentionally separate Next.js applications:

- `apps/customer-web`: public customer experience with a luxury editorial nail-studio design direction, service/offers/gallery sections, responsive layout, animated cart drawer, and read-only public Catalyst API integration.
- `apps/owner-dashboard`: separate owner workspace UI for bookings, services/extras, offers, gallery, delivery requests, and business settings.

## Important integration status

The customer app reads services, offers and portfolio from the existing public API routes when configured. Its cart is client-side and does not create bookings. Checkout is intentionally not wired until Catalyst Authentication and a secure booking-write API are ready.

The owner dashboard is a **UI preview using sample data and local state**. It is not connected to protected owner APIs yet. Do not use the preview actions to manage real customer data. We will wire it after the server-side owner authorization and write endpoints exist.

The design direction follows the requirements supplied for the project: the first reference is the visual direction (font pairing, background, card styling and restrained hover/pop-up motion); the second reference is the product-behaviour direction (cart, booking flow, offers and owner management). Exact font/CSS/animation values from the references have not been verified, so this is a close directionally styled foundation rather than a claim of pixel-perfect reproduction.

## Requirements

- Node.js 20+ recommended
- npm

## Run customer website

```bash
cd apps/customer-web
npm install
cp .env.example .env.local
npm run dev
```

Open `http://localhost:3000`. To load live content, set `NEXT_PUBLIC_CATALYST_API_BASE_URL` in `.env.local` to the base URL of the existing development Catalyst function, without a trailing slash.

## Run owner dashboard

In a second terminal:

```bash
cd apps/owner-dashboard
npm install
cp .env.example .env.local
npm run dev
```

Open `http://localhost:3001`. This is a preview only; changes are local to the browser session and are not saved to Catalyst.

## Before production

1. Implement and test a public `ServiceExtras` read API.
2. Implement customer registration/login and server-side identity mapping.
3. Implement authenticated booking creation with server-side price/offer validation and transactional or compensating writes for `Bookings` + `BookingItems`.
4. Implement owner-only API authorization and write endpoints for services, extras, offers, portfolio, business settings, booking statuses and delivery reviews.
5. Fix and test timezone-safe appointment calculations using the configured business timezone.
6. Replace sample records and decorative placeholders with approved business content and real portfolio images.
7. Run build, security and end-to-end tests before deployment.
