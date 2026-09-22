# Apna Dental Care — Complete Website Source

This export includes the complete website source, the two-state animated hero, treatment sections, appointment preview, all website images, local fonts, and dependency lockfile.

## Run locally

1. Install Node.js 22.13 or newer.
2. Extract the ZIP and open the `apna-dental-care` folder in your editor (Antigravity or VS Code).
3. Open a terminal in that folder and run:

```sh
npm install -g pnpm@11.25.0
pnpm install --frozen-lockfile
pnpm dev
```

Open http://localhost:5173 in your browser. Stop the server with Ctrl+C.

Dependencies are downloaded during installation; internet access is needed. The ZIP does not include node_modules or generated build output. No API key is required for the current website preview.

## Build and preview

```sh
pnpm build
pnpm start
```

Open the address printed by the preview server. This project uses React, TypeScript, Tailwind CSS and vinext, with a Cloudflare Worker production build. It is not a standalone HTML file that can be opened by double-clicking.

## Edit the website

- `app/page.tsx`: page sections and interactions.
- `app/globals.css`: website styles and brand colors.
- `app/layout.tsx`: page metadata and fonts.
- `components/hero-story.tsx`: coordinated hero slides, headlines, descriptions and controls. Add entries to `heroSlides` to extend it.
- `components/hero-story.css`: hero layout, transitions and responsive styling.
- `public/images/`: all website photography and logo assets.
- `public/fonts/`: locally hosted fonts and their license.
- `README.md`: additional framework and hosting documentation.

## Before using for a real clinic

The appointment form is a validated demonstration; it does not send or save bookings. Connect a booking service and replace demo content with verified clinic details before collecting patient information. Photography is illustrative.

The included hosting metadata relates to the existing Apna Dental Care Site. Configure your own hosting project if deploying this export independently.
