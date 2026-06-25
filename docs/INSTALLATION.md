# Installation

## Prerequisites

- Node.js 18 or newer
- `npm install`
- A BroadLink RM4C Mini on the same LAN as this server

## Install

```bash
npm install
```

## Configure TV control

1. Add your learned IR codes under `tv/brands/<brand>/ir-codes/`.
2. Map command names in `tv/brands/<brand>/commands.json`.
3. Select the active brand with `TV_BRAND=<brand>`.
4. Set the input used by Grandma Station with `TV_GRANDMA_INPUT=hdmi2` if needed.

## Useful commands

```bash
npm run tv:discover
npm run tv:learn -- power
npm run tv:send -- power
```