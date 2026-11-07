# Freeboard City

Free property trading for 2–8 friends, including an 80-space map with cities in India, Pakistan, Albania, and Greece. Includes private rooms, bots, auctions, trades, houses, hotels, mortgages, prison pardon cards, and configurable rules.

## Play locally

Requires Node.js 22 or newer. No npm dependencies, account, subscription, or hosting credits are needed.

On macOS, double-click **Start Freeboard.command**, or run this from the project folder:

```sh
npm start
```

Open **http://localhost:4173**. Keep the terminal open while playing. Press Control+C to stop. Restart with the same command to resume saved rooms. Use the same browser and hostname to retain your player seat.

The server saves rooms in `.local/rooms.json`. Keep this file private because it contains player credentials. The downloadable source ZIP excludes saved rooms. One server process should own each data file.

## Friends on the same Wi-Fi

```sh
npm run start:lan
```

Open the Wi-Fi address printed in the terminal on each device. Create a room through that Wi-Fi address so the copied invitation works for friends. Allow the local server through the macOS firewall if prompted. This serves your game on your local network and works while your computer is awake. Friends elsewhere need an internet deployment or a tunnel; a localhost link is only usable on your own computer.

## Board controls

Readable mode gives every city its own upright label and flag. Scroll inside the board to explore large maps. Use **Fit board** for an overview, **+ / −** for zoom, and **Find my pawn** to return to your position. Turn actions stay above the board while you scroll. **Browse cities** searches cities, countries, districts, and ownership.

## Development and hosting

```sh
npm test
npm run build
node smoke.mjs http://localhost:4173
```

`npm run build` generates `dist/server/index.js`, a Cloudflare Worker with an embedded UI. Internet hosting requires a compatible Worker host and a D1 `DB` binding with the schema in `drizzle/`. The former Sites URL was https://freeboard-city.blithecivet128.chatgpt.site. The local version runs independently of that account. The `.openai/hosting.json` preserves the original project identity for later reconnection.

