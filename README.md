# FamilyVideoCall

Grandma Station is a small video-call appliance with a browser UI and optional TV hardware control.

## Layout

- `public/` contains the browser pages.
- `server.js` hosts the web app and websocket relay.
- `tv/` contains the BroadLink-based hardware controller and brand-specific IR codes.
- `scripts/` contains the operational shell entrypoints.
- `docs/` contains installation and architecture notes.

## Run

```bash
npm install
npm start
```

## TV control

Set `TV_BRAND` to select a brand folder under `tv/brands/`. The default brand is `default`.
