# BroadLink RM4C Mini Setup Guide

This document explains how to configure a BroadLink RM4C Mini for Grandma Station.

## Overview

Grandma Station uses IR commands to power on the TV and switch it to the input that shows the call UI.

## Requirements

- BroadLink RM4C Mini
- TV with an IR remote
- Node.js and npm
- The RM4C Mini and the server must be on the same LAN

## Important

Unlock the device in the BroadLink app. If the RM4C Mini is locked, discovery may work but authentication will fail.

## Learn commands

1. Learn each remote button you need.
2. Save the learned hex into `tv/brands/<brand>/ir-codes/`.
3. Map the filenames in `tv/brands/<brand>/commands.json`.

Example commands:

```bash
npm run tv:discover
npm run tv:learn -- power
npm run tv:learn -- hdmi2
```

## Brand layout

Use one folder per TV brand if you need different command maps.

```text
tv/
  brands/
    default/
      commands.json
      ir-codes/
        power.txt
        hdmi1.txt
        hdmi2.txt
```