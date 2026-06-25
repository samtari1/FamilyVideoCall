# Architecture

Grandma Station is split into a small UI layer and a hardware control layer.

## Flow

Family UI -> WebSocket server -> TV controller -> BroadLink driver -> RM4C Mini -> Television

## Responsibilities

- `public/` handles the browser UI and call state.
- `server.js` relays call state and triggers hardware actions.
- `tv/tvController.js` translates business actions like `powerOn()` and `switchToGrandmaInput()` into device commands.
- `tv/broadlink.js` owns BroadLink discovery, authentication, learning, and sending.
- `tv/brands/<brand>/` stores the brand-specific command map and IR codes.

## Why this shape

The browser pages and server should not know how BroadLink works. They should only request an intent such as `call` or `dashboard`, and the TV controller should decide how to satisfy that intent for the current hardware.