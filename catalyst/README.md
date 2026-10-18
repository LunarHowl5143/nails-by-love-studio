# Zoho Catalyst Setup

1. Create a Zoho Catalyst project for NAILS BY LOVE STUDIO.
2. Configure development and production environments.
3. Create the Data Store tables described in `data-store-schema.md`.
4. Enable/configure Catalyst Authentication for the owner application.
5. Create a File Store location for media.
6. Deploy the serverless Functions/API handlers under `backend/catalyst/functions`.
7. Configure allowed origins so customer APIs accept the public customer origin and owner APIs accept only the owner dashboard origin as appropriate.
8. Keep privileged secrets server-side. Never expose Catalyst admin credentials in either browser application.

Do not hardcode production IDs or secrets into source control. Use environment configuration.
