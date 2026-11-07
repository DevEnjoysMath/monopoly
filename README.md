# Freeboard City

Live: https://freeboard-city.blithecivet128.chatgpt.site

Create a room, choose a map, and copy its invite link. Friends enter their names and join before the host starts. Supports 2–8 human players. Keep the same browser to resume a seat; the player credential stays in local storage. Room state is held in D1, with revision checks preventing concurrent actions from overwriting one another. Clients poll every 1.5 seconds.

Maps: World Tour (40), Grand Europe (48), Global Empire (64). Rules include buying, rent, color sets, houses/hotels, even construction, trades, mortgages, jail, doubles, bankruptcy, and optional round limits and park jackpots.

Run `npm test` for game rules; `npm run build` emits the deployable Worker. `node smoke.mjs` checks two independent players against the live API and creates a test room.

## REA investigation

The official morluto/rea repository was cloned beside this project at `../rea-tools`. The official `rea-agents@6.8.0` CLI ran its Playwright browser scenario against https://richup.io/. Successful home-page observation: `ev_5b885606afd6b70491f72e5ea8feae3a3a0fc1e2f9751131d7b118cf014ea3b3`. It observed the nickname, Play / All rooms / Create a private game controls and the public rules. The attempt to inspect private-room setup timed out at the cookie-consent action and did not establish the room's behavior. No reference server source or internal protocol was recovered.

This is an independent implementation of the property trading loop. It does not reproduce Richup's full UI, animations, auctions, public matchmaking, accounts, or cosmetic store. City events are a small original deck; maps and assets are original. REA is an investigation tool, not the game's runtime.
