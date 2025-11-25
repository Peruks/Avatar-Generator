# BaseStyle Lab — Avatar Generator

A client-only Farcaster Mini App for generating stylized avatars using Canvas and local assets.

## Features
- **Client-Side Only**: No external APIs required.
- **Avatar Editor**: Upload, crop, and apply styles (Posterize, Pixel, Neon, Comic).
- **Trait System**: Layer assets (hair, eyes, etc.) on top of your avatar.
- **Local Storage**: Saves avatars to IndexedDB.
- **Export**: Download as PNG or ZIP pack with metadata.
- **PWA Ready**: Installable on mobile.

## Setup

1.  **Install Dependencies**:
    ```bash
    npm install
    ```

2.  **Run Development Server**:
    ```bash
    npm run dev
    ```

3.  **Build for Production**:
    ```bash
    npm run build
    npm start
    ```

## Farcaster Mini App Deployment

1.  **Deploy to Vercel**:
    - Push this repo to GitHub.
    - Import into Vercel.
    - Deploy.

2.  **Configure Farcaster**:
    - Update `public/.well-known/farcaster.json` with your deployed URL.
    - Register your app on Farcaster (Warpcast -> Settings -> Developer -> Mini Apps).

## Troubleshooting
- **Missing Node/NPM**: Ensure Node.js is installed on your system.
- **Canvas Issues**: Some styles require modern browser support for Canvas API.
