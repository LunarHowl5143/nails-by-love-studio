# Architecture

```text
                     INTERNET
                        |
          +-------------+-------------+
          |                           |
          v                           v
  CUSTOMER WEB                  OWNER DASHBOARD
  Public Next.js                Private Next.js
          |                           |
          +-------------+-------------+
                        |
                        v
                  CATALYST API
                        |
          +-------------+-------------+
          |             |             |
          v             v             v
      Data Store    File Store    Functions
          |                           |
          +-------------+-------------+
                        |
                        v
                 Business Rules
```

## Security boundary

The customer app only accesses published/public business data and creates customer-facing requests through controlled APIs. It has no owner credentials, admin routes, or privileged Catalyst secrets.

The owner dashboard authenticates separately and calls protected owner APIs. Authorization is enforced server-side in Catalyst Functions/API handlers, never only in the browser.

## Core Catalyst resources

### Data Store tables
- `services`
- `offers`
- `portfolio_items`
- `bookings`
- `booking_items`
- `delivery_requests`
- `business_settings`
- `audit_logs`

### File Store
Used for portfolio images, service images, and other owner-managed media. Store file identifiers/paths in Data Store records, not binary data in tables.

### Functions
Suggested API boundary:
- `public-content`
- `create-booking`
- `create-delivery-request`
- `owner-content`
- `owner-bookings`
- `owner-settings`
- `media`

Function names can be consolidated as implementation evolves; the important rule is that business rules stay server-side.

## Data flow

Owner edits a service -> authenticated owner API -> validation -> Catalyst Data Store -> customer reads published data.

Customer books -> create-booking API -> validation -> Data Store transaction/ordered writes -> owner dashboard reads booking.

Owner changes booking status -> protected owner API -> Data Store -> customer booking status endpoint reflects the new state.
